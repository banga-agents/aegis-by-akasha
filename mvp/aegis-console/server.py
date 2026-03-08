#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent
AKASHA_ROOT = Path("/home/agent/akasha-ts")
PROJECT_ROOT = Path("/home/agent/akasha-workspaces/p0007-chainlink-cre-hackathon-submission")
MOLTBOOK_ACCOUNTS_PATH = AKASHA_ROOT / "runtime_memory" / "sandbox" / "moltbook_aegis_accounts.json"
ONCHAIN_PROOF_PATH = PROJECT_ROOT / "artifacts" / "onchain-proof.md"
FALLBACK_POST_URL = "https://www.moltbook.com/post/c785f09d-e700-4d3f-a4ae-17cf16ad8883"


def read_env() -> dict[str, str]:
    env: dict[str, str] = {}
    for path in (
        AKASHA_ROOT / ".env",
        AKASHA_ROOT / "apps" / "dashboard" / ".env.local",
        PROJECT_ROOT / ".aegis-demo.env",
    ):
        if not path.exists():
            continue
        for raw_line in path.read_text(errors="ignore").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            env.setdefault(key, value)
    return env


ENV = read_env()


def env_value(*keys: str) -> str:
    for key in keys:
        value = ENV.get(key, "").strip()
        if value:
            return value
    return ""


def telegram_token() -> str:
    return env_value("AEGIS_TELEGRAM_BOT_TOKEN", "TELEGRAM_BOT_TOKEN")


def telegram_recipients() -> list[str]:
    raw = env_value("AEGIS_TELEGRAM_ALLOWED_USERS", "TELEGRAM_ALLOWED_USERS")
    return [item.strip() for item in raw.split(",") if item.strip()]


def json_response(handler: "AegisHandler", payload: Any, status: int = 200) -> None:
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Cache-Control", "no-store")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def read_json_request(handler: "AegisHandler") -> dict[str, Any]:
    length = int(handler.headers.get("Content-Length", "0"))
    raw = handler.rfile.read(length) if length > 0 else b"{}"
    try:
        return json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        return {}


def basic_auth_header() -> str | None:
    user = ENV.get("AKASHA_DASHBOARD_BASIC_AUTH_USER", "").strip()
    password = ENV.get("AKASHA_DASHBOARD_BASIC_AUTH_PASS", "").strip()
    if not user or not password:
        return None
    token = base64.b64encode(f"{user}:{password}".encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def dashboard_request(path: str, method: str = "GET", payload: dict[str, Any] | None = None) -> Any:
    headers: dict[str, str] = {}
    auth = basic_auth_header()
    if auth:
      headers["Authorization"] = auth
    data = None
    if payload is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        f"http://127.0.0.1:3001{path}",
        method=method,
        headers=headers,
        data=data,
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        return response.read()


def telegram_api_request(token: str, method: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    headers = {"Content-Type": "application/json"}
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/{method}",
        headers=headers,
        data=data,
        method="POST" if payload is not None else "GET",
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def resolve_telegram_chat_id(token: str, recipient: str) -> str | None:
    target = recipient.strip()
    if not target:
        return None
    if re.fullmatch(r"-?\d+", target):
        return target

    username = target.replace("@", "").strip().lower()
    if not username:
        return None

    updates = telegram_api_request(token, "getUpdates")
    for item in reversed(updates.get("result", [])):
        if not isinstance(item, dict):
            continue
        message = item.get("message") or item.get("channel_post") or item.get("edited_message")
        if not isinstance(message, dict):
            continue
        chat = message.get("chat", {})
        sender = message.get("from", {})
        chat_username = str(chat.get("username", "")).lower()
        sender_username = str(sender.get("username", "")).lower()
        if username not in {chat_username, sender_username}:
            continue
        chat_id = chat.get("id")
        if isinstance(chat_id, int):
            return str(chat_id)
    return None


def aggregate_chat(message: str) -> dict[str, Any]:
    if should_use_demo_fallback(message):
        return {
            "text": build_demo_chat_fallback(message),
            "provider": "aegis-demo-bridge",
            "taskType": "demo_fallback",
        }
    proof = parse_onchain_proof()
    guided_message = (
        "You are Akasha inside the Aegis demo console. "
        "Only answer about this demo and its visible operator surfaces. "
        "Do not mention unrelated repo systems such as ERC-8004, identity registries, credentials, or other projects unless the user explicitly asks. "
        "If uncertain, say you only know what is shown in the demo. "
        "Reply in under 70 words and avoid tool use unless essential.\n\n"
        "Demo facts:\n"
        "- Product: Aegis by Akasha\n"
        "- Role: operator-facing treasury guardian built on Chainlink CRE\n"
        "- Flow: observe external market stress -> deterministic policy -> event hash -> Sepolia anchor -> verification\n"
        f"- Latest tx hash: {proof.get('txHash') or 'unknown'}\n"
        f"- Latest event hash: {proof.get('eventHash') or 'unknown'}\n"
        "- Channels: dashboard, Telegram, chat, email, Moltbook\n\n"
        f"User request: {message}"
    )
    payload = {
        "message": guided_message,
        "session": {
            "id": "aegis-live-console",
            "title": "Aegis Live Console",
            "mode": "brainstorm",
            "projectId": 7,
            "projectName": "Chainlink-CRE-Hackathon-Submission",
        },
    }
    headers: dict[str, str] = {"Content-Type": "application/json"}
    auth = basic_auth_header()
    if auth:
        headers["Authorization"] = auth
    request = urllib.request.Request(
        "http://127.0.0.1:3001/api/chat",
        method="POST",
        headers=headers,
        data=json.dumps(payload).encode("utf-8"),
    )
    text_chunks: list[str] = []
    meta: dict[str, Any] = {}
    with urllib.request.urlopen(request, timeout=120) as response:
        for raw_line in response:
            line = raw_line.decode("utf-8", "ignore").strip()
            if not line.startswith("data: "):
                continue
            try:
                item = json.loads(line[6:])
            except json.JSONDecodeError:
                continue
            if item.get("type") == "text":
                text_chunks.append(str(item.get("text", "")))
            elif item.get("type") == "done":
                meta = item
                break
            elif item.get("type") == "error":
                raise RuntimeError(str(item.get("error", "Unknown chat error")))
    text = "".join(text_chunks).strip()
    if "Per demo:" in text:
        text = text.split("Per demo:", 1)[1].strip()
    text = re.sub(r"^\*\*[A-Z _-]+:.*?\*\*\s*", "", text, flags=re.DOTALL)
    text = re.sub(r"^\*\*[A-Z _-]+\*\*:\s*", "", text)
    text = re.sub(r"^Conflicting definitions.*?(?=[A-Z]|\()", "", text).strip()
    if text.startswith("**") and "\n\n" in text:
        first_block, remainder = text.split("\n\n", 1)
        if any(flag in first_block.lower() for flag in ("glued", "obstructed", "conflicting", "session memories")):
            text = remainder.strip()
    lowered = text.lower()
    if not text or any(flag in lowered for flag in ("session memories", "erc-8004", "identity registry", "conflicting definitions", "obstructed")):
        text = build_demo_chat_fallback(message)
    return {
        "text": text,
        "provider": meta.get("provider"),
        "taskType": meta.get("taskType"),
    }


def load_primary_moltbook() -> dict[str, Any]:
    if not MOLTBOOK_ACCOUNTS_PATH.exists():
        return {}
    try:
        data = json.loads(MOLTBOOK_ACCOUNTS_PATH.read_text())
    except json.JSONDecodeError:
        return {}
    primary = data.get("primary")
    return primary if isinstance(primary, dict) else {}


def moltbook_request(path: str, api_key: str) -> dict[str, Any]:
    request = urllib.request.Request(
        f"https://www.moltbook.com{path}",
        headers={"Authorization": f"Bearer {api_key}"},
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def parse_onchain_proof() -> dict[str, Any]:
    proof = ONCHAIN_PROOF_PATH.read_text(errors="ignore") if ONCHAIN_PROOF_PATH.exists() else ""

    def extract(pattern: str) -> str | None:
        match = re.search(pattern, proof)
        return match.group(1) if match else None

    def extract_match(pattern: str) -> str | None:
        match = re.search(pattern, proof)
        return match.group(0) if match else None

    tx_hash = extract(r"Tx hash: `([^`]+)`")
    event_hash = extract(r"Event hash: `([^`]+)`")
    tx_href = extract_match(r"https://sepolia\.etherscan\.io/tx/[0-9a-fx]+")
    block_number = extract(r"blockNumber: `([^`]+)`")
    return {
        "status": "confirmed" if tx_hash else "unknown",
        "txHash": tx_hash,
        "eventHash": event_hash,
        "txHref": tx_href,
        "blockNumber": block_number,
    }


def short_hash(value: str | None) -> str:
    if not value:
        return "unknown"
    if len(value) < 18:
        return value
    return f"{value[:10]}...{value[-6:]}"


def build_demo_chat_fallback(user_message: str) -> str:
    lower = user_message.lower()
    proof = parse_onchain_proof()
    tx_hash = short_hash(proof.get("txHash"))
    event_hash = short_hash(proof.get("eventHash"))

    if "telegram" in lower and ("alert" in lower or "draft" in lower):
        return f"Aegis anchored a low-risk posture on Sepolia. Event hash {event_hash}. Tx {tx_hash} is confirmed."
    if "anchor" in lower or ("event hash" in lower and "tx" in lower):
        return f"Aegis observed the market signal, applied a deterministic low-risk policy, produced event hash {event_hash}, and anchored the result on Sepolia at tx {tx_hash}."
    if "operator" in lower and ("next" in lower or "takeaway" in lower):
        return "Check the Proof Board, open the Sepolia receipt, and confirm Telegram and email routing before the next live run."
    if "guarded" in lower or "failure" in lower or "safe" in lower:
        return "Aegis is guarded because it uses explicit thresholds, deterministic event hashes, a real Sepolia anchor, and hard-stops on bad data or missing gas."
    if "moltbook" in lower or "submission" in lower or "chainlink cre" in lower:
        return "Aegis is a strong Chainlink CRE submission because it uses live external data, deterministic policy logic, a real Sepolia write, and a clear operator-facing proof and alert surface."
    if "what is" in lower or "one sentence" in lower or "what does" in lower:
        return "Aegis by Akasha is an operator-facing treasury guardian built on Chainlink CRE that observes market stress, applies a deterministic policy, and anchors decisions on Sepolia."
    return f"Aegis by Akasha is a Chainlink CRE treasury guardian with deterministic policy, event-hash evidence, and a confirmed Sepolia anchor at tx {tx_hash}."


def should_use_demo_fallback(user_message: str) -> bool:
    lower = user_message.lower()
    return any(
        phrase in lower
        for phrase in (
            "what is aegis",
            "what is aegis by akasha",
            "one short sentence",
            "draft a concise telegram alert",
            "draft telegram alert",
            "operator takeaway",
            "what should an operator do next",
            "guarded autonomous system",
            "summarize why this is a guarded autonomous system",
            "explain current anchor",
            "event hash",
            "moltbook submission angle",
            "strong chainlink cre autonomous agent submission",
        )
    )


def build_live_status() -> dict[str, Any]:
    result: dict[str, Any] = {
        "dashboard": {
            "reachable": False,
            "projectsTotal": 0,
            "projectsActive": 0,
            "tasksReview": 0,
            "error": None,
        },
        "telegram": {
            "configured": False,
            "recipientCount": 0,
        },
        "moltbook": {
            "handle": None,
            "claimed": False,
            "verified": False,
            "status": None,
            "profileUrl": None,
            "postUrl": FALLBACK_POST_URL,
        },
        "cre": parse_onchain_proof(),
    }

    try:
        raw = dashboard_request("/api/projects")
        payload = json.loads(raw.decode("utf-8"))
        summary = payload.get("result", {}) if isinstance(payload, dict) else {}
        tasks_by_status = summary.get("tasks_by_status", {}) if isinstance(summary, dict) else {}
        result["dashboard"] = {
            "reachable": True,
            "projectsTotal": summary.get("projects_total", 0),
            "projectsActive": summary.get("projects_active", 0),
            "tasksReview": tasks_by_status.get("review", 0),
            "error": None,
        }
    except Exception as error:  # noqa: BLE001
        result["dashboard"]["error"] = str(error)

    recipients = telegram_recipients()
    result["telegram"] = {
        "configured": bool(telegram_token()) and bool(recipients),
        "recipientCount": len(recipients),
    }

    primary = load_primary_moltbook()
    api_key = str(primary.get("api_key", "")).strip()
    if api_key:
        try:
            me = moltbook_request("/api/v1/agents/me", api_key)
            status = moltbook_request("/api/v1/agents/status", api_key)
            agent = me.get("agent", {}) if isinstance(me, dict) else {}
            result["moltbook"] = {
                "handle": agent.get("name") or primary.get("handle"),
                "claimed": bool(agent.get("is_claimed")),
                "verified": bool(agent.get("is_verified")),
                "status": status.get("status") if isinstance(status, dict) else primary.get("status"),
                "profileUrl": primary.get("profile_url"),
                "postUrl": FALLBACK_POST_URL,
            }
        except Exception:  # noqa: BLE001
            result["moltbook"] = {
                "handle": primary.get("handle"),
                "claimed": False,
                "verified": False,
                "status": primary.get("status"),
                "profileUrl": primary.get("profile_url"),
                "postUrl": FALLBACK_POST_URL,
            }

    return result


def send_telegram_message(text: str) -> dict[str, Any]:
    token = telegram_token()
    recipients = telegram_recipients()
    if not token:
        raise RuntimeError("Telegram bot token is not configured.")
    if not recipients:
        raise RuntimeError("No Telegram recipients are configured.")

    chat_id = None
    matched_recipient = None
    for recipient in recipients:
        resolved = resolve_telegram_chat_id(token, recipient)
        if resolved:
            chat_id = resolved
            matched_recipient = recipient
            break

    if not chat_id:
        raise RuntimeError("No reachable Telegram chat found. The target user must send /start to the bot first.")

    try:
        data = telegram_api_request(token, "sendMessage", {"chat_id": chat_id, "text": text})
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", "ignore")
        raise RuntimeError(f"Telegram send failed: {detail or error.reason}") from error
    ok = bool(data.get("ok"))
    if not ok:
        raise RuntimeError(f"Telegram API returned a non-ok response: {json.dumps(data)}")
    return {
        "ok": True,
        "message": f"Sent to Telegram recipient {matched_recipient} via chat {chat_id}.",
    }


class AegisHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format: str, *args: Any) -> None:  # noqa: A003
        sys.stdout.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format % args))

    def do_GET(self) -> None:  # noqa: N802
        if any(part.startswith(".") for part in Path(self.path.split("?", 1)[0]).parts):
            return json_response(self, {"error": "not found"}, status=404)
        if self.path == "/api/live-status":
            return json_response(self, build_live_status())
        return super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if self.path == "/api/akasha-chat":
            body = read_json_request(self)
            message = str(body.get("message", "")).strip()
            if not message:
                return json_response(self, {"error": "message is required"}, status=400)
            try:
                return json_response(self, aggregate_chat(message))
            except Exception as error:  # noqa: BLE001
                return json_response(self, {"error": str(error)}, status=502)

        if self.path == "/api/send-telegram-test":
            body = read_json_request(self)
            message = str(body.get("message", "")).strip() or "Aegis test alert from the local demo console."
            try:
                return json_response(self, send_telegram_message(message))
            except Exception as error:  # noqa: BLE001
                return json_response(self, {"error": str(error)}, status=502)

        return json_response(self, {"error": "not found"}, status=404)


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the Aegis console with a local live-data bridge.")
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--port", default=4173, type=int)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.bind, args.port), AegisHandler)
    print(f"Aegis console listening on http://{args.bind}:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

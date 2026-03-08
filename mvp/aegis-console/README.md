# Aegis Console

Camera-ready demo surface for `Aegis by Akasha`.

## Purpose
This version is a product demo shell, not just a proof viewer. It separates the
story into clean tabs:

- `Mission Control` for the operator-facing overview
- `Proof Board` for flow, timeline, tx, and evidence
- `Channel Grid` for dashboard, Telegram, chat, email, and Moltbook paths
- `Policy Lab` for threshold and routing preview
- `Live Akasha` for real dashboard chat via a local proxy

## Live Bridge
The console now uses a small local bridge server so the browser does not need to
see dashboard or Telegram secrets directly.

Current live hooks:
- real Akasha dashboard status via authenticated local API calls
- real Akasha chat proxy through `/api/chat`
- Moltbook account status for `aegis-by-akasha`
- latest Sepolia proof tx
- optional Telegram test alert button

## Run Locally
From this directory:

```bash
python3 server.py --bind 0.0.0.0 --port 4173
```

Then open:

```text
http://127.0.0.1:4173
```

## Recording Notes
- Start on `Mission Control`
- Use `Sepolia anchor` as the default hero scene when you want the strongest proof-first opening
- Switch to `Live simulation` when explaining the architecture more slowly
- Use `Proof Board` for hashes, tx, and execution order
- Use `Channel Grid` to show the cross-channel product story
- Use `Live Akasha` only after confirming the dashboard is reachable

## Source Of Truth
- `logs/simulate-staging-rerun.log`
- `logs/simulate-fixture-run1.log`
- `logs/simulate-fixture-run2.log`
- `logs/simulate-broadcast.log`
- `logs/simulate-api-fail.log`
- `logs/simulate-broadcast-insufficient-funds.log`
- `artifacts/simulation-proof.md`
- `artifacts/onchain-proof.md`

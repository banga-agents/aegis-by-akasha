const scenarios = [
  {
    id: "anchor",
    title: "Sepolia anchor",
    status: "Broadcast",
    level: "low",
    metric: -1.3809316820440114,
    threshold: 3,
    confidence: 0.88,
    workflowId: "risk-monitor-v1",
    source: "CoinGecko simple/price API",
    timestamp: "2026-03-08T02:23:41.375Z",
    summary:
      "This is the strongest proof path: live external signal, deterministic decision, event hash, and a real Sepolia write with receipt status 0x1.",
    tagline:
      "This is the strongest judge-facing state because the workflow actually wrote on-chain.",
    riskLabel: "LOW RISK",
    evidenceStatus: "Receipt status 0x1",
    eventHash: "0xc549a7bbe140765981ec3a3a78598e2696f29213feff1e1cec09ba04e1c849e1",
    txHash: "0x2358ad37c9f97a6564cefa71dc5153b3672929fc634009cbbd1c3f649540eff1",
    txHref:
      "https://sepolia.etherscan.io/tx/0x2358ad37c9f97a6564cefa71dc5153b3672929fc634009cbbd1c3f649540eff1",
    command: "code/cre-risk-monitor/scripts/run-broadcast.sh",
    evidence: "logs/simulate-broadcast.log, artifacts/onchain-proof.md",
    note:
      "The current live proof uses the Aegis executor wallet and a successful Sepolia receipt. This is the version to keep on camera.",
    focusTitle: "Use this when you want the product to feel unquestionably real.",
    focusText:
      "Everything important happens here: external ingest, explicit policy, deterministic encoding, on-chain anchor, and independent receipt verification.",
    focusBullets: [
      "The event hash is emitted before the transaction returns.",
      "The tx hash is real and the receipt status is 0x1.",
      "This is the cleanest shot for the hackathon proof requirement.",
    ],
    flow: [
      {
        label: "Observe",
        short: "-1.3809%",
        state: "pass",
        detail: "CoinGecko returns the live BTC 24h change successfully.",
      },
      {
        label: "Decide",
        short: "LOW",
        state: "pass",
        detail: "The move stays inside the 3.00% threshold, so Aegis keeps a low-risk posture.",
      },
      {
        label: "Encode",
        short: "hash ready",
        state: "pass",
        detail: "Aegis hashes the workflow ID and decision object into deterministic evidence.",
      },
      {
        label: "Anchor",
        short: "tx mined",
        state: "pass",
        detail: "CRE signs and submits the report path on Sepolia.",
      },
      {
        label: "Verify",
        short: "status 0x1",
        state: "pass",
        detail: "Independent RPC lookup confirms a successful receipt.",
      },
    ],
    timeline: [
      {
        time: "02:23:41Z",
        state: "pass",
        title: "Live signal captured",
        detail: "BTC 24h change is fetched and the low-risk decision object is built.",
      },
      {
        time: "02:23:41Z",
        state: "pass",
        title: "Deterministic hash emitted",
        detail: "Event hash 0xc549a7bb...49e1 is written before the broadcast completes.",
      },
      {
        time: "02:23:48Z",
        state: "pass",
        title: "Sepolia transaction returned",
        detail: "CRE returns tx 0x2358ad37...eff1 from the writeReport path.",
      },
      {
        time: "receipt",
        state: "pass",
        title: "Receipt verified",
        detail: "Block 10406019 and status 0x1 are captured in the proof artifacts.",
      },
    ],
    logExcerpt:
      '2026-03-08T02:23:41Z [USER LOG] risk_decision={\\n  "metric": -1.3809316820440114,\\n  "threshold": 3,\\n  "level": "low"\\n}\\n2026-03-08T02:23:41Z [USER LOG] event_hash=0xc549a7bbe140765981ec3a3a78598e2696f29213feff1e1cec09ba04e1c849e1\\n2026-03-08T02:23:48Z [USER LOG] tx_hash=0x2358ad37c9f97a6564cefa71dc5153b3672929fc634009cbbd1c3f649540eff1',
  },
  {
    id: "live",
    title: "Live simulation",
    status: "Simulation",
    level: "low",
    metric: 1.137236057934218,
    threshold: 3,
    confidence: 0.88,
    workflowId: "risk-monitor-v1",
    source: "CoinGecko simple/price API",
    timestamp: "2026-03-05T14:59:42.031Z",
    summary:
      "A clean end-to-end simulation showing the exact path from external API input to deterministic workflow output without a live chain write.",
    tagline:
      "This is still the best opening scene if you want to explain the architecture before showing the tx.",
    riskLabel: "LOW RISK",
    evidenceStatus: "Simulation passed",
    eventHash: "0x63706523ada5e1a67157f07de398ef14b8ce679d194fb57e0c86fd45072b01a0",
    txHash: "Simulation only",
    txHref: "",
    command:
      "cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T staging-settings",
    evidence: "logs/simulate-staging-rerun.log",
    note:
      "Simulation mode keeps the decision path and hash generation visible, but no testnet transaction is mined.",
    focusTitle: "Use this to explain the full loop before the on-chain scene.",
    focusText:
      "It is the least distracting state because every step is visible and nothing fails, but it still stays safely inside simulation mode.",
    focusBullets: [
      "The signal comes from a real external API.",
      "The decision is explicit policy, not black-box reasoning.",
      "The event hash is still produced in simulation mode.",
    ],
    flow: [
      {
        label: "Observe",
        short: "+1.1372%",
        state: "pass",
        detail: "External market data is pulled from CoinGecko successfully.",
      },
      {
        label: "Decide",
        short: "LOW",
        state: "pass",
        detail: "The signal stays below the policy threshold.",
      },
      {
        label: "Encode",
        short: "hash ready",
        state: "pass",
        detail: "Deterministic event hash is emitted for replayable evidence.",
      },
      {
        label: "Anchor",
        short: "sim only",
        state: "warn",
        detail: "The write path is exercised, but nothing is broadcast.",
      },
      {
        label: "Verify",
        short: "pass",
        state: "pass",
        detail: "CRE completes the run and returns the workflow payload cleanly.",
      },
    ],
    timeline: [
      {
        time: "14:59:41Z",
        state: "pass",
        title: "Simulation initialized",
        detail: "CRE compiles the workflow and prepares the cron-trigger run.",
      },
      {
        time: "14:59:42Z",
        state: "pass",
        title: "Decision created",
        detail: "Aegis emits the decision object and event hash in the logs.",
      },
      {
        time: "14:59:42Z",
        state: "warn",
        title: "Anchor stays simulated",
        detail: "The tx field stays zero because no testnet write is requested.",
      },
    ],
    logExcerpt:
      '2026-03-05T14:59:42Z [USER LOG] risk_decision={\\n  "metric": 1.137236057934218,\\n  "threshold": 3,\\n  "level": "low"\\n}\\n2026-03-05T14:59:42Z [USER LOG] event_hash=0x63706523ada5e1a67157f07de398ef14b8ce679d194fb57e0c86fd45072b01a0',
  },
  {
    id: "fixture",
    title: "Deterministic replay",
    status: "Replay",
    level: "high",
    metric: -6.25,
    threshold: 3,
    confidence: 0.88,
    workflowId: "risk-monitor-v1-fixture",
    source: "fixture://btc",
    timestamp: "2026-03-05T00:00:00.000Z",
    summary:
      "A fixed stress case rerun twice with the same metric and timestamp, producing the same high-risk decision and the same event hash.",
    tagline:
      "This is the proof that the autonomous behavior is replayable rather than hand-wavy.",
    riskLabel: "HIGH RISK",
    evidenceStatus: "Run 1 = Run 2",
    eventHash: "0x71eed900a2b5ce90b9e3a6e2b9ce4cd817b2c8bc16612451820fc99fa25de28e",
    txHash: "Simulation only",
    txHref: "",
    command:
      "cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T fixture-settings",
    evidence: "logs/simulate-fixture-run1.log, logs/simulate-fixture-run2.log",
    note:
      "This profile is simulation-only on purpose. The value is determinism, not live execution.",
    focusTitle: "Use this to prove replayability, not excitement.",
    focusText:
      "The same fixed input produces the same exact evidence twice. That makes the autonomous decision path testable and defensible.",
    focusBullets: [
      "The metric and timestamp are fixed on purpose.",
      "Both runs produce the same event hash.",
      "This is the auditability scene.",
    ],
    flow: [
      {
        label: "Observe",
        short: "-6.2500%",
        state: "pass",
        detail: "A deterministic fixture provides the stress metric.",
      },
      {
        label: "Decide",
        short: "HIGH",
        state: "pass",
        detail: "The metric exceeds 2x threshold magnitude and escalates to high risk.",
      },
      {
        label: "Encode",
        short: "same hash",
        state: "pass",
        detail: "Both reruns emit the same event hash from the same decision payload.",
      },
      {
        label: "Anchor",
        short: "sim only",
        state: "warn",
        detail: "This path intentionally stays out of broadcast mode.",
      },
      {
        label: "Verify",
        short: "run1 = run2",
        state: "pass",
        detail: "The proof pack preserves both outputs for a side-by-side comparison.",
      },
    ],
    timeline: [
      {
        time: "run1",
        state: "pass",
        title: "Fixture replay one",
        detail: "The first run emits the high-risk decision and deterministic hash.",
      },
      {
        time: "run2",
        state: "pass",
        title: "Fixture replay two",
        detail: "The second run replays the same inputs and returns the same evidence.",
      },
      {
        time: "verdict",
        state: "pass",
        title: "Hashes match exactly",
        detail: "This is what makes the workflow replayable instead of improvisational.",
      },
    ],
    logExcerpt:
      "run1 event_hash=0x71eed900a2b5ce90b9e3a6e2b9ce4cd817b2c8bc16612451820fc99fa25de28e\\nrun2 event_hash=0x71eed900a2b5ce90b9e3a6e2b9ce4cd817b2c8bc16612451820fc99fa25de28e",
  },
  {
    id: "api-fail",
    title: "API failure guard",
    status: "Failure-safe",
    level: "blocked",
    metric: null,
    threshold: 3,
    confidence: null,
    workflowId: "risk-monitor-v1",
    source: "invalid.example.invalid",
    timestamp: "No decision produced",
    summary:
      "A deliberately bad upstream input proves the workflow halts cleanly before decisioning or anchoring.",
    tagline:
      "This is what guarded autonomy looks like when the data is bad: stop early and say why.",
    riskLabel: "BLOCKED",
    evidenceStatus: "Hard stop on ingest",
    eventHash: "Not generated",
    txHash: "Not attempted",
    txHref: "",
    command:
      "cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T api-fail-settings",
    evidence: "logs/simulate-api-fail.log",
    note:
      "No event hash and no transaction are generated because the workflow refuses to continue without a trustworthy signal.",
    focusTitle: "Use this to show that failing safely is part of the product.",
    focusText:
      "A credible autonomous system should stop before doing anything irreversible when upstream data is broken.",
    focusBullets: [
      "The failure happens in observe, not after a misleading decision.",
      "No event hash is created because the workflow never reaches encode.",
      "This is a feature, not a weakness.",
    ],
    flow: [
      {
        label: "Observe",
        short: "DNS error",
        state: "fail",
        detail: "The configured upstream host does not resolve.",
      },
      {
        label: "Decide",
        short: "blocked",
        state: "idle",
        detail: "No decision object is built from an untrusted state.",
      },
      {
        label: "Encode",
        short: "blocked",
        state: "idle",
        detail: "No evidence hash is created from a failed observe stage.",
      },
      {
        label: "Anchor",
        short: "skipped",
        state: "idle",
        detail: "Aegis refuses any write path because the input is invalid.",
      },
      {
        label: "Verify",
        short: "explicit error",
        state: "pass",
        detail: "The run records the exact ingest failure for the operator.",
      },
    ],
    timeline: [
      {
        time: "start",
        state: "pass",
        title: "Simulation starts normally",
        detail: "CRE initializes exactly like the success path.",
      },
      {
        time: "observe",
        state: "fail",
        title: "Upstream host fails",
        detail: "The HTTP request cannot resolve the bad hostname.",
      },
      {
        time: "guardrail",
        state: "pass",
        title: "Workflow stops early",
        detail: "No decision, no hash, and no chain action are allowed to continue.",
      },
    ],
    logExcerpt:
      'Workflow execution failed:\\nCapability "consensus@1.0.0-alpha" method "Simple" returned an error:\\nMarket ingest failed with no fallback:\\nGet "https://invalid.example.invalid/nope": dial tcp:\\nlookup invalid.example.invalid: no such host',
  },
  {
    id: "gas-fail",
    title: "Gas failure guard",
    status: "Failure-safe",
    level: "low",
    metric: 1.2565442519213834,
    threshold: 3,
    confidence: 0.88,
    workflowId: "risk-monitor-v1",
    source: "CoinGecko simple/price API",
    timestamp: "2026-03-05T15:01:35.056Z",
    summary:
      "Aegis reaches the write path, emits the event hash, and then fails transparently because the wallet has no gas.",
    tagline:
      "This is useful because it proves the chain-write path is real, not mocked.",
    riskLabel: "LOW RISK",
    evidenceStatus: "Anchor failed clearly",
    eventHash: "0xef020141b19b048d154fddef97bad4f53c4c13b7c66d781a87427ef87ba5d203",
    txHash: "Not mined",
    txHref: "",
    command:
      "cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T staging-settings --broadcast",
    evidence: "logs/simulate-broadcast-insufficient-funds.log",
    note:
      "The failure reason is explicit: insufficient funds for gas. The decision path still completed first.",
    focusTitle: "Use this to show the write path is genuine and guarded.",
    focusText:
      "The event hash exists, which means the decision and encoding ran successfully. The failure appears only at the actual broadcast step.",
    focusBullets: [
      "The event hash is still produced.",
      "The error appears only at writeReport time.",
      "Operators see a direct funding failure instead of silent breakage.",
    ],
    flow: [
      {
        label: "Observe",
        short: "+1.2565%",
        state: "pass",
        detail: "The live market signal is still captured successfully.",
      },
      {
        label: "Decide",
        short: "LOW",
        state: "pass",
        detail: "The reserve posture stays in the low-risk band.",
      },
      {
        label: "Encode",
        short: "hash ready",
        state: "pass",
        detail: "Deterministic proof is created before the transaction attempt.",
      },
      {
        label: "Anchor",
        short: "no gas",
        state: "fail",
        detail: "The writer wallet cannot fund the transaction.",
      },
      {
        label: "Verify",
        short: "explicit error",
        state: "pass",
        detail: "The failure is surfaced clearly in the logs.",
      },
    ],
    timeline: [
      {
        time: "decision",
        state: "pass",
        title: "Decision path completes",
        detail: "Aegis emits the decision object and event hash.",
      },
      {
        time: "anchor",
        state: "fail",
        title: "Funding failure at writeReport",
        detail: "The chain write fails because the wallet has no balance for gas.",
      },
      {
        time: "guardrail",
        state: "pass",
        title: "Error stays visible",
        detail: "The run preserves the exact reason instead of hiding the failure.",
      },
    ],
    logExcerpt:
      '2026-03-05T15:01:35Z [USER LOG] event_hash=0xef020141b19b048d154fddef97bad4f53c4c13b7c66d781a87427ef87ba5d203\\nWorkflow execution failed:\\nCapability "WriteReport" returned an error:\\ninsufficient funds for gas * price + value',
  },
]

const channelLabels = {
  dashboard: "Dashboard",
  telegram: "Telegram",
  chat: "Chat",
  email: "Email",
}

const liveLinks = {
  post: "https://www.moltbook.com/post/c785f09d-e700-4d3f-a4ae-17cf16ad8883",
  profile: "https://www.moltbook.com/u/aegis-by-akasha",
}

const iconMap = {
  dashboard:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>',
  moltbook:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h12v14H6zM9 9h6M9 13h6M9 17h4"/></svg>',
  telegram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 20 4l-5 16-3.5-5-4.5-1.5zM11.5 15l8.5-11"/></svg>',
  chain:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14l4-4M8.5 16.5l-2 2a3 3 0 0 1-4.2-4.2l2-2M15.5 7.5l2-2a3 3 0 1 1 4.2 4.2l-2 2"/></svg>',
  guard:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-2.7 7-7 9-4.3-2-7-4.5-7-9V6z"/></svg>',
  proof:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v16H7zM9.5 9h5M9.5 13h5M9.5 17h3"/></svg>',
  replay:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0 2 5.5M20 4v7h-7"/></svg>',
  simulation:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14l12-7z"/></svg>',
  broadcast:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  policy:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M12 5v14M18 5v14"/><circle cx="6" cy="9" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="18" cy="10" r="2"/></svg>',
  chat:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12v8H9l-3 3z"/></svg>',
  email:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v10H4zM5 8l7 6 7-6"/></svg>',
  live:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16"/><circle cx="12" cy="12" r="7"/></svg>',
  alert:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v8M12 16.5v.5"/><path d="M7 20h10l-1-4H8z"/><path d="M8 16V10a4 4 0 0 1 8 0v6"/></svg>',
}

const state = {
  activeScenarioId: "anchor",
  activeTab: "mission",
  autoplay: false,
  autoplayHandle: null,
  liveStatus: null,
  policy: {
    threshold: 3,
    mode: "broadcast",
    requireApproval: true,
    channels: {
      dashboard: true,
      telegram: true,
      chat: true,
      email: true,
    },
  },
}

const elements = {
  scenarioStrip: document.getElementById("scenario-strip"),
  heroLiveGrid: document.getElementById("hero-live-grid"),
  missionTitle: document.getElementById("mission-title"),
  missionStatusPill: document.getElementById("mission-status-pill"),
  missionSummary: document.getElementById("mission-summary"),
  missionRiskLabel: document.getElementById("mission-risk-label"),
  missionModeDetail: document.getElementById("mission-mode-detail"),
  missionStageNote: document.getElementById("mission-stage-note"),
  missionMetric: document.getElementById("mission-metric"),
  missionThreshold: document.getElementById("mission-threshold"),
  missionConfidence: document.getElementById("mission-confidence"),
  missionPolicyCaption: document.getElementById("mission-policy-caption"),
  missionFocusTitle: document.getElementById("mission-focus-title"),
  missionFocusText: document.getElementById("mission-focus-text"),
  missionBullets: document.getElementById("mission-bullets"),
  missionLiveCards: document.getElementById("mission-live-cards"),
  riskGauge: document.getElementById("risk-gauge"),
  riskGaugeLabel: document.getElementById("risk-gauge-label"),
  riskGaugeDetail: document.getElementById("risk-gauge-detail"),
  bandMarker: document.getElementById("band-marker"),
  proofWaterfall: document.getElementById("proof-waterfall"),
  proofTimeline: document.getElementById("proof-timeline"),
  proofWorkflowId: document.getElementById("proof-workflow-id"),
  proofDecision: document.getElementById("proof-decision"),
  proofEvidenceState: document.getElementById("proof-evidence-state"),
  proofEventHash: document.getElementById("proof-event-hash"),
  proofTxHash: document.getElementById("proof-tx-hash"),
  proofTxLink: document.getElementById("proof-tx-link"),
  proofCommand: document.getElementById("proof-command"),
  proofEvidencePath: document.getElementById("proof-evidence-path"),
  proofNote: document.getElementById("proof-note"),
  proofLog: document.getElementById("proof-log"),
  channelCards: document.getElementById("channel-cards"),
  telegramPreview: document.getElementById("telegram-preview"),
  telegramSend: document.getElementById("telegram-send"),
  telegramResult: document.getElementById("telegram-result"),
  channelProofLinks: document.getElementById("channel-proof-links"),
  thresholdSlider: document.getElementById("threshold-slider"),
  thresholdOutput: document.getElementById("threshold-output"),
  approvalToggle: document.getElementById("approval-toggle"),
  toggleDashboard: document.getElementById("toggle-dashboard"),
  toggleTelegram: document.getElementById("toggle-telegram"),
  toggleChat: document.getElementById("toggle-chat"),
  toggleEmail: document.getElementById("toggle-email"),
  policyPill: document.getElementById("policy-pill"),
  policyTitle: document.getElementById("policy-title"),
  policySummary: document.getElementById("policy-summary"),
  policyPreviewMarker: document.getElementById("policy-preview-marker"),
  policyRecorded: document.getElementById("policy-recorded"),
  policyPreviewBand: document.getElementById("policy-preview-band"),
  policyDispatch: document.getElementById("policy-dispatch"),
  policyDiff: document.getElementById("policy-diff"),
  policyActions: document.getElementById("policy-actions"),
  policyGuardrails: document.getElementById("policy-guardrails"),
  liveStatusCards: document.getElementById("live-status-cards"),
  liveChatThread: document.getElementById("live-chat-thread"),
  liveChatPrompts: document.getElementById("live-chat-prompts"),
  liveChatInput: document.getElementById("live-chat-input"),
  liveChatSend: document.getElementById("live-chat-send"),
  chatMeta: document.getElementById("chat-meta"),
  liveActionButtons: document.getElementById("live-action-buttons"),
  livePostLink: document.getElementById("live-post-link"),
  liveTxLink: document.getElementById("live-tx-link"),
  refreshLive: document.getElementById("refresh-live"),
  autoplayToggle: document.getElementById("autoplay-toggle"),
  autoplayLabel: document.getElementById("autoplay-label"),
}

const tabButtons = [...document.querySelectorAll(".main-tab")]
const tabPanels = [...document.querySelectorAll("[data-tab-panel]")]
const orbitNodes = {
  observe: document.querySelector(".orbit-observe"),
  decide: document.querySelector(".orbit-decide"),
  encode: document.querySelector(".orbit-encode"),
  anchor: document.querySelector(".orbit-anchor"),
  verify: document.querySelector(".orbit-verify"),
}
const modeButtons = [...document.querySelectorAll(".mode-button")]

function getScenario() {
  return scenarios.find((item) => item.id === state.activeScenarioId) || scenarios[0]
}

function shortHash(value) {
  if (typeof value !== "string") return ""
  if (!value.startsWith("0x") || value.length < 18) return value
  return `${value.slice(0, 10)}...${value.slice(-6)}`
}

function iconSvg(name) {
  return iconMap[name] || iconMap.live
}

function iconBox(name, className = "card-icon") {
  return `<span class="${className}" aria-hidden="true">${iconSvg(name)}</span>`
}

function formatMetric(metric) {
  if (typeof metric !== "number") return "Unavailable"
  return `${metric >= 0 ? "+" : ""}${metric.toFixed(4)}%`
}

function formatConfidence(value) {
  if (typeof value !== "number") return "N/A"
  return `${Math.round(value * 100)}%`
}

function formatBand(level) {
  if (level === "high") return "HIGH RISK"
  if (level === "medium") return "MEDIUM RISK"
  if (level === "blocked") return "BLOCKED"
  return "LOW RISK"
}

function classifyRisk(metric, threshold) {
  if (typeof metric !== "number") return "blocked"
  const absolute = Math.abs(metric)
  if (absolute >= threshold * 2) return "high"
  if (absolute >= threshold) return "medium"
  return "low"
}

function riskTheme(level) {
  if (level === "high" || level === "blocked") {
    return {
      color: "var(--high)",
      background: "rgba(255, 125, 97, 0.14)",
      gauge:
        "radial-gradient(circle at center, rgba(8, 21, 30, 0.92) 39%, transparent 40%), conic-gradient(from 180deg, rgba(255, 125, 97, 0.62), rgba(238, 184, 88, 0.2), rgba(255, 125, 97, 0.16), rgba(255, 125, 97, 0.62))",
    }
  }
  if (level === "medium") {
    return {
      color: "var(--medium)",
      background: "rgba(238, 184, 88, 0.16)",
      gauge:
        "radial-gradient(circle at center, rgba(8, 21, 30, 0.92) 39%, transparent 40%), conic-gradient(from 180deg, rgba(238, 184, 88, 0.62), rgba(117, 212, 200, 0.2), rgba(238, 184, 88, 0.16), rgba(238, 184, 88, 0.62))",
    }
  }
  return {
    color: "var(--low)",
    background: "rgba(143, 226, 169, 0.14)",
    gauge:
      "radial-gradient(circle at center, rgba(8, 21, 30, 0.92) 39%, transparent 40%), conic-gradient(from 180deg, rgba(143, 226, 169, 0.62), rgba(117, 212, 200, 0.2), rgba(143, 226, 169, 0.16), rgba(143, 226, 169, 0.62))",
  }
}

function setBandMarker(node, metric, threshold) {
  if (typeof metric !== "number") {
    node.style.left = "50%"
    return
  }
  const max = threshold * 2
  const clamped = Math.max(-max, Math.min(max, metric))
  const normalized = (clamped + max) / (max * 2)
  node.style.left = `${normalized * 100}%`
}

function dispatchLabel() {
  const enabled = Object.entries(state.policy.channels)
    .filter(([, value]) => value)
    .map(([key]) => channelLabels[key])
  return enabled.length === 0 ? "None selected" : enabled.join(" + ")
}

function computePolicyPreview(scenario) {
  if (typeof scenario.metric !== "number") {
    return {
      level: "blocked",
      label: "BLOCKED",
      title: "Execution would halt before decisioning",
      summary:
        "Aegis would refuse to continue because the observe stage has no trustworthy market signal to classify.",
      diff:
        "This matches the recorded run: observe failed before a decision object or event hash could be built.",
      actions: [
        "Stop live execution immediately.",
        "Notify operators that the observe stage failed.",
        "Wait for upstream recovery before retrying.",
      ],
    }
  }

  const previewLevel = classifyRisk(scenario.metric, state.policy.threshold)
  const previewLabel = formatBand(previewLevel)
  const actualLabel = formatBand(scenario.level)
  const changed = previewLabel !== actualLabel
  const modeLine =
    state.policy.mode === "broadcast"
      ? "Aegis would attempt a live Sepolia anchor after the decision."
      : "Aegis would stay in dry-run mode and stop before the write path."

  const actions = []
  if (state.policy.mode === "broadcast" && previewLevel === "high" && state.policy.requireApproval) {
    actions.push("Pause for human approval before a high-risk broadcast.")
  } else if (state.policy.mode === "broadcast") {
    actions.push("Proceed into the write path after encoding the decision.")
  } else {
    actions.push("Keep the run in observation mode with no on-chain write.")
  }
  actions.push(`Dispatch updates through ${dispatchLabel()}.`)
  if (previewLevel === "high") {
    actions.push("Escalate through the highest-visibility operator channel.")
  } else if (previewLevel === "medium") {
    actions.push("Request operator review because the threshold was crossed.")
  } else {
    actions.push("Keep watching without urgent escalation.")
  }

  return {
    level: previewLevel,
    label: previewLabel,
    title:
      previewLevel === "high"
        ? "High-risk escalation posture"
        : previewLevel === "medium"
          ? "Medium-risk review posture"
          : "Low-risk watch posture",
    summary: `${formatMetric(scenario.metric)} against a ${state.policy.threshold.toFixed(2)}% threshold would classify as ${previewLabel.toLowerCase()}. ${modeLine}`,
    diff: changed
      ? `This changes the recorded outcome from ${actualLabel} to ${previewLabel}.`
      : `This keeps the recorded outcome unchanged at ${previewLabel}.`,
    actions,
  }
}

function buildTelegramPreview(scenario) {
  if (scenario.status === "Broadcast") {
    return `Aegis anchored ${scenario.riskLabel.toLowerCase()} posture on Sepolia. Tx ${shortHash(scenario.txHash)} confirmed with receipt status 0x1.`
  }
  if (scenario.id === "fixture") {
    return `Aegis replay proof ready. Matching event hash ${shortHash(scenario.eventHash)} across both fixed runs.`
  }
  if (scenario.id === "api-fail") {
    return "Aegis guardrail triggered: upstream ingest failed, so no decision or chain action was attempted."
  }
  if (scenario.id === "gas-fail") {
    return "Aegis guardrail triggered: decision succeeded, but broadcast failed because the writer wallet had no gas."
  }
  return `Aegis watch update: ${formatMetric(scenario.metric)} against ${scenario.threshold.toFixed(2)}% threshold. ${scenario.riskLabel}.`
}

function buildChannelEntries(scenario) {
  return [
    {
      key: "dashboard",
      icon: "dashboard",
      code: "DB",
      name: "Dashboard",
      intent: "inspect",
      body: "Open replay, policy, and project status inside the real Akasha control plane.",
    },
    {
      key: "telegram",
      icon: "telegram",
      code: "TG",
      name: "Telegram",
      intent: "interrupt",
      body: buildTelegramPreview(scenario),
    },
    {
      key: "chat",
      icon: "chat",
      code: "CH",
      name: "Chat",
      intent: "explain",
      body: "Ask Akasha why the decision happened, what changed on-chain, or how policy would shift the result.",
    },
    {
      key: "email",
      icon: "email",
      code: "ML",
      name: "Email",
      intent: "archive",
      body: "Package the tx hash, decision, and guardrail outcome into a digest for audit-style review.",
    },
  ]
}

function buildGuardrails(scenario) {
  return [
    {
      title: "Never write from bad data",
      body: "If the observe stage fails, Aegis should stop before decisioning or anchoring.",
    },
    {
      title: "Make failure explicit",
      body: "If the write path has no gas, surface a direct funding error instead of masking the failure.",
    },
    {
      title: "Always emit proof",
      body: "Successful decision paths should always emit deterministic event hashes.",
    },
    {
      title: "Human approval stays visible",
      body: state.policy.requireApproval
        ? "High-risk broadcast requires explicit human approval in the current preview."
        : "High-risk broadcast can proceed without human approval in the current preview.",
    },
    {
      title: "Channels are deliberate",
      body: `Current dispatch preview: ${dispatchLabel()}. Each surface has a separate job.`,
    },
    {
      title: "Fixture stays fixture",
      body: scenario.id === "fixture"
        ? "Deterministic fixture runs remain simulation-only for replay proof."
        : "Only live scenarios should move between dry run and broadcast.",
    },
  ]
}

function buildHeroLiveCards(live) {
  const cards = [
    {
      icon: "dashboard",
      title: "Dashboard",
      value: live?.dashboard?.reachable ? "Online" : "Offline",
      detail: live?.dashboard?.reachable
        ? `${live.dashboard.projectsActive} active projects`
        : "Akasha control plane unavailable",
      status: live?.dashboard?.reachable ? "ok" : "fail",
    },
    {
      icon: "moltbook",
      title: "Moltbook",
      value: live?.moltbook?.status || "unknown",
      detail: live?.moltbook?.handle || "No account data",
      status: live?.moltbook?.claimed ? "ok" : "warn",
    },
    {
      icon: "telegram",
      title: "Telegram",
      value: live?.telegram?.configured ? "Armed" : "Not armed",
      detail: live?.telegram?.configured
        ? `${live.telegram.recipientCount} recipients configured`
        : "No bot config loaded",
      status: live?.telegram?.configured ? "ok" : "warn",
    },
    {
      icon: "chain",
      title: "Sepolia proof",
      value: live?.cre?.status || "unknown",
      detail: live?.cre?.txHash ? shortHash(live.cre.txHash) : "No tx",
      status: live?.cre?.status === "confirmed" ? "ok" : "warn",
    },
  ]

  elements.heroLiveGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="live-card">
          <div class="live-card-head">
            ${iconBox(card.icon)}
            <p class="signal-label">${card.title}</p>
          </div>
          <strong>${card.value}</strong>
          <small class="inline-status ${card.status}">${card.detail}</small>
        </article>
      `,
    )
    .join("")
}

function renderScenarioStrip() {
  elements.scenarioStrip.innerHTML = scenarios
    .map((scenario) => {
      const active = scenario.id === state.activeScenarioId ? "is-active" : ""
      const scenarioIcon =
        scenario.status === "Broadcast"
          ? "broadcast"
          : scenario.id === "fixture"
            ? "replay"
            : scenario.status === "Failure-safe"
              ? "guard"
              : "simulation"
      return `
        <button class="scenario-button ${active}" type="button" data-scenario="${scenario.id}">
          <div class="scenario-head">
            <span class="scenario-title">${scenario.title}</span>
            <span class="scenario-chip">${iconBox(scenarioIcon, "mini-icon")}<span>${scenario.status}</span></span>
          </div>
          <p class="muted">${scenario.tagline}</p>
        </button>
      `
    })
    .join("")

  for (const button of elements.scenarioStrip.querySelectorAll("[data-scenario]")) {
    button.addEventListener("click", () => {
      state.activeScenarioId = button.dataset.scenario
      state.policy.threshold = getScenario().threshold
      syncPolicyControls()
      render()
    })
  }
}

function renderMission() {
  const scenario = getScenario()
  const theme = riskTheme(scenario.level)
  elements.missionTitle.textContent = scenario.title
  elements.missionSummary.textContent = scenario.summary
  elements.missionStatusPill.textContent = scenario.status
  elements.missionStatusPill.style.color = theme.color
  elements.missionStatusPill.style.background = theme.background
  elements.missionRiskLabel.textContent = scenario.riskLabel
  elements.missionModeDetail.textContent = `${scenario.status} | ${scenario.evidenceStatus}`
  elements.missionMetric.textContent = formatMetric(scenario.metric)
  elements.missionThreshold.textContent = `${scenario.threshold.toFixed(2)}%`
  elements.missionConfidence.textContent = formatConfidence(scenario.confidence)
  elements.missionPolicyCaption.textContent = `Observed ${formatMetric(scenario.metric)} against the recorded ${scenario.threshold.toFixed(2)}% threshold.`
  elements.missionFocusTitle.textContent = scenario.focusTitle
  elements.missionFocusText.textContent = scenario.focusText
  elements.missionBullets.innerHTML = scenario.focusBullets.map((item) => `<li>${item}</li>`).join("")
  elements.riskGauge.style.background = theme.gauge
  elements.riskGaugeLabel.textContent = scenario.riskLabel
  elements.riskGaugeLabel.style.color = theme.color
  elements.riskGaugeDetail.textContent =
    typeof scenario.metric === "number"
      ? `${formatMetric(scenario.metric)} vs ${scenario.threshold.toFixed(2)}%`
      : "No decision"
  setBandMarker(elements.bandMarker, scenario.metric, scenario.threshold)

  const stageMap = {
    observe: scenario.flow[0],
    decide: scenario.flow[1],
    encode: scenario.flow[2],
    anchor: scenario.flow[3],
    verify: scenario.flow[4],
  }
  for (const [key, node] of Object.entries(orbitNodes)) {
    const item = stageMap[key]
    node.className = `orbit-node orbit-${key} state-${item.state}`
    node.dataset.label = item.label
    node.dataset.value = `${item.short}\n${item.detail}`
  }
  elements.missionStageNote.textContent = scenario.flow[3].detail

  elements.missionLiveCards.innerHTML = buildLiveCards().join("")
}

function renderProof() {
  const scenario = getScenario()
  elements.proofWaterfall.innerHTML = scenario.flow
    .map(
      (item) => `
        <article class="waterfall-step state-${item.state}">
          <span class="waterfall-kicker">${item.label}</span>
          <strong class="waterfall-title">${item.detail}</strong>
          <span class="waterfall-value">${item.short}</span>
        </article>
      `,
    )
    .join("")

  elements.proofTimeline.innerHTML = scenario.timeline
    .map(
      (item) => `
        <article class="timeline-step state-${item.state}">
          <span class="timeline-time">${item.time}</span>
          <strong class="timeline-title">${item.title}</strong>
          <p class="muted">${item.detail}</p>
        </article>
      `,
    )
    .join("")

  elements.proofWorkflowId.textContent = scenario.workflowId
  elements.proofDecision.textContent = scenario.riskLabel
  elements.proofEvidenceState.textContent = scenario.evidenceStatus
  elements.proofEventHash.textContent = scenario.eventHash
  elements.proofTxHash.textContent = scenario.txHash
  elements.proofCommand.textContent = scenario.command
  elements.proofEvidencePath.textContent = scenario.evidence
  elements.proofNote.textContent = scenario.note
  elements.proofLog.textContent = scenario.logExcerpt
  if (scenario.txHref) {
    elements.proofTxLink.href = scenario.txHref
    elements.proofTxLink.style.display = "inline-flex"
  } else {
    elements.proofTxLink.style.display = "none"
  }
}

function renderChannels() {
  const scenario = getScenario()
  const entries = buildChannelEntries(scenario)
  elements.channelCards.innerHTML = entries
    .map((entry) => {
      const enabled = state.policy.channels[entry.key]
      return `
        <article class="channel-card ${enabled ? "" : "off"}">
          <div class="channel-card-head">
            <div class="channel-card-title">
              ${iconBox(entry.icon)}
              <div class="channel-card-copy">
                <code>${entry.code}</code>
                <strong>${entry.name}</strong>
              </div>
            </div>
            <span class="inline-status ${enabled ? "ok" : "warn"}">${enabled ? entry.intent : "disabled"}</span>
          </div>
          <p class="muted">${enabled ? entry.body : `${entry.name} is disabled in the current preview policy.`}</p>
        </article>
      `
    })
    .join("")

  elements.telegramPreview.textContent = buildTelegramPreview(scenario)
  const txLink = getScenario().txHref || liveLinks.profile
  elements.channelProofLinks.innerHTML = [
    `<a class="text-link" href="${liveLinks.profile}" target="_blank" rel="noreferrer">Open Aegis Moltbook profile</a>`,
    `<a class="text-link" href="${liveLinks.post}" target="_blank" rel="noreferrer">Open live Moltbook post</a>`,
    `<a class="text-link" href="${txLink}" target="_blank" rel="noreferrer">Open latest proof link</a>`,
  ].join("")
}

function renderPolicy() {
  const scenario = getScenario()
  const preview = computePolicyPreview(scenario)
  const theme = riskTheme(preview.level)
  elements.policyPill.textContent = preview.label
  elements.policyPill.style.color = theme.color
  elements.policyPill.style.background = theme.background
  elements.policyTitle.textContent = preview.title
  elements.policySummary.textContent = preview.summary
  elements.policyRecorded.textContent = formatBand(scenario.level)
  elements.policyPreviewBand.textContent = preview.label
  elements.policyDispatch.textContent = dispatchLabel()
  elements.policyDiff.textContent = preview.diff
  elements.policyActions.innerHTML = preview.actions.map((item) => `<li>${item}</li>`).join("")
  setBandMarker(elements.policyPreviewMarker, scenario.metric, state.policy.threshold)
  elements.policyGuardrails.innerHTML = buildGuardrails(scenario)
    .map(
      (item) => `
        <article class="guardrail-card">
          <strong>${item.title}</strong>
          <p class="muted">${item.body}</p>
        </article>
      `,
    )
    .join("")
}

function buildLiveCards() {
  const live = state.liveStatus
  if (!live) {
    return [
      `
        <article class="live-card">
          <div class="live-card-head">
            ${iconBox("live")}
            <p class="signal-label">Live data</p>
          </div>
          <strong>Loading</strong>
          <small class="inline-status warn">Waiting for the local bridge</small>
        </article>
      `,
    ]
  }

  const cards = [
    {
      icon: "dashboard",
      title: "Akasha dashboard",
      value: live.dashboard?.reachable ? "Connected" : "Offline",
      detail: live.dashboard?.reachable
        ? `${live.dashboard.projectsActive} active / ${live.dashboard.tasksReview} in review`
        : live.dashboard?.error || "Could not reach dashboard",
      status: live.dashboard?.reachable ? "ok" : "fail",
    },
    {
      icon: "moltbook",
      title: "Moltbook account",
      value: live.moltbook?.handle || "Unknown",
      detail: live.moltbook?.claimed
        ? `Claimed${live.moltbook?.verified ? " + verified" : ""}`
        : live.moltbook?.status || "Unknown",
      status: live.moltbook?.claimed ? "ok" : "warn",
    },
    {
      icon: "telegram",
      title: "Telegram path",
      value: live.telegram?.configured ? "Armed" : "Not armed",
      detail: live.telegram?.configured
        ? `${live.telegram.recipientCount} recipients configured`
        : "Bot token or allowlist missing",
      status: live.telegram?.configured ? "ok" : "warn",
    },
    {
      icon: "chain",
      title: "CRE proof",
      value: live.cre?.status || "Unknown",
      detail: live.cre?.txHash ? shortHash(live.cre.txHash) : "No tx available",
      status: live.cre?.status === "confirmed" ? "ok" : "warn",
    },
  ]

  return cards.map(
    (card) => `
      <article class="live-card">
        <div class="live-card-head">
          ${iconBox(card.icon)}
          <p class="signal-label">${card.title}</p>
        </div>
        <strong>${card.value}</strong>
        <small class="inline-status ${card.status}">${card.detail}</small>
      </article>
    `,
  )
}

function renderLiveStatus() {
  elements.liveStatusCards.innerHTML = buildLiveCards().join("")
  buildHeroLiveCards(state.liveStatus)
  if (state.liveStatus?.cre?.txHref) {
    elements.liveTxLink.href = state.liveStatus.cre.txHref
  } else {
    elements.liveTxLink.href = getScenario().txHref || "#"
  }
  elements.livePostLink.href = liveLinks.post
}

function seedChat() {
  if (elements.liveChatThread.children.length > 0) return
  addChatMessage(
    "system",
    "Live Akasha is wired through the local bridge. Use the quick prompts or ask a short direct question about the current scenario.",
  )
}

function addChatMessage(role, text) {
  const bubble = document.createElement("article")
  bubble.className = `chat-bubble ${role}`
  bubble.textContent = text
  elements.liveChatThread.appendChild(bubble)
  elements.liveChatThread.scrollTop = elements.liveChatThread.scrollHeight
}

function renderLivePrompts() {
  const scenario = getScenario()
  const prompts = [
    {
      icon: "proof",
      prompt: `Explain the ${scenario.title} scene in 3 short bullets. Mention the risk level, event hash, and tx hash if present.`,
    },
    {
      icon: "telegram",
      prompt: `Draft a concise Telegram alert for the current ${scenario.title} scenario.`,
    },
    {
      icon: "guard",
      prompt: "Summarize why this is a guarded autonomous system in 2 sentences.",
    },
    {
      icon: "policy",
      prompt: `What should an operator do next after the ${scenario.title} run?`,
    },
  ]

  elements.liveChatPrompts.innerHTML = prompts
    .map(
      (item) =>
        `<button class="prompt-chip" type="button" data-prompt="${item.prompt.replaceAll('"', "&quot;")}">${iconBox(item.icon, "prompt-icon")}<span>${item.prompt}</span></button>`,
    )
    .join("")

  for (const button of elements.liveChatPrompts.querySelectorAll(".prompt-chip")) {
    button.addEventListener("click", () => {
      const prompt = button.dataset.prompt || button.textContent || ""
      elements.liveChatInput.value = prompt
      void sendChat(prompt)
    })
  }

  const actions = [
    {
      icon: "chain",
      label: "Explain current anchor",
      prompt:
        "Explain the current Sepolia anchor in 3 short bullets. Mention the risk level, event hash, and tx hash.",
      detail: "Fast explainer for the live chain proof.",
    },
    {
      icon: "chat",
      label: "Operator takeaway",
      prompt: "Give the operator takeaway from the current scenario in 2 concise sentences.",
      detail: "Concise guidance for the person on call.",
    },
    {
      icon: "telegram",
      label: "Draft Telegram alert",
      prompt: "Draft a single Telegram alert message for the current scenario.",
      detail: "Use this before sending a live test alert.",
    },
    {
      icon: "moltbook",
      label: "Moltbook submission angle",
      prompt: "In 3 short bullets, what makes Aegis a strong Chainlink CRE autonomous agent submission?",
      detail: "Useful for the post and the closing demo line.",
    },
  ]

  elements.liveActionButtons.innerHTML = actions
    .map(
      (item) =>
        `<button class="action-button" type="button" data-prompt="${item.prompt}">
          ${iconBox(item.icon)}
          <span class="action-button-copy">
            <strong>${item.label}</strong>
            <small>${item.detail}</small>
          </span>
        </button>`,
    )
    .join("")

  for (const button of elements.liveActionButtons.querySelectorAll(".action-button")) {
    button.addEventListener("click", () => {
      const prompt = button.dataset.prompt || ""
      elements.liveChatInput.value = prompt
      void sendChat(prompt)
    })
  }
}

async function fetchLiveStatus() {
  try {
    const response = await fetch("/api/live-status", { cache: "no-store" })
    if (!response.ok) throw new Error(`status ${response.status}`)
    state.liveStatus = await response.json()
    renderLiveStatus()
    elements.chatMeta.textContent = state.liveStatus.dashboard?.reachable ? "Dashboard connected" : "Dashboard offline"
    elements.chatMeta.className = `inline-status ${state.liveStatus.dashboard?.reachable ? "ok" : "warn"}`
  } catch (error) {
    state.liveStatus = null
    renderLiveStatus()
    elements.chatMeta.textContent = "Live bridge unavailable"
    elements.chatMeta.className = "inline-status fail"
  }
}

async function sendChat(rawPrompt) {
  const prompt = rawPrompt || elements.liveChatInput.value.trim()
  if (!prompt) return
  addChatMessage("operator", prompt)
  elements.liveChatInput.value = ""
  elements.liveChatSend.disabled = true
  elements.chatMeta.textContent = "Akasha thinking"
  elements.chatMeta.className = "inline-status warn"

  try {
    const response = await fetch("/api/akasha-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || `status ${response.status}`)
    }
    addChatMessage("akasha", data.text || "No reply returned.")
    elements.chatMeta.textContent = data.provider ? `${data.provider} / ${data.taskType || "chat"}` : "Live reply"
    elements.chatMeta.className = "inline-status ok"
  } catch (error) {
    addChatMessage("system", `Live Akasha call failed: ${error instanceof Error ? error.message : "unknown error"}`)
    elements.chatMeta.textContent = "Chat failed"
    elements.chatMeta.className = "inline-status fail"
  } finally {
    elements.liveChatSend.disabled = false
  }
}

async function sendTelegramTest() {
  elements.telegramSend.disabled = true
  elements.telegramResult.textContent = "Sending..."
  elements.telegramResult.className = "inline-status warn"

  try {
    const response = await fetch("/api/send-telegram-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: buildTelegramPreview(getScenario()) }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || `status ${response.status}`)
    }
    elements.telegramResult.textContent = data.message || "Telegram alert sent"
    elements.telegramResult.className = "inline-status ok"
  } catch (error) {
    elements.telegramResult.textContent = error instanceof Error ? error.message : "Telegram send failed"
    elements.telegramResult.className = "inline-status fail"
  } finally {
    elements.telegramSend.disabled = false
  }
}

function renderTabs() {
  for (const button of tabButtons) {
    const active = button.dataset.tab === state.activeTab
    button.classList.toggle("is-active", active)
  }
  for (const panel of tabPanels) {
    panel.classList.toggle("is-active", panel.dataset.tabPanel === state.activeTab)
  }
}

function syncPolicyControls() {
  elements.thresholdSlider.value = String(state.policy.threshold)
  elements.thresholdOutput.textContent = `${state.policy.threshold.toFixed(2)}%`
  elements.approvalToggle.checked = state.policy.requireApproval
  elements.toggleDashboard.checked = state.policy.channels.dashboard
  elements.toggleTelegram.checked = state.policy.channels.telegram
  elements.toggleChat.checked = state.policy.channels.chat
  elements.toggleEmail.checked = state.policy.channels.email
  for (const button of modeButtons) {
    button.classList.toggle("is-active", button.dataset.mode === state.policy.mode)
  }
}

function render() {
  renderScenarioStrip()
  renderTabs()
  renderMission()
  renderProof()
  renderChannels()
  renderPolicy()
  renderLiveStatus()
  renderLivePrompts()
  syncPolicyControls()
  seedChat()
}

function cycleScenario() {
  const index = scenarios.findIndex((scenario) => scenario.id === state.activeScenarioId)
  const next = scenarios[(index + 1) % scenarios.length]
  state.activeScenarioId = next.id
  state.policy.threshold = next.threshold
  render()
}

function setAutoplay(enabled) {
  state.autoplay = enabled
  if (elements.autoplayLabel) {
    elements.autoplayLabel.textContent = `Autoplay: ${enabled ? "On" : "Off"}`
  }
  if (state.autoplayHandle) {
    clearInterval(state.autoplayHandle)
    state.autoplayHandle = null
  }
  if (enabled) {
    state.autoplayHandle = setInterval(cycleScenario, 9000)
  }
}

function bindEvents() {
  for (const button of tabButtons) {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab || "mission"
      renderTabs()
    })
  }

  elements.thresholdSlider.addEventListener("input", () => {
    state.policy.threshold = Number.parseFloat(elements.thresholdSlider.value)
    elements.thresholdOutput.textContent = `${state.policy.threshold.toFixed(2)}%`
    renderPolicy()
  })

  elements.approvalToggle.addEventListener("change", () => {
    state.policy.requireApproval = elements.approvalToggle.checked
    renderPolicy()
  })

  for (const [key, node] of Object.entries({
    dashboard: elements.toggleDashboard,
    telegram: elements.toggleTelegram,
    chat: elements.toggleChat,
    email: elements.toggleEmail,
  })) {
    node.addEventListener("change", () => {
      state.policy.channels[key] = node.checked
      renderChannels()
      renderPolicy()
      renderMission()
    })
  }

  for (const button of modeButtons) {
    button.addEventListener("click", () => {
      state.policy.mode = button.dataset.mode || "broadcast"
      syncPolicyControls()
      renderPolicy()
    })
  }

  elements.liveChatSend.addEventListener("click", () => void sendChat())
  elements.liveChatInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault()
      void sendChat()
    }
  })
  elements.telegramSend.addEventListener("click", () => void sendTelegramTest())
  elements.refreshLive.addEventListener("click", () => void fetchLiveStatus())
  elements.autoplayToggle.addEventListener("click", () => setAutoplay(!state.autoplay))
}

bindEvents()
setAutoplay(false)
render()
void fetchLiveStatus()

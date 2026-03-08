# Aegis by Akasha - Architecture

## Product Thesis
Aegis by Akasha is an autonomous treasury guardian for tokenized funds and DeFi systems.
Its job is simple: detect external market stress, compute a policy-based reserve posture,
and anchor that decision on-chain with evidence.

This turns a raw workflow into a product judges can immediately understand:
guarded autonomy with proof.

## Problem
Autonomous systems are easy to claim and hard to trust.

For treasury and reserve management, operators need more than a signal.
They need an auditable chain from:
1. external input,
2. deterministic decision,
3. on-chain action, and
4. safe failure handling.

## Product Promise
Aegis answers one question:

"Can an autonomous system observe an external market signal and take a verifiable,
explainable, testnet-safe action on-chain?"

This project demonstrates that the answer is yes.

## System Architecture

### 1. Observe
- CRE cron trigger starts execution on a schedule
- Workflow fetches BTC 24h change from CoinGecko

### 2. Decide
- Risk engine classifies the metric as `low`, `medium`, or `high`
- Decision uses a transparent threshold policy, not opaque heuristics
- Workflow constructs a structured decision object and a deterministic event hash

### 3. Anchor
- Workflow reads reserve-relevant chain state
- CRE EVM path signs and writes the report on Sepolia
- Workflow emits a transaction hash as final proof of action

### 4. Verify
- Simulation logs capture decision and hash output
- Fixture reruns prove determinism across identical inputs
- RPC lookup and receipt confirm the transaction succeeded on Sepolia

### 5. Fail Safely
- API outage with no fallback causes explicit hard-stop
- Unfunded wallet causes explicit on-chain write failure
- Errors are preserved as evidence, not hidden

## Workflow Topology
- Trigger: CRE cron trigger in `my-workflow/workflow.yaml`
- Ingest: HTTP pull from CoinGecko
- Decision: classify 24h BTC volatility against threshold policy
- Evidence: compute deterministic `event_hash`
- Action: write signed report through the CRE EVM write path
- Proof: logs, tx hash, receipt, and explorer link

## Technical Components
- `code/cre-risk-monitor/my-workflow/main.ts`
  - fetch signal
  - classify risk
  - build decision
  - compute event hash
  - write anchored report on Sepolia
- `config.staging.json` / `config.production.json`
  - source URL, thresholds, EVM endpoints, contract addresses
- `config.fixture.json`
  - fixed metric and fixed timestamp for deterministic reruns
- `config.api-fail.json`
  - forced HTTP failure profile for safety validation
- `scripts/run-simulate.sh`
  - non-interactive simulation wrapper
- `scripts/run-simulate-fixture.sh`
  - deterministic rerun wrapper
- `scripts/run-broadcast.sh`
  - simulation plus Sepolia broadcast path

## Why This Feels Agentic
The key agentic property is not chat. It is autonomous, policy-driven action with proof.

Aegis:
- observes a live external condition,
- decides on a course of action,
- executes via CRE,
- records evidence,
- and fails safely under bad conditions.

That is a much stronger framing than "monitoring".

## Proof Pack
- Successful staging simulation
- Deterministic fixture rerun with identical event hash
- Successful Sepolia on-chain anchor
- Explicit API-down failure
- Explicit insufficient-funds failure

## Safety and Guardrails
- testnet only
- explicit Sepolia chain selector
- no secret printing
- no fabricated metrics
- human checkpoint before final publication

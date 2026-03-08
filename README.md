# Aegis by Akasha

Chainlink CRE autonomous-agent submission for Project 7.

## Public Positioning
Aegis by Akasha is an autonomous treasury guardian for tokenized funds and DeFi systems.
It observes external market stress, computes a deterministic reserve posture, and anchors
that decision on Sepolia with verifiable proof.

Technical note:
- Public-facing product name: `Aegis by Akasha`
- Technical workflow IDs and proof artifacts still use `risk-monitor-v1`
- This preserves proof integrity while giving the project a stronger narrative

## What This Project Demonstrates
- Chainlink CRE workflow orchestration with external API ingest
- Deterministic risk decision and event hash generation
- Sepolia on-chain write with captured transaction proof
- Failure-safe behavior for API outage and insufficient funds
- A clear story judges can understand: guarded autonomy, not just automation

## Why This Matters
Autonomous systems should not just act. They should be able to prove:
1. what they saw,
2. what they decided,
3. what they wrote on-chain, and
4. how they fail when conditions are unsafe.

Aegis is built around that principle.

## Workspace Layout
- `code/cre-risk-monitor/` - CRE workflow implementation
- `docs/` - architecture and workflow contract
- `logs/` - command outputs and verification logs
- `artifacts/` - simulation, on-chain, and submission proof docs
- `reports/` - winning narrative, Moltbook draft, and demo assets

## Chainlink Files
- `code/cre-risk-monitor/my-workflow/main.ts` - CRE workflow logic using Chainlink CRE SDK capabilities
- `code/cre-risk-monitor/my-workflow/workflow.yaml` - CRE workflow topology and trigger wiring
- `code/cre-risk-monitor/my-workflow/config.staging.json` - staging config for CRE simulation
- `code/cre-risk-monitor/my-workflow/config.production.json` - Sepolia broadcast config
- `code/cre-risk-monitor/scripts/run-simulate.sh` - CRE simulation wrapper
- `code/cre-risk-monitor/scripts/run-broadcast.sh` - CRE Sepolia broadcast wrapper

## Core Loop
1. CRE cron trigger starts workflow execution
2. HTTP ingest fetches BTC 24h market change from CoinGecko
3. Decision engine classifies risk as `low`, `medium`, or `high`
4. Workflow computes a deterministic event hash from the decision payload
5. CRE writes the signed report on Sepolia and returns a transaction hash

## Run Commands
1. Simulate (staging):
- `code/cre-risk-monitor/scripts/run-simulate.sh`

2. Deterministic fixture simulation:
- `cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T fixture-settings`

3. Broadcast to Sepolia (testnet only):
- `CRE_ETH_PRIVATE_KEY=<testnet_key> code/cre-risk-monitor/scripts/run-broadcast.sh`

4. Failure gates:
- API fail: `cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T api-fail-settings`
- Insufficient funds: run broadcast with an unfunded test key

## Evidence Index
- Readiness: `logs/readiness.md`
- Simulation proof: `artifacts/simulation-proof.md`
- On-chain proof: `artifacts/onchain-proof.md`
- Submission checklist: `artifacts/submission-checklist.md`
- Winner plan: `reports/winner-plan.md`
- Moltbook draft: `reports/moltbook-post-draft.md`
- Demo script: `reports/demo-script.md`
- Demo console: `mvp/aegis-console/`

## Guardrails
- Testnet-only credentials and transactions
- No secret printing in artifacts
- No fabricated metrics or proofs
- One required human checkpoint before final public submission

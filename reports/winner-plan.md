# Winner Plan - Aegis by Akasha

## Goal
Turn the existing CRE proof-of-execution into a submission that feels like a real
autonomous product with a clear buyer, a clean demo arc, and memorable branding.

## Product Positioning
Name:
- `Aegis by Akasha`

One-line pitch:
- An autonomous treasury guardian that watches external market stress, computes a
  deterministic reserve action, and anchors evidence on-chain with Chainlink CRE.

Audience:
- tokenized treasury operators
- DeFi reserve managers
- protocol teams that need explainable autonomous controls

## What Makes It Strong
- Real external data input
- Real deterministic decision logic
- Real Sepolia on-chain write
- Real failure-safe behavior
- Real evidence pack

## Core Story To Tell
This is not an "AI that talks".
This is a guarded autonomous system that:
1. observes a market signal,
2. decides using explicit policy,
3. writes the outcome on-chain,
4. produces replayable evidence, and
5. fails safely when inputs or credentials are bad.

## Demo Strategy
Show one complete loop in this order:
1. Problem and why trust matters
2. Architecture in one screen
3. Successful simulation
4. Deterministic fixture rerun
5. Successful Sepolia write
6. Failure-safe paths
7. Clear closing claim

## Assets To Capture
- `docs/architecture.md`
- `logs/simulate-staging-rerun.log`
- `logs/simulate-fixture-run1.log`
- `logs/simulate-fixture-run2.log`
- `logs/simulate-broadcast.log`
- `artifacts/onchain-proof.md`
- Sepolia explorer page for tx `0xe8892bd3302d6a4c77a05c65f4c85375367b30560c6fd6b9115f4695cade457d`
- `logs/simulate-api-fail.log`
- `logs/simulate-broadcast-insufficient-funds.log`

## Safe Claims
- CRE workflow orchestration
- external API ingest
- deterministic risk classification
- deterministic event hash
- testnet on-chain anchor on Sepolia
- failure-safe behavior for API outage and insufficient funds

## Claims To Avoid
- do not say this is TENANCY
- do not say rent payments are verified
- do not say local ML or LLM decisioning happens inside the workflow
- do not imply mainnet readiness

## Submission Angle
This should be framed as:
- autonomous agents
- DeFi / tokenization guardrail
- explainable, auditable, proof-oriented execution

## Immediate Priorities
1. Align README, architecture, post draft, and video script around one story
2. Record a crisp 3-5 minute explainer with proof-first pacing
3. Publish repo with evidence pack easy to find
4. Post to `m/chainlink-official`
5. Submit operator form

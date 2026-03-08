# Demo Script - Aegis by Akasha

Target length: 3.5 to 4.5 minutes

## Visual Direction
- clean terminal close-ups
- one architecture screen
- one polished operator console screen (`mvp/aegis-console/`)
- slow zoom on proof artifacts
- confident, minimal edits
- use captions for `risk_decision`, `event_hash`, and `tx_hash`

## Spoken Script

### 0:00 - 0:20 | Hook
Voiceover:
"Most autonomous agents can make decisions. Very few can prove exactly what they saw,
why they acted, and whether that action was actually anchored on-chain. That is the
problem we wanted to solve."

On screen:
- project title card or `mvp/aegis-console/` hero
- subtitle: `Aegis by Akasha`
- subline: `Autonomous Treasury Guardian on Chainlink CRE`

### 0:20 - 0:45 | Product Framing
Voiceover:
"Aegis by Akasha is an autonomous treasury guardian for tokenized funds and DeFi systems.
It watches external market stress, computes a deterministic reserve posture, and anchors
that decision on Sepolia with verifiable evidence."

On screen:
- `mvp/aegis-console/` hero and proof scoreboard
- README headline for the one-line pitch

### 0:45 - 1:15 | Architecture
Voiceover:
"Here is the full loop. A Chainlink CRE cron trigger starts the workflow. The workflow
pulls a live market signal from CoinGecko. It classifies the signal into low, medium,
or high risk. Then it generates a deterministic event hash from the workflow ID and
decision payload. Finally, it writes an anchored report on Sepolia."

On screen:
- `docs/architecture.md` or `mvp/aegis-console/` stage rail
- animate or highlight:
  - Observe
  - Decide
  - Anchor
  - Verify
  - Fail Safely

### 1:15 - 1:45 | Code Walkthrough
Voiceover:
"The workflow stays intentionally explainable. First, it fetches the market signal.
Then it applies a visible threshold policy. Then it builds a structured decision object
and hashes that decision for replayable evidence. Finally, it sends the report on-chain
through the CRE EVM write path."

On screen:
- `main.ts`
- highlight:
  - `readMarketChange`
  - `classifyRisk`
  - `buildRiskDecision`
  - `computeEventHash`
  - `writeAnchor`

### 1:45 - 2:20 | Successful Simulation
Voiceover:
"Now for the first proof: a successful CRE simulation. The workflow compiles, runs,
emits a structured risk decision, emits the event hash, and completes successfully.
So this is not a mock architecture diagram. It is a working end-to-end execution path."

On screen:
- `logs/simulate-staging-rerun.log`
- hold on:
  - `risk_decision`
  - `event_hash`
  - successful simulation result

### 2:20 - 2:50 | Determinism
Voiceover:
"Next is determinism. We run the fixture profile twice using the same fixed metric and
timestamp. Both runs return the exact same event hash. That matters because autonomous
systems need replayable evidence, not vibes."

On screen:
- split screen:
  - `logs/simulate-fixture-run1.log`
  - `logs/simulate-fixture-run2.log`
- zoom on matching hash

### 2:50 - 3:25 | On-Chain Proof
Voiceover:
"Now for the on-chain anchor. In the broadcast run, the workflow emits the decision,
computes the event hash, and returns a real Sepolia transaction hash. We verify the
transaction separately through RPC receipt data, and the receipt status is success."

On screen:
- `logs/simulate-broadcast.log`
- `artifacts/onchain-proof.md`
- Sepolia explorer page for the tx
- receipt snippet showing `status: 0x1`

### 3:25 - 3:55 | Failure Safety
Voiceover:
"We also tested failure-safe behavior. If the external API is unavailable, the workflow
stops with a clear ingest failure. If the wallet is unfunded, the workflow fails with
an explicit insufficient-funds error. That is a core part of guarded autonomy: unsafe
conditions should stop execution clearly, not silently."

On screen:
- `logs/simulate-api-fail.log`
- `logs/simulate-broadcast-insufficient-funds.log`

### 3:55 - 4:25 | Close
Voiceover:
"Aegis by Akasha shows that an autonomous Chainlink CRE workflow can observe an external
signal, make a deterministic decision, write evidence on-chain, and fail safely when
conditions are bad. That is the kind of autonomy we think should power real treasury
systems: explainable, replayable, and provable."

On screen:
- closing title card
- bullets:
  - external data
  - deterministic decision
  - Sepolia write
  - proof pack
  - safe failure

## Editor Notes
- Do not mention TENANCY
- Do not claim local ML or LLM reasoning inside the workflow
- Keep the tone sharp and technical, not hype-heavy
- Let the transaction hash and matching event hashes carry the credibility

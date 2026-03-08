# Simulation Proof

## Status
Status: PASS

## Primary Simulation (staging profile)
- Command:
  - `cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T staging-settings`
- Evidence log:
  - `logs/simulate-staging-rerun.log`
- Observed output markers:
  - risk decision emitted
  - event hash emitted (`0x63706523ada5e1a67157f07de398ef14b8ce679d194fb57e0c86fd45072b01a0`)
  - simulation completed successfully

## Deterministic Re-run (fixture profile)
- Command (run twice):
  - `cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T fixture-settings`
- Evidence logs:
  - `logs/simulate-fixture-run1.log`
  - `logs/simulate-fixture-run2.log`
- Determinism check:
  - run1 event hash: `0x71eed900a2b5ce90b9e3a6e2b9ce4cd817b2c8bc16612451820fc99fa25de28e`
  - run2 event hash: `0x71eed900a2b5ce90b9e3a6e2b9ce4cd817b2c8bc16612451820fc99fa25de28e`
  - verdict: identical decision + hash across reruns

## Failure-Safe Simulation Checks
1. API unavailable path:
- Command:
  - `cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T api-fail-settings`
- Evidence:
  - `logs/simulate-api-fail.log`
- Result:
  - hard failure with explicit reason (`Market ingest failed with no fallback`)

2. Insufficient funds path:
- Command:
  - `cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T staging-settings --broadcast` using an unfunded random test key
- Evidence:
  - `logs/simulate-broadcast-insufficient-funds.log`
- Result:
  - hard failure with explicit reason (`insufficient funds for gas * price + value`)

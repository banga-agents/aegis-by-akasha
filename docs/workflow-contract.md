# Workflow Contract - Autonomous Risk Monitor

## Contracted Interfaces

### RiskInput
```json
{
  "source": "string",
  "timestamp": "ISO-8601",
  "metric": "number",
  "threshold": "number"
}
```

### RiskDecision
```json
{
  "level": "low | medium | high",
  "rationale": "string",
  "confidence": "number",
  "metric": "number",
  "threshold": "number"
}
```

### AuditAnchor
```json
{
  "event_hash": "0x...",
  "workflow_id": "risk-monitor-v1",
  "timestamp": "ISO-8601",
  "tx_hash": "0x..."
}
```

## Determinism
Given same `metric`, `threshold`, and `timestamp`, the emitted event hash is deterministic.
For fixture tests, `fixedMetric` + `fixedTimestamp` are used to guarantee stable reruns.

## Failure Semantics
- HTTP failure:
  - if `fallbackChangePct` configured -> use fallback and continue
  - else -> hard fail with `Status: BLOCKED` style output in logs
- EVM write failure:
  - one retry
  - then hard fail with `error`, `next action`, and preserving computed event hash

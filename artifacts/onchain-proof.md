# On-Chain Proof (Sepolia)

## Status
Status: PASS

## Broadcast Execution
- Command:
  - `code/cre-risk-monitor/scripts/run-broadcast.sh`
- Evidence log:
  - `logs/simulate-broadcast.log`

## Anchored Values
- Workflow ID: `risk-monitor-v1`
- Broadcast timestamp: `2026-03-08T02:23:48Z`
- Event hash: `0xc549a7bbe140765981ec3a3a78598e2696f29213feff1e1cec09ba04e1c849e1`
- Tx hash: `0x2358ad37c9f97a6564cefa71dc5153b3672929fc634009cbbd1c3f649540eff1`
- Explorer URL:
  - `https://sepolia.etherscan.io/tx/0x2358ad37c9f97a6564cefa71dc5153b3672929fc634009cbbd1c3f649540eff1`

## RPC Verification Evidence
- `logs/tx-lookup-2358ad37.json` -> transaction present
- `logs/tx-receipt-2358ad37.json` -> receipt status `0x1`

## Receipt Snapshot
- blockNumber: `0x9ec883` (`10406019`)
- status: `0x1`
- gasUsed: `0x1467d` (`83581`)
- from: `0x3985463e3daf65bd8a7217cc7d6f6f6383fb3de5`
- to: `0x15fc6ae953e024d975e77382eeec56a9101f9f88`

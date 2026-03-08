#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH="$HOME/.local/bin:$HOME/.bun/bin:$PATH"
cd "$ROOT_DIR"

if [[ -f ".env" ]]; then
  set -a
  source ".env"
  set +a
fi

if [[ -f ".env.local" ]]; then
  set -a
  source ".env.local"
  set +a
fi

if [[ -z "${CRE_ETH_PRIVATE_KEY:-}" ]]; then
  echo "CRE_ETH_PRIVATE_KEY is required for --broadcast runs" >&2
  exit 1
fi

mkdir -p ../../logs
cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T staging-settings --broadcast \
  2>&1 | tee ../../logs/simulate-broadcast.log

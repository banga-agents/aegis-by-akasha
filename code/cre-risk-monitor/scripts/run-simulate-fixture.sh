#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export PATH="$HOME/.local/bin:$HOME/.bun/bin:$PATH"
cd "$ROOT_DIR"

mkdir -p ../../logs
cre workflow simulate my-workflow --non-interactive --trigger-index 0 -T fixture-settings \
  2>&1 | tee ../../logs/simulate-fixture.log

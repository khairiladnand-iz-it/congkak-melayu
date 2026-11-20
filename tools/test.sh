#!/usr/bin/env bash
# Ujian penuh: sintaks, enjin, UI, lobi.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== bina =="
python3 tools/build.py --chk >/dev/null
echo "== sintaks =="
node --check tests/chk.js && echo "  OK"
fail=0
for t in t t2 t3 lobitest p2ptest animtest perftest; do
  echo "== $t =="
  out=$(NO3D=1 node tests/h.js "tests/$t.js" 2>&1 || true)
  echo "$out" | grep -vE "^    at |^Error: Pustaka" | tail -4
  if echo "$out" | grep -qE "FAIL|TEST FAIL"; then fail=1; fi
done
if [ "$fail" -ne 0 ]; then echo "ADA UJIAN GAGAL"; exit 1; fi
echo "SEMUA UJIAN LULUS"

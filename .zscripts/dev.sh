#!/bin/bash

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

# Kill any existing process on port 3000
if lsof -ti:3000 >/dev/null 2>&1; then
  kill $(lsof -ti:3000) 2>/dev/null || true
  sleep 1
fi

# Install deps
bun install 2>/dev/null

# Push database schema
bun run db:push 2>/dev/null

# Start mini-services
if [ -d "$PROJECT_DIR/mini-services" ]; then
  for service_dir in "$PROJECT_DIR/mini-services"/*/; do
    if [ -f "$service_dir/package.json" ] && grep -q '"dev"' "$service_dir/package.json"; then
      (
        cd "$service_dir"
        bun install 2>/dev/null
        exec bun run dev
      ) >"$PROJECT_DIR/.zscripts/mini-service-$(basename $service_dir).log" 2>&1 &
      disown $! 2>/dev/null || true
    fi
  done
fi

# Start Next.js dev server (replaces this shell process - survives parent death)
exec npx next dev -p 3000

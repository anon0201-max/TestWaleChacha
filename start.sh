#!/bin/bash
cd /home/z/my-project
while true; do
  echo "$(date): Starting Next.js..."
  NODE_OPTIONS="--max-old-space-size=384" npx next dev -p 3000 2>&1
  EXIT_CODE=$?
  echo "$(date): Exit code: $EXIT_CODE, restarting in 2s..."
  sleep 2
done

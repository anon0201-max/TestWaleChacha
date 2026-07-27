#!/bin/bash
cd /home/z/my-project
while true; do
  rm -rf .next
  echo "[$(date)] Starting dev server..." >> /home/z/my-project/keep-alive.log
  npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1
  echo "[$(date)] Server exited, restarting in 3s..." >> /home/z/my-project/keep-alive.log
  sleep 3
done

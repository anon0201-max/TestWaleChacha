#!/bin/bash
# Keepalive wrapper for extract-service
# Restarts the service if it dies

cd /home/z/my-project/mini-services/extract-service

while true; do
  echo "[$(date)] Starting extract-service..."
  bun --hot index.ts >> /home/z/my-project/extract-service.log 2>&1
  EXIT_CODE=$?
  echo "[$(date)] extract-service exited with code $EXIT_CODE. Restarting in 3s..."
  sleep 3
done

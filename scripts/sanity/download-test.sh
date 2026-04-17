#!/bin/bash
# Download MiniMax images and upload to Sanity

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Source .env
export $(grep -v '^#' .env | grep -v '^$' | xargs)

echo "=== Testing image download ==="
curl -s -I "https://hailuo-image-algeng-data-us.oss-us-east-1.aliyuncs.com/image_inference_output%2Ftalkie%2Fprod%2Fimg%2F2026-04-15%2F5d073eb2-9d5c-4b55-9b76-6e39335732f7_aigc.jpeg" 2>&1 | head -10

echo ""
echo "=== Trying with full headers ==="
curl -v "https://hailuo-image-algeng-data-us.oss-us-east-1.aliyuncs.com/image_inference_output%2Ftalkie%2Fprod%2Fimg%2F2026-04-15%2F5d073eb2-9d5c-4b55-9b76-6e39335732f7_aigc.jpeg" 2>&1 | head -40
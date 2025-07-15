#!/usr/bin/env bash

# Usage:
# ./hdr-to-ktx2-png.sh /path/to/textures-folder

set -e

INPUT_DIR="$1"

if [ -z "$INPUT_DIR" ]; then
  echo "Usage: $0 /path/to/textures-folder"
  exit 1
fi

command -v magick >/dev/null 2>&1 || { echo >&2 "ImageMagick 'magick' is required but not installed."; exit 1; }
command -v toktx >/dev/null 2>&1 || { echo >&2 "toktx is required but not installed."; exit 1; }

find "$INPUT_DIR" -type f -name "*.hdr" | while read -r HDR_FILE; do
  BASENAME=$(basename "$HDR_FILE" .hdr)
  DIRNAME=$(dirname "$HDR_FILE")

  PNG_FILE="$DIRNAME/$BASENAME.png"
  KTX2_FILE="$DIRNAME/$BASENAME.ktx2"

  echo "Processing: $HDR_FILE"

  # 1. Convert HDR to flipped PNG
  magick "$HDR_FILE" -flip "$PNG_FILE"
  echo "Created flipped PNG: $PNG_FILE"

  # 2. Convert PNG to KTX2 with ETC1S compression
  toktx --t2 --genmipmap "$KTX2_FILE" "$PNG_FILE"
  echo "Created compressed KTX2 (ETC1S): $KTX2_FILE"

  echo "Done processing: $HDR_FILE"
  echo "--------------------------------------"
done

echo "✅ All HDR files processed."

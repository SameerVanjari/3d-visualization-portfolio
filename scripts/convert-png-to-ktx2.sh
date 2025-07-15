#!/usr/bin/env bash

# Usage:
# ./convert-png-to-ktx2.sh ./public/textures

set -e

INPUT_DIR="$1"

if [ -z "$INPUT_DIR" ]; then
  echo "Usage: $0 /path/to/textures-folder"
  exit 1
fi

command -v toktx >/dev/null 2>&1 || { echo >&2 "toktx is required but not installed."; exit 1; }
command -v convert >/dev/null 2>&1 || { echo >&2 "ImageMagick 'convert' is required but not installed."; exit 1; }

find "$INPUT_DIR" -type f -iname "*.png" | while read -r INPUT_FILE; do
  BASENAME=$(basename "$INPUT_FILE")
  NAME_NO_EXT="${BASENAME%.*}"
  DIRNAME=$(dirname "$INPUT_FILE")

  TMP_FLIPPED="$DIRNAME/${NAME_NO_EXT}_flipped.png"
  KTX2_FILE="$DIRNAME/${NAME_NO_EXT}_etc1s.ktx2"

  echo "🔹 Processing: $INPUT_FILE"

  echo "➡️ Flipping vertically..."
  magick "$INPUT_FILE" -flip "$TMP_FLIPPED"

  echo "➡️ Creating ETC1S KTX2 texture..."
  toktx --t2 --genmipmap "$KTX2_FILE" "$TMP_FLIPPED"

  if [ ! -f "$KTX2_FILE" ]; then
    echo "❌ ERROR: KTX2 file was not created."
    exit 1
  fi

  HEADER=$(xxd -l 12 "$KTX2_FILE" | awk '{print toupper($2$3$4$5$6$7$8$9)}')
  if [[ "$HEADER" != "AB4B5458203230BB0D0A1A0A" ]]; then
    echo "❌ ERROR: KTX2 magic header not found. Something went wrong."
    exit 1
  fi

  echo "✅ Created and verified $KTX2_FILE"

  # Cleanup flipped temp
  rm "$TMP_FLIPPED"
done

echo "🎉 All PNG files converted successfully."

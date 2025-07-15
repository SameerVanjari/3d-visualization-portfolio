#!/usr/bin/env bash

# Converts PNG to ETC1S-compressed KTX2 that will load in Three.js KTX2Loader.

INPUT_DIR="$1"

if [ -z "$INPUT_DIR" ]; then
  echo "Usage: $0 /path/to/textures"
  exit 1
fi

command -v toktx >/dev/null 2>&1 || { echo "toktx not found"; exit 1; }
command -v convert >/dev/null 2>&1 || { echo "ImageMagick 'convert' not found"; exit 1; }

find "$INPUT_DIR" -type f -iname "*.png" | while read -r INPUT_FILE; do
  BASENAME=$(basename "$INPUT_FILE")
  NAME_NO_EXT="${BASENAME%.*}"
  DIRNAME=$(dirname "$INPUT_FILE")

  TMP_FLIPPED="$DIRNAME/${NAME_NO_EXT}_flipped.png"
  KTX2_FILE="$DIRNAME/${NAME_NO_EXT}_etc1s.ktx2"

  echo "🔹 Processing: $INPUT_FILE"

  echo "➡️ Flipping vertically..."
  magick "$INPUT_FILE" "$TMP_FLIPPED"

  echo "➡️ Creating ETC1S-compressed KTX2 texture..."
  toktx --t2 --genmipmap --encode etc1s --qlevel 128 "$KTX2_FILE" "$TMP_FLIPPED"

  echo "✅ Created $KTX2_FILE"

  rm "$TMP_FLIPPED"
done

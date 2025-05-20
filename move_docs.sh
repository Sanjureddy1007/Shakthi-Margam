#!/bin/bash

# Create docs directory if it doesn't exist
mkdir -p docs

# Move all Markdown files from the root directory to docs
for file in *.md; do
  if [ "$file" != "README.md" ]; then
    echo "Moving $file to docs/"
    mv "$file" docs/
  fi
done

echo "All Markdown files have been moved to the docs directory."

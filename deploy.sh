#!/bin/bash

# Navigate to web frontend directory
cd src/web || exit 1

# Build the app using Vite
npm run build || exit 1

# Go back to repo root
cd ../..

# Remove old docs folder
rm -rf docs

# Copy fresh build output
cp -r src/web/dist docs

# Optional: Add + commit
echo "✔ Build copied to /docs. You can now commit and push"
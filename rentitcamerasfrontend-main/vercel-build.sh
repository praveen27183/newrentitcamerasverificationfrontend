#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Ensure Vite binary has execute permissions
echo "Setting up Vite..."
chmod +x node_modules/.bin/vite 2>/dev/null || true

# Run build
echo "Running build..."
npm run build

echo "Build completed successfully!"

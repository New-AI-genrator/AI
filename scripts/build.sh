#!/bin/bash

# Install TypeScript and types
echo "Installing TypeScript and types..."
npm install --save-dev typescript @types/react @types/node @types/react-dom

# Run the build
echo "Running Next.js build..."
npm run build

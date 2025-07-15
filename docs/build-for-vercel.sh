#!/bin/bash

# Build script for Vercel deployment
set -e

echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Building PWA..."
cd pwa
npm run build
cd ..

echo "Creating deployment structure..."
rm -rf dist
mkdir -p dist
mkdir -p dist/app

echo "Copying frontend files..."
cp -r frontend/dist/* dist/

echo "Copying PWA files..."
cp -r pwa/dist/* dist/app/

echo "Build complete! Structure:"
echo "dist/ (frontend)"
echo "dist/app/ (PWA)"

ls -la dist/
echo ""
echo "PWA files:"
ls -la dist/app/


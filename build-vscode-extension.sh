#!/usr/bin/env bash

# Build script for VSCode extension

set -e

echo "Building Graphviz Visual Editor VSCode Extension..."

# Step 1: Build the React web app
echo "Step 1: Building React web app..."
npm run build

# Step 2: Create the extension directory structure
echo "Step 2: Setting up extension directory..."
cd vscode-extension

# Install extension dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing extension dependencies..."
    npm install
fi

# Step 3: Compile TypeScript
echo "Step 3: Compiling TypeScript..."
npm run compile

# Step 4: Copy the built React app to the extension directory
echo "Step 4: Copying built React app to extension directory..."
cp -r ../build/* out/

# Step 5: Package the extension (optional)
echo "Step 5: Creating VSIX package..."
if command -v vsce &> /dev/null; then
    npm run package
    echo "Extension package created successfully!"
else
    echo "vsce not found. Install it with: npm install -g @vscode/vsce"
    echo "Skipping packaging step."
fi

echo ""
echo "Build complete!"
echo "To install the extension in VSCode:"
echo "1. Open VSCode"
echo "2. Go to Extensions view (Ctrl+Shift+X)"
echo "3. Click '...' menu and select 'Install from VSIX...'"
echo "4. Select the .vsix file from vscode-extension directory"


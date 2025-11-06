# VSCode Extension Guide

This document explains how to build and use the Graphviz Visual Editor as a VSCode extension.

## Quick Start

### Building the Extension

```bash
# Make the build script executable (first time only)
chmod +x build-vscode-extension.sh

# Run the build script
./build-vscode-extension.sh
```

### Installing in VSCode

1. Open VSCode
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac) to open Extensions view
3. Click the "..." menu at the top right
4. Select "Install from VSIX..."
5. Navigate to `vscode-extension/` and select the `.vsix` file
6. Restart VSCode if prompted

### Using the Extension

1. Open any `.dot` or `.gv` file in VSCode
2. When prompted, choose "Graphviz Visual Editor" as the editor
3. Or right-click the file → "Open With..." → "Graphviz Visual Editor"

The editor will open in a split view where you can:
- Edit the graph visually on one side
- See the DOT code on the other side
- Changes sync automatically between both views

## Project Structure

```
graphviz-visual-editor/
├── src/                          # React web app source
│   ├── vscode/                   # VSCode-specific code
│   │   ├── vscodeAdapter.js      # Adapter for VSCode integration
│   │   └── index.js              # VSCode entry point
│   └── ...                       # Other React components
├── vscode-extension/             # VSCode extension
│   ├── src/
│   │   ├── extension.ts          # Extension entry point
│   │   └── graphvizEditorProvider.ts  # Custom editor provider
│   ├── package.json              # Extension manifest
│   └── tsconfig.json             # TypeScript config
├── build/                        # Built React app (created by npm run build)
└── build-vscode-extension.sh     # Build script
```

## How It Works

### Architecture

The VSCode extension is built on top of the existing web application:

1. **Web App Layer**: The React-based Graphviz Visual Editor runs in a webview
2. **Adapter Layer**: `vscodeAdapter.js` bridges the web app and VSCode APIs
3. **Extension Layer**: TypeScript code manages the VSCode integration

### Key Components

#### VSCode Adapter (`src/vscode/vscodeAdapter.js`)

- Intercepts `localStorage` calls and routes them to VSCode state
- Handles message passing between webview and extension
- Provides configuration sync with VSCode settings

#### Custom Editor Provider (`vscode-extension/src/graphvizEditorProvider.ts`)

- Registers as handler for `.dot` and `.gv` files
- Creates and manages webview instances
- Syncs document changes between VSCode and webview
- Handles configuration updates

#### Extension Entry Point (`vscode-extension/src/extension.ts`)

- Activates the extension
- Registers commands (zoom, export, etc.)
- Sets up the custom editor provider

### Message Flow

```
VSCode Document ←→ Extension ←→ Webview ←→ React App
                     ↕
              VSCode Settings
```

- **Document → Webview**: Text changes in VSCode sync to graph
- **Webview → Document**: Visual edits update the DOT source
- **Settings → Webview**: Configuration changes update the editor
- **Webview → Settings**: User preferences saved to VSCode config

## Configuration

The extension uses VSCode's settings system. Configure via:

**File → Preferences → Settings** → Search for "Graphviz"

Available settings:
- Layout engine (dot, neato, fdp, etc.)
- Auto-fit graph to viewport
- Transition animation settings
- Editor font size and tab size

Settings are stored in VSCode's configuration and persist across sessions.

## Development

### Prerequisites

- Node.js 18+
- npm
- VSCode

### Setup for Development

```bash
# Install web app dependencies
npm install
make

# Install extension dependencies
cd vscode-extension
npm install
```

### Running in Development

1. Open the project root in VSCode
2. Open `vscode-extension/src/extension.ts`
3. Press `F5` to launch Extension Development Host
4. In the new window, open a `.dot` file to test

### Debugging

**Extension Code:**
- Set breakpoints in TypeScript files
- Use VSCode's debugger (F5 starts debug session)

**Webview Code:**
- In Extension Development Host: `Ctrl+Shift+P` → "Developer: Open Webview Developer Tools"
- Use browser DevTools to debug React code

### Making Changes

**To modify the web app:**
1. Edit files in `src/`
2. Rebuild: `npm run build`
3. Reload Extension Development Host

**To modify extension code:**
1. Edit files in `vscode-extension/src/`
2. Recompile: `cd vscode-extension && npm run compile`
3. Reload Extension Development Host

## Packaging for Distribution

### Create VSIX Package

```bash
cd vscode-extension
npm run package
```

This creates a `.vsix` file that can be:
- Installed locally (via "Install from VSIX...")
- Shared with others
- Published to VSCode Marketplace

### Publishing to VSCode Marketplace

1. Create a publisher account at https://marketplace.visualstudio.com/
2. Generate a Personal Access Token (PAT)
3. Login: `vsce login <publisher-name>`
4. Publish: `vsce publish`

See [VSCode Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) for details.

## Troubleshooting

### Extension not loading

- Check VSCode's Output panel (View → Output) and select "Extension Host"
- Look for error messages during activation

### Webview shows blank page

- Open Webview Developer Tools to check console errors
- Verify that `build/` directory exists and contains the React app
- Check that paths in `graphvizEditorProvider.ts` are correct

### Changes not syncing

- Verify the adapter is initialized: Check webview console for "Graphviz Visual Editor initialized"
- Check message passing: Add logging in `vscodeAdapter.js`

### Build fails

- Ensure Node.js and npm are up to date
- Clear caches: `rm -rf node_modules build && npm install && npm run build`
- Check for TypeScript errors: `cd vscode-extension && npm run compile`

## Differences from Web Version

| Feature | Web App | VSCode Extension |
|---------|---------|------------------|
| Storage | localStorage | VSCode state |
| Multiple Projects | Browser storage | File system |
| Export as URL | ✅ Yes | ❌ No |
| Export as SVG | ✅ Yes | ✅ Yes (planned) |
| Settings | localStorage | VSCode settings |
| File Operations | Browser download | Native file system |

## Future Enhancements

Potential improvements for the VSCode extension:

- [ ] Export as SVG command implementation
- [ ] Multi-document support
- [ ] Graph outline/minimap view
- [ ] Syntax highlighting in text editor
- [ ] DOT language server integration
- [ ] Snippets for common graph patterns
- [ ] Command palette integration
- [ ] Keybinding customization

## Resources

- [VSCode Extension API](https://code.visualstudio.com/api)
- [Custom Editor API](https://code.visualstudio.com/api/extension-guides/custom-editors)
- [Webview API](https://code.visualstudio.com/api/extension-guides/webview)
- [Graphviz Documentation](https://graphviz.org/documentation/)

## Support

For issues and feature requests:
- Web app: https://github.com/magjac/graphviz-visual-editor/issues
- VSCode extension: Create issues in the same repository with `[vscode]` prefix


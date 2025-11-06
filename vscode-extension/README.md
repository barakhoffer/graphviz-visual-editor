# Graphviz Visual Editor - VSCode Extension

A VSCode extension for interactive visual editing of [Graphviz](http://www.graphviz.org) graphs described in the [DOT](https://www.graphviz.org/doc/info/lang.html) language.

## Features

* **Visual Graph Rendering**: Renders graphs from DOT language files (.dot, .gv)
* **Interactive Editing**: 
  * Insert nodes by clicking or drag-and-drop
  * Draw edges between nodes
  * Select nodes and edges
  * Delete selected components
  * Cut/Copy-and-paste nodes
* **Text Editor Integration**: Sync between visual editor and text editor
* **Pan and Zoom**: Navigate large graphs easily
* **Animated Transitions**: Smooth animations when the graph changes
* **Multiple Layout Engines**: Support for dot, neato, fdp, sfdp, twopi, circo, osage, and patchwork
* **Customization**: Configure node styles, colors, and fill colors

## Installation

### From VSIX (Recommended)

1. Build the extension (see Building section below)
2. In VSCode, go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
3. Click the "..." menu and select "Install from VSIX..."
4. Select the generated .vsix file

### From Source

1. Clone the repository
2. Run the build script (see Building section)
3. Press F5 in VSCode to launch Extension Development Host

## Usage

1. Open any `.dot` or `.gv` file in VSCode
2. Click "Open With..." and select "Graphviz Visual Editor"
3. Or right-click the file and choose "Open With..." → "Graphviz Visual Editor"
4. The visual editor will open alongside your text editor

### Keyboard Shortcuts

When focused on the graph:

* `Delete` - Delete selected components
* `Ctrl+C` - Copy selected node attributes
* `Ctrl+V` - Paste/insert node with copied attributes
* `Ctrl+X` - Cut selected node
* `Ctrl+A` - Select all nodes
* `Ctrl+Shift+A` - Select all edges
* `Ctrl+Z` - Undo
* `Ctrl+Y` - Redo
* `Escape` - Cancel drawing/deselect all
* `F` - Toggle fullscreen
* `?` - Show help

### Mouse Operations

* **Left Click** - Select node or edge
* **Ctrl+Left Click** - Multi-select
* **Left Drag** - Area select
* **Right Click on Node** - Start drawing edge
* **Double Click on Node** - Complete edge drawing
* **Middle Click** - Insert node at position
* **Shift+Middle Click** - Insert node with last used shape
* **Mouse Wheel** - Zoom in/out

## Configuration

Access settings via File → Preferences → Settings, then search for "Graphviz":

* `graphviz.engine` - Layout engine (default: "dot")
* `graphviz.fitGraph` - Auto-fit graph to viewport (default: false)
* `graphviz.transitionDuration` - Animation duration in seconds (default: 1)
* `graphviz.tweenPaths` - Animate path transitions (default: true)
* `graphviz.tweenShapes` - Animate shape transitions (default: true)
* `graphviz.tweenPrecision` - Tween precision (default: "1%")
* `graphviz.fontSize` - Text editor font size (default: 12)
* `graphviz.tabSize` - Text editor tab size (default: 4)

## Building

### Prerequisites

* Node.js (v18 or later)
* npm

### Build Steps

```bash
# From the project root directory
./build-vscode-extension.sh
```

This will:
1. Build the React web app
2. Install extension dependencies
3. Compile TypeScript
4. Create a .vsix package

### Manual Build

```bash
# Build the web app
npm install
make
npm run build

# Build the extension
cd vscode-extension
npm install
npm run compile
npm run package  # Requires vsce: npm install -g @vscode/vsce
```

## Development

### Running in Development Mode

1. Open the project root in VSCode
2. Open the vscode-extension folder
3. Press F5 to launch Extension Development Host
4. Open a .dot file to test

### Debugging

* Extension code: Use VSCode's built-in debugger (F5)
* Webview code: In the Extension Development Host, run "Developer: Open Webview Developer Tools"

## Architecture

The extension consists of two main parts:

1. **Extension Host** (`src/extension.ts`, `src/graphvizEditorProvider.ts`)
   - Handles VSCode integration
   - Manages custom editor lifecycle
   - Communicates with webview via message passing

2. **Webview** (React app with VSCode adapter)
   - Embeds the existing Graphviz Visual Editor web app
   - Adapts localStorage to VSCode state management
   - Syncs changes between visual editor and VSCode document

## Known Limitations

* Some features from the web version (like browser storage for multiple projects) are adapted for the VSCode environment
* Export as URL feature is not available in VSCode context
* The extension works best with single document instances

## Contributing

Contributions are welcome! Please see the main repository for contribution guidelines.

## License

MIT License - see LICENSE file for details

## Credits

Based on the [Graphviz Visual Editor](https://github.com/magjac/graphviz-visual-editor) web application by Magnus Jacobsson.


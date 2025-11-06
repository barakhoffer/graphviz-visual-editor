# Change Log

All notable changes to the "graphviz-visual-editor" extension will be documented in this file.

## [1.3.0] - 2024

### Added
- Initial release of VSCode extension
- Custom editor for .dot and .gv files
- Visual graph editing with interactive canvas
- Sync between visual editor and text editor
- Pan and zoom functionality
- Node insertion by click and drag-and-drop
- Edge drawing between nodes
- Component selection and deletion
- Copy/cut/paste operations for nodes
- Multiple Graphviz layout engines (dot, neato, fdp, sfdp, twopi, circo, osage, patchwork)
- Animated transitions for graph changes
- Configurable settings via VSCode preferences:
  - Layout engine selection
  - Auto-fit graph option
  - Transition duration and tweening options
  - Editor font size and tab size
- Keyboard shortcuts for common operations
- Fullscreen mode
- Node and edge formatting options

### Technical
- Based on Graphviz Visual Editor web application v1.3.0
- React-based webview implementation
- VSCode state management integration
- Message passing for document synchronization
- Configuration sync with VSCode settings

## [Unreleased]

### Planned
- Export as SVG command
- Enhanced error reporting
- Syntax highlighting for DOT language
- Snippets for common graph patterns
- Multi-document support improvements
- Graph outline/minimap view
- DOT language server integration
- Command palette integration


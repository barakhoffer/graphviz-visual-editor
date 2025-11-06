import { createRoot } from 'react-dom/client';
import Index from './pages/index.js';
import vscodeAdapter from './vscode/vscodeAdapter.js';

// Check if running in VSCode webview
const root = createRoot(document.querySelector('#root'));

if (window.vscode) {
  // VSCode mode - use adapter
  vscodeAdapter.log('Graphviz Visual Editor initializing in VSCode');
  
  // Set initial DOT source from VSCode if available
  if (window.initialDotSrc) {
    localStorage.setItem('dotSrc', window.initialDotSrc);
    localStorage.setItem('dotSrcLastChangeTime', Date.now().toString());
  }
  
  root.render(<Index tab="home" vscodeAdapter={vscodeAdapter} />);
} else {
  // Regular web mode - adapter won't do anything
  root.render(<Index tab="home" />);
}

import { createRoot } from 'react-dom/client';
import Index from './pages/index.js';

// Check if running in VSCode webview
let vscodeAdapter = null;
if (window.vscode) {
  // Dynamically import VSCode adapter when in VSCode
  import('./vscode/vscodeAdapter.js').then((module) => {
    vscodeAdapter = module.default;
    vscodeAdapter.log('Graphviz Visual Editor initializing in VSCode');
    
    // Set initial DOT source from VSCode if available
    if (window.initialDotSrc) {
      localStorage.setItem('dotSrc', window.initialDotSrc);
      localStorage.setItem('dotSrcLastChangeTime', Date.now().toString());
    }
    
    // Render with VSCode adapter
    const root = createRoot(document.querySelector('#root'));
    root.render(<Index tab="home" vscodeAdapter={vscodeAdapter} />);
  });
} else {
  // Regular web mode
  const root = createRoot(document.querySelector('#root'));
  root.render(<Index tab="home" />);
}

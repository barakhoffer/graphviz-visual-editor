/**
 * VSCode Webview Adapter
 * Replaces localStorage with VSCode state management and adds message passing
 */

class VSCodeAdapter {
  constructor() {
    this.vscode = window.vscode;
    this.state = this.vscode ? this.vscode.getState() || {} : {};
    this.config = {};
    this.listeners = [];
    this.configListeners = [];
    
    // Listen for messages from VSCode
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        const message = event.data;
        if (message.type === 'vscode-update') {
          this.notifyListeners('textUpdate', message.text);
        } else if (message.type === 'vscode-config') {
          this.config = message.config;
          this.notifyConfigListeners(message.config);
        }
      });
    }
  }

  isVSCode() {
    return !!this.vscode;
  }

  getItem(key) {
    if (this.isVSCode()) {
      return this.state[key] || null;
    }
    return localStorage.getItem(key);
  }

  setItem(key, value) {
    if (this.isVSCode()) {
      this.state[key] = value;
      this.vscode.setState(this.state);
    } else {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key) {
    if (this.isVSCode()) {
      delete this.state[key];
      this.vscode.setState(this.state);
    } else {
      localStorage.removeItem(key);
    }
  }

  postMessage(message) {
    if (this.isVSCode()) {
      this.vscode.postMessage(message);
    }
  }

  // Send text changes to VSCode
  updateDocument(text) {
    if (this.isVSCode()) {
      this.vscode.postMessage({
        type: 'edit',
        content: text
      });
    }
  }

  // Get configuration from VSCode
  getConfig(key, defaultValue) {
    if (this.isVSCode()) {
      return this.config[key] !== undefined ? this.config[key] : defaultValue;
    }
    return defaultValue;
  }

  // Save configuration to VSCode
  saveConfig(configObj) {
    if (this.isVSCode()) {
      this.vscode.postMessage({
        type: 'saveConfig',
        config: configObj
      });
    }
  }

  // Get initial DOT source
  getInitialDotSrc() {
    return window.initialDotSrc || '';
  }

  // Add listener for document updates from VSCode
  onTextUpdate(callback) {
    this.addListener('textUpdate', callback);
  }

  // Add listener for config updates from VSCode
  onConfigUpdate(callback) {
    this.configListeners.push(callback);
  }

  addListener(event, callback) {
    this.listeners.push({ event, callback });
  }

  notifyListeners(event, data) {
    this.listeners
      .filter(l => l.event === event)
      .forEach(l => l.callback(data));
  }

  notifyConfigListeners(config) {
    this.configListeners.forEach(l => l(config));
  }

  // Log to VSCode console
  log(message) {
    if (this.isVSCode()) {
      this.vscode.postMessage({
        type: 'log',
        message: message
      });
    } else {
      console.log(message);
    }
  }
}

// Create singleton instance
const vscodeAdapter = new VSCodeAdapter();

// Replace localStorage methods globally if in VSCode
if (vscodeAdapter.isVSCode()) {
  const originalLocalStorage = {
    getItem: localStorage.getItem.bind(localStorage),
    setItem: localStorage.setItem.bind(localStorage),
    removeItem: localStorage.removeItem.bind(localStorage),
  };

  // Override localStorage methods to use VSCode state
  localStorage.getItem = function(key) {
    return vscodeAdapter.getItem(key);
  };

  localStorage.setItem = function(key, value) {
    vscodeAdapter.setItem(key, value);
  };

  localStorage.removeItem = function(key) {
    vscodeAdapter.removeItem(key);
  };
}

export default vscodeAdapter;


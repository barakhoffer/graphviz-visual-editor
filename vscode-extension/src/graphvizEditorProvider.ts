import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Provider for Graphviz visual editor.
 */
export class GraphvizEditorProvider implements vscode.CustomTextEditorProvider {
    public static readonly viewType = 'graphviz.visualEditor';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    /**
     * Called when a custom editor is opened.
     */
    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(this.context.extensionPath, 'media')),
                vscode.Uri.file(path.join(this.context.extensionPath, '..')),
            ]
        };

        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document);

        // Hook up event handlers
        function updateWebview() {
            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
            });
        }

        // Receive message from the webview
        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type) {
                case 'edit':
                    this.updateTextDocument(document, e.content);
                    return;
                case 'getConfig':
                    const config = vscode.workspace.getConfiguration('graphviz');
                    webviewPanel.webview.postMessage({
                        type: 'config',
                        config: {
                            engine: config.get('engine', 'dot'),
                            fitGraph: config.get('fitGraph', false),
                            transitionDuration: config.get('transitionDuration', 1),
                            tweenPaths: config.get('tweenPaths', true),
                            tweenShapes: config.get('tweenShapes', true),
                            tweenPrecision: config.get('tweenPrecision', '1%'),
                            fontSize: config.get('fontSize', 12),
                            tabSize: config.get('tabSize', 4),
                        }
                    });
                    return;
                case 'saveConfig':
                    const configuration = vscode.workspace.getConfiguration('graphviz');
                    Object.keys(e.config).forEach(key => {
                        configuration.update(key, e.config[key], vscode.ConfigurationTarget.Global);
                    });
                    return;
                case 'log':
                    console.log('Webview:', e.message);
                    return;
            }
        });

        // Handle document changes
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebview();
            }
        });

        // Make sure we get rid of the listener when our editor is closed
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        // Send initial update
        updateWebview();

        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('graphviz')) {
                const config = vscode.workspace.getConfiguration('graphviz');
                webviewPanel.webview.postMessage({
                    type: 'config',
                    config: {
                        engine: config.get('engine', 'dot'),
                        fitGraph: config.get('fitGraph', false),
                        transitionDuration: config.get('transitionDuration', 1),
                        tweenPaths: config.get('tweenPaths', true),
                        tweenShapes: config.get('tweenShapes', true),
                        tweenPrecision: config.get('tweenPrecision', '1%'),
                        fontSize: config.get('fontSize', 12),
                        tabSize: config.get('tabSize', 4),
                    }
                });
            }
        });
    }

    /**
     * Get the static HTML used for the editor webviews.
     */
    private getHtmlForWebview(webview: vscode.Webview, document: vscode.TextDocument): string {
        // Get path to the built React app
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'static', 'js', 'main.js'))
        );
        
        const cssUri = webview.asWebviewUri(
            vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'static', 'css', 'main.css'))
        );

        const graphvizWasmUri = webview.asWebviewUri(
            vscode.Uri.file(path.join(this.context.extensionPath, 'out', '@hpcc-js', 'wasm', 'dist', 'graphviz.umd.js'))
        );

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' ${webview.cspSource}; img-src ${webview.cspSource} data:; font-src ${webview.cspSource}; connect-src ${webview.cspSource};">
    <title>Graphviz Visual Editor</title>
    <link rel="stylesheet" type="text/css" href="${cssUri}">
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        #root {
            width: 100vw;
            height: 100vh;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}">
        // Initialize VSCode API
        const vscode = acquireVsCodeApi();
        
        // Store the initial state
        window.initialDotSrc = ${JSON.stringify(document.getText())};
        
        // Make vscode available globally for the React app
        window.vscode = vscode;
        
        // Handle messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'update':
                    // Notify React app of document changes
                    window.postMessage({
                        type: 'vscode-update',
                        text: message.text
                    }, '*');
                    break;
                case 'config':
                    // Notify React app of config changes
                    window.postMessage({
                        type: 'vscode-config',
                        config: message.config
                    }, '*');
                    break;
            }
        });
        
        // Request initial configuration
        vscode.postMessage({ type: 'getConfig' });
    </script>
    <script nonce="${nonce}" src="${graphvizWasmUri}"></script>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
    }

    /**
     * Update the text document with new content.
     */
    private updateTextDocument(document: vscode.TextDocument, content: string) {
        const edit = new vscode.WorkspaceEdit();

        // Replace the entire document
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            content
        );

        return vscode.workspace.applyEdit(edit);
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


import * as vscode from 'vscode';
import { GraphvizEditorProvider } from './graphvizEditorProvider';

export function activate(context: vscode.ExtensionContext) {
    // Register the custom editor provider
    const provider = new GraphvizEditorProvider(context);
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(
            GraphvizEditorProvider.viewType,
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
                supportsMultipleEditorsPerDocument: false,
            }
        )
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('graphviz.visualEditor.exportAsSvg', () => {
            vscode.window.showInformationMessage('Export as SVG feature coming soon!');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('graphviz.visualEditor.zoomIn', () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                vscode.commands.executeCommand('workbench.action.webview.postMessage', {
                    command: 'zoomIn'
                });
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('graphviz.visualEditor.zoomOut', () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                vscode.commands.executeCommand('workbench.action.webview.postMessage', {
                    command: 'zoomOut'
                });
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('graphviz.visualEditor.zoomReset', () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                vscode.commands.executeCommand('workbench.action.webview.postMessage', {
                    command: 'zoomReset'
                });
            }
        })
    );
}

export function deactivate() {}


import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
	// Register the WebviewViewProvider for the activity bar view
	const provider = new SpinTheWheelViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('spinTheWheelViewer', provider)
	);
}

class SpinTheWheelViewProvider implements vscode.WebviewViewProvider {
	constructor(private readonly extensionUri: vscode.Uri) { }

	async resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [this.extensionUri]
		};


		// Load the HTML content
		const htmlUri = vscode.Uri.joinPath(this.extensionUri, 'src', 'spinTheWheelView.html');
		const htmlBytes = await vscode.workspace.fs.readFile(htmlUri);
		let htmlContent = Buffer.from(htmlBytes).toString('utf8');

		// Get URIs for external assets
		const styleUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'src', 'style.css'));
		const scriptUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'src', 'script.js'));

		const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webviewView.webview.cspSource} 'unsafe-inline'; script-src ${webviewView.webview.cspSource}; worker-src ${webviewView.webview.cspSource} blob:;">`;
		htmlContent = htmlContent.replace('<head>', `<head>\n\t\t${csp}`);

		// Replace placeholders
		htmlContent = htmlContent.replace('{{styleUri}}', styleUri.toString());
		htmlContent = htmlContent.replace('{{scriptUri}}', scriptUri.toString());

		webviewView.webview.html = htmlContent;

		// Handle messages from the webview (e.g. spin result)
		webviewView.webview.onDidReceiveMessage(async (message: any) => {
			if (message.command === 'spinResult') {
				const result = message.result;
				if (!result) {
					vscode.window.showInformationMessage('Wheel returned no result.');
					return;
				}

				// When possible insert `result` in the copilot ai chat
			}
		});
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }

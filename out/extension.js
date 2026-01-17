"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Register the WebviewViewProvider for the activity bar view
    const provider = new SpinTheWheelViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('spinTheWheelViewer', provider));
}
class SpinTheWheelViewProvider {
    extensionUri;
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
    }
    async resolveWebviewView(webviewView, context, _token) {
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
    }
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map
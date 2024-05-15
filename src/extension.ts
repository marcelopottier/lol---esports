import * as vscode from 'vscode';
import axios from 'axios';


export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.showPanel', async () => {
        const panel = vscode.window.createWebviewPanel(
            'myPanel', // Identificador interno do painel
            'My Panel', // Título do painel
            vscode.ViewColumn.Two, // Onde o painel deve ser mostrado (ajustável conforme necessário)
            {
                // Permissões para o conteúdo do webview
                enableScripts: true
            }
        );

		const response = await axios.get('https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=pt-BR', {
			headers: {
				"x-api-key": process.env.API_KEY
			}
		});
		const data = response.data

        panel.webview.html = getWebviewContent(data);
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(data: any) {
	const dataString = JSON.stringify(data);
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>My Panel</title>
	</head>
	<body>
		<h1>Data from API</h1>
		<div id="data-container"></div>

		<script>
			(function() {
				const data = ${dataString};
				const container = document.getElementById('data-container');
				container.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
			})();
		</script>
	</body>
	</html>`;
}

export function deactivate() {}

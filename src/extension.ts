import * as vscode from 'vscode';
import * as child_process from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	myStatusBarItem.command = 'extension.runQuery';

	const rootpath = vscode.workspace.workspaceFolders?.at(0)?.uri.fsPath;
	let createDB = vscode.commands.registerCommand('extension.createCodeQLDB', async () => {
//codeql database create D:\\vulnerableRepo\\qldb --language=csharp --source-root D:\\vulnerableRepo --overwrite
		if (true) {
			myStatusBarItem.text = '$(loading~spin) Creating CodeQl Database';
		myStatusBarItem.show();
			const createDatabaseCommand = `codeql database create ${rootpath}\\qldb --language=csharp --source-root ${rootpath} --overwrite`;

			child_process.exec(createDatabaseCommand, (error, stdout, stderr) => {
				if (error) {
					myStatusBarItem.dispose();
					vscode.window.showErrorMessage(`Error: ${error.message}`);
					return;
				}
				myStatusBarItem.dispose();
				vscode.window.showInformationMessage('CodeQL database created successfully.');
			});
		}
	});
	let runQuery = vscode.commands.registerCommand('extension.runQuery', async () => {
		myStatusBarItem.text = '$(loading~spin) Running CodeQl queries';
		myStatusBarItem.show();
		if (true) {
			vscode.window.showInformationMessage("Running CodeQL Query");
			child_process.exec(`codeql database analyze  ${rootpath}\\qldb codeql/csharp-queries:DeadCode --format=sarif-latest --output=${rootpath}\\results.sarif`, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Error: ${error.message}`);
					myStatusBarItem.dispose();
					return;
				}
				myStatusBarItem.dispose();
				vscode.window.showInformationMessage('CodeQL query run successfully.');
				sarifViewer();
			});
		}
	});

	context.subscriptions.push(createDB);
	context.subscriptions.push(runQuery);

}
async function sarifViewer() {
	const rootpath = vscode.workspace.workspaceFolders?.at(0)?.uri.fsPath;
	const sarifExt = vscode.extensions.getExtension('MS-SarifVSCode.sarif-viewer');

	if (sarifExt === undefined) { throw new Error('Sarif extension not found'); }

	else
		if (!sarifExt.isActive) { await sarifExt.activate(); }

	await sarifExt.exports.openLogs([
		vscode.Uri.file(`${rootpath}\\results.sarif`),
	]);

}

export function deactivate() { }

import * as vscode from 'vscode';
import * as child_process from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	const rootpath = vscode.workspace.workspaceFolders?[0].uri.path
	let createDB = vscode.commands.registerCommand('extension.createCodeQLDB', async () => {
		
		if (true) {		  		  		  
		  const createDatabaseCommand = `codeql database create C:\\Users\\amritsahu\\source\\repos\\codeqltestingapp\\qldb --language=csharp --source-root C:\\Users\\amritsahu\\source\\repos\\codeqltestingapp\\codeqltestingapp --overwrite`;
			  
		  child_process.exec(createDatabaseCommand, (error, stdout, stderr) => {
			if (error) {
			  vscode.window.showErrorMessage(`Error: ${error.message}`);
			  return;
			}
			if (stderr) {
			  vscode.window.showErrorMessage(stderr);
			}
			vscode.window.showInformationMessage('CodeQL database created successfully.');
		  });
		}
	  });
	  let runQuery = vscode.commands.registerCommand('extension.runQuery', async () => {					
	
		if (true) {
			vscode.window.showInformationMessage("Running CodeQL Query");
		  	child_process.exec(`codeql database analyze  C:\\Users\\amritsahu\\source\\repos\\codeqltestingapp\\qldb codeql/csharp-queries:DeadCode --format=sarif-latest --output=C:\\Users\\amritsahu\\source\\repos\\codeqltestingapp\\results.sarif`, (error, stdout, stderr) => {
			if (error) {
			  vscode.window.showErrorMessage(`Error: ${error.message}`);
			  return;
			}
			if (stderr) {
			  vscode.window.showErrorMessage(stderr);
			}
			vscode.window.showInformationMessage(stdout);
			sarif();
		  });
		}
	  });
	
	  context.subscriptions.push(createDB);
	  context.subscriptions.push(runQuery);
	
	}
	async function sarif() {

		const sarifExt = vscode.extensions.getExtension('MS-SarifVSCode.sarif-viewer');
	
		if(sarifExt === undefined) {throw new Error('Sarif extension not found');}
	
		else
	
		if (!sarifExt.isActive) {await sarifExt.activate();}
	
		await sarifExt.exports.openLogs([
	
			vscode.Uri.file(`C:\\Users\\amritsahu\\source\\repos\\codeqltestingapp\\results.sarif`),
	
		]);
	
	}

export function deactivate() {}

'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { TestRunner } from './runners/interface';

import Jest from './runners/jest';
import Rspec from './runners/rspec';

const activeRunners: TestRunner[] = [new Jest(), new Rspec()];

export function activate(context: vscode.ExtensionContext) {
  let terminal: vscode.Terminal | undefined;

  const getTerminal = (): { terminal: vscode.Terminal; isNew: Boolean } => {
    if (terminal) {
      return { isNew: false, terminal };
    } else {
      terminal = vscode.window.createTerminal('vsCodeTestRunner terminal');

      return { isNew: true, terminal };
    }
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'vsCodeTestRunner.runTestFile',
    () => {
      if (vscode.window.activeTextEditor === undefined) {
        return;
      } else {
        const extension = path.extname(
          vscode.window.activeTextEditor.document.fileName
        );
        const runners = activeRunners
          .filter(runner => runner.eligibleExtensions.indexOf(extension) > -1)
          .filter(runner => runner.isEligible(vscode.window.activeTextEditor!));

        // TODO: need to figure what happens if we do have multiple
        const firstRunner: TestRunner | undefined = runners[0];
        if (firstRunner) {
          const t = getTerminal();
          if (t.isNew === false) t.terminal.sendText('clear');
          const command = firstRunner.commandForFile(
            vscode.window.activeTextEditor
          );

          t.terminal.sendText(command);
          t.terminal.show(true);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

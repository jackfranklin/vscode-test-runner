'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { TestRunner, TestRun } from './runners/interface';

import Jest from './runners/jest';
import Rspec from './runners/rspec';
import Context from './context';

const activeRunners: TestRunner[] = [new Jest(), new Rspec()];

const runnerContext = new Context();

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

  const destroyTerminal = () => {
    if (terminal) {
      terminal.dispose();
      terminal = undefined;
    }
  };

  const hideTerminal = () => {
    if (terminal) {
      terminal.hide();
      terminal = undefined;
    }
  };

  const executeTestRun = (
    type: TestRun,
    runner: TestRunner,
    file: vscode.TextEditor,
    line?: number
  ): void => {
    const t = getTerminal();
    if (t.isNew === false) t.terminal.sendText('clear');
    const command = runner.commandForFile(type, file, line);

    t.terminal.sendText(command);
    t.terminal.show(true);
    runnerContext.update(file, line);
  };

  const startTestRun = (editor: vscode.TextEditor, type: TestRun): void => {
    const extension = path.extname(editor.document.fileName);
    const runners = activeRunners
      .filter(runner => runner.eligibleExtensions.indexOf(extension) > -1)
      .filter(runner => runner.isEligible(editor));

    // TODO: need to figure what happens if we do have multiple
    const firstRunner: TestRunner | undefined = runners[0];

    if (firstRunner) {
      const isTestFile = firstRunner.fileIsTestFile(editor);

      const currentLine = editor.selection.start.line;

      const fileToTest = isTestFile ? editor : runnerContext.lastTestFile;

      if (!fileToTest) {
        vscode.window.showInformationMessage(
          'Could not run test: file is not a test file and no previous test file found.'
        );
        return;
      }

      const lineToUse =
        type === 'LineNumber'
          ? isTestFile
            ? currentLine
            : runnerContext.lastTestLine
          : undefined;

      executeTestRun(type, firstRunner, fileToTest, lineToUse);
    }
  };

  let testWholeFile = vscode.commands.registerCommand(
    'vsCodeTestRunner.testWholeFile',
    () => {
      if (vscode.window.activeTextEditor === undefined) {
        return;
      } else {
        startTestRun(vscode.window.activeTextEditor, 'WholeFile');
      }
    }
  );

  context.subscriptions.push(testWholeFile);

  let testLineNumber = vscode.commands.registerCommand(
    'vsCodeTestRunner.testLineNumber',
    () => {
      if (vscode.window.activeTextEditor === undefined) {
        return;
      } else {
        startTestRun(vscode.window.activeTextEditor, 'LineNumber');
      }
    }
  );

  context.subscriptions.push(testLineNumber);

  let destroyTerminalCmd = vscode.commands.registerCommand(
    'vsCodeTestRunner.destroyTerminal',
    destroyTerminal
  );

  context.subscriptions.push(destroyTerminalCmd);

  let hideTerminalCmd = vscode.commands.registerCommand(
    'vsCodeTestRunner.hideTerminal',
    hideTerminal
  );

  context.subscriptions.push(hideTerminalCmd);
}

import * as vscode from 'vscode';

export default class Context {
  lastTestFile?: vscode.TextEditor;
  lastTestLine?: number;
  manualCommand?: string;

  constructor() {
    this.lastTestFile = undefined;
    this.lastTestLine = undefined;
    this.manualCommand = undefined;
  }

  update(file?: vscode.TextEditor, line?: number): void {
    this.lastTestFile = file;
    this.lastTestLine = line;
  }

  setManualCommand(command: string): void {
    this.manualCommand = command;
  }
}

import * as vscode from 'vscode';

export default class Context {
  lastTestFile?: vscode.TextEditor;
  lastTestLine?: number;

  constructor() {
    this.lastTestFile = undefined;
    this.lastTestLine = undefined;
  }

  update(file?: vscode.TextEditor, line?: number): void {
    this.lastTestFile = file;
    this.lastTestLine = line;
  }
}

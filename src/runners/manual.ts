import * as vscode from 'vscode';
import { TestRunner, TestRun } from './interface';

export default class Manual implements TestRunner {
  private manualCommand: string;

  eligibleExtensions = ['.*'];

  constructor(command: string) {
    this.manualCommand = command;
  }

  fileIsTestFile(file: vscode.TextEditor) {
    return true;
  }

  isEligible(file: vscode.TextEditor) {
    return true;
  }

  nameForHumans() {
    return 'Manual command';
  }

  commandForFile(
    type: TestRun,
    file: vscode.TextEditor,
    line?: number
  ): string {
    return this.manualCommand;
  }
}

import * as vscode from 'vscode';
import { TestRunner, TestRun } from './interface';

export default class Manual implements TestRunner {
  private manualCommand: string;
  private oneOff: boolean;

  eligibleExtensions = ['.*'];

  constructor(command: string, oneOff: boolean = false) {
    this.manualCommand = command;
    this.oneOff = oneOff;
  }

  fileIsTestFile(file: vscode.TextEditor) {
    return true;
  }

  isEligible(file: vscode.TextEditor) {
    return true;
  }

  nameForHumans() {
    return this.oneOff? 'One-off command' : 'Manual command';
  }

  commandForFile(
    type: TestRun,
    file: vscode.TextEditor,
    line?: number
  ): string {
    return this.manualCommand;
  }
}

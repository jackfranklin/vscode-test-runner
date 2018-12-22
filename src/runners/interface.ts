import * as vscode from 'vscode';
export interface TestRunner {
  eligibleExtensions: String[];

  isEligible(file: vscode.TextEditor): Boolean;
  nameForHumans(): String;

  commandForFile(file: vscode.TextEditor): string;
}

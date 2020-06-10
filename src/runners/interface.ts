import * as vscode from 'vscode';

export type TestRun = 'WholeFile' | 'EntireSuite' | 'LineNumber' | 'ManualCommand';

export interface TestRunner {
  eligibleExtensions: String[];

  isEligible(file: vscode.TextEditor): boolean;
  fileIsTestFile(file: vscode.TextEditor): boolean;
  nameForHumans(): String;

  commandForFile(type: TestRun, file: vscode.TextEditor, line?: number): string;
}

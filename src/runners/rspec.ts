import * as vscode from 'vscode';
import { TestRunner, TestRun } from './interface';
import { getFilePathFromWorkspace } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

export default class Rspec implements TestRunner {
  eligibleExtensions = ['.rb'];

  fileIsTestFile(file: vscode.TextEditor) {
    const filePath = file.document.fileName;
    const base = path.basename(filePath);

    return base.includes('_spec');
  }

  isEligible(file: vscode.TextEditor) {
    const gemFile = getFilePathFromWorkspace('Gemfile');
    if (!gemFile) return false;

    const contentsOfGemFile = fs.readFileSync(gemFile);

    return (
      contentsOfGemFile.includes("gem 'rspec-rails'") ||
      contentsOfGemFile.includes("gem 'rspec'")
    );
  }

  nameForHumans() {
    return 'RSpec';
  }

  commandForFile(
    type: TestRun,
    file: vscode.TextEditor,
    line?: number
  ): string {
    // TODO: figure out if we need bundle exec or not?
    const suffix =
      line !== undefined && type === 'LineNumber' ? `:${line}` : '';
    const fileName = type === 'EntireSuite' ? '' : file.document.fileName;
    return 'rspec' + ' ' + fileName + suffix;
  }
}

import * as vscode from 'vscode';
import { TestRunner } from './interface';
import { getFilePathFromWorkspace } from '../utils';
import * as fs from 'fs';

export default class Rspec implements TestRunner {
  eligibleExtensions = ['.rb'];

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

  commandForFile(file: vscode.TextEditor): string {
    // TODO: figure out if we need bundle exec or not?
    return 'rspec' + ' ' + file.document.fileName;
  }
}

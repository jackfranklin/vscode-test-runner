import * as vscode from 'vscode';
import { TestRunner, TestRun } from './interface';
import { getFilePathFromWorkspace } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

class Jest implements TestRunner {
  eligibleExtensions = ['.js', '.jsx'];

  supportedRunTypes: TestRun[] = ['WholeFile', 'EntireSuite'];

  fileIsTestFile(file: vscode.TextEditor) {
    const filePath = file.document.fileName;
    console.log('got file path', filePath);

    const base = path.basename(filePath);
    const dir = path.dirname(filePath);

    return (
      dir.includes('__test__') ||
      base.includes('.test.js') ||
      base.includes('.spec.js')
    );
  }

  isEligible(file: vscode.TextEditor) {
    const packageJson = getFilePathFromWorkspace('package.json');
    if (!packageJson) return false;

    const json = require(packageJson);

    // assume that if they have Jest in their dependencies, that's what we should use
    const potentialDeps = [
      ...Object.keys(json.dependencies),
      ...Object.keys(json.devDependencies),
    ];

    return potentialDeps.indexOf('jest') > -1;
  }

  nameForHumans() {
    return 'Jest';
  }

  commandForFile(
    type: TestRun,
    file: vscode.TextEditor,
    // line is unused as Jest doesn't let you pass a line number
    line?: number
  ): string {
    const potentialLockFile = getFilePathFromWorkspace('yarn.lock');

    const isUsingYarn = potentialLockFile && fs.existsSync(potentialLockFile);

    const commandPrefix = (isUsingYarn ? 'yarn' : 'npx') + ' jest';

    // for whole suite, we just run jest without any arguments
    const fileName = type === 'EntireSuite' ? '' : file.document.fileName;

    return commandPrefix + ' ' + fileName;
  }
}

export default Jest;

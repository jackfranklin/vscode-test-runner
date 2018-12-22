import * as vscode from 'vscode';
import { TestRunner } from './interface';
import { getFilePathFromWorkspace } from '../utils';
import * as fs from 'fs';

class Jest implements TestRunner {
  eligibleExtensions = ['.js', '.jsx'];

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

  commandForFile(file: vscode.TextEditor): string {
    const potentialLockFile = getFilePathFromWorkspace('yarn.lock');

    const isUsingYarn = potentialLockFile && fs.existsSync(potentialLockFile);

    const commandPrefix = (isUsingYarn ? 'yarn' : 'npx') + ' jest';

    return commandPrefix + ' ' + file.document.fileName;
  }
}

export default Jest;

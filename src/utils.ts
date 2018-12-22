import * as vscode from 'vscode';
import * as path from 'path';

export const getFilePathFromWorkspace = (filename: string) => {
  const root =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0];
  if (!root) return;

  return path.join(root.uri.fsPath, filename);
};

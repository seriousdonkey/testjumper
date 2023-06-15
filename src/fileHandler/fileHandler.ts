import * as vscode from "vscode";

export interface IFileHandler {
  findFile(doc: vscode.TextDocument): Promise<string | undefined>;
}

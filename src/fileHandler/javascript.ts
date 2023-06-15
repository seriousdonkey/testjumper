import * as vscode from "vscode";
import { IFileHandler } from "./fileHandler";
import { getFilename } from "../utils";

export class JavaScriptHandler implements IFileHandler {
  async findFile(doc: vscode.TextDocument): Promise<string | undefined> {
    const wsFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
    const fileName = getFilename(doc.fileName);
    const isTestFile = this.isTestFile(fileName);

    if (isTestFile) {
      const sameDirFound = await this.search(
        `${fileName.replace(".spec", "").replace(".test", "")}`
      );
      if (sameDirFound) {
        return sameDirFound;
      }

      const workspaceFound = await this.search(
        new vscode.RelativePattern(
          wsFolder!,
          `**/**/${fileName.replace(".spec", "").replace(".test", "")}`
        )
      );
      if (workspaceFound) {
        return workspaceFound;
      }
    } else {
      const sameDirFound = await this.search(
        `${fileName.replace(".js", "")}.{spec,test}.js`
      );
      if (sameDirFound) {
        return sameDirFound;
      }

      const workspaceFound = await this.search(
        new vscode.RelativePattern(
          wsFolder!,
          `**/**/${fileName.replace(".js", "")}.{spec,test}.js`
        )
      );
      if (workspaceFound) {
        return workspaceFound;
      }
    }

    throw new Error("No file found.");
  }

  private async search(
    pattern: string | vscode.GlobPattern
  ): Promise<string | undefined> {
    const searchResult = await vscode.workspace.findFiles(pattern);

    if (searchResult.length === 1) {
      return searchResult[0].path;
    }

    return undefined;
  }

  private isTestFile(filename: string): boolean {
    return filename.includes(".spec", 0) || filename.includes(".test", 0);
  }
}

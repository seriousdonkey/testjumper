import * as vscode from "vscode";
import { TextDocument } from "vscode";
import { IFileHandler } from "./fileHandler";
import { getFilename } from "../utils";

export class GoHandler implements IFileHandler {
  async findFile(doc: TextDocument): Promise<string | undefined> {
    const fileName = getFilename(doc.fileName);
    const isTestFile = this.isTestFile(fileName);

    if (isTestFile) {
      const filePath = await this.search(`${fileName.replace("_test", "")}`);
      if (filePath) {
        return filePath;
      }
    } else {
      const filePath = await this.search(
        `${fileName.replace(".go", "")}_test.go`
      );
      if (filePath) {
        return filePath;
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
    return filename.includes("_test");
  }
}

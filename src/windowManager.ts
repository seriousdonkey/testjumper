import * as vscode from "vscode";
import { getFilename } from "./utils";

export class WindowManager {
  public get activeDocument(): vscode.TextDocument | undefined {
    return vscode.window.activeTextEditor?.document;
  }

  async showInfoMessage(msg: string): Promise<void> {
    await vscode.window.showInformationMessage(msg);
  }

  async showErrorMessage(msg: string): Promise<void> {
    await vscode.window.showErrorMessage(msg);
  }

  async openDocument(
    doc: vscode.TextDocument,
    viewColumn?: number
  ): Promise<void> {
    if (viewColumn) {
      await vscode.window.showTextDocument(doc, { viewColumn });
    } else {
      await vscode.window.showTextDocument(doc);
    }
  }

  isDocumentAlreadyOpen(doc: vscode.TextDocument): {
    isOpen: boolean;
    viewColumn: number;
  } {
    const path = doc.fileName;
    const fileName = getFilename(path);
    const documentTabGroup = vscode.window.tabGroups.all.find((tabGroups) =>
      tabGroups.tabs.find((tab) => tab.label === fileName)
    );
    if (!documentTabGroup) {
      return { isOpen: false, viewColumn: 0 };
    }

    return { isOpen: true, viewColumn: documentTabGroup.viewColumn };
  }
}

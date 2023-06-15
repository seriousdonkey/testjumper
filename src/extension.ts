import * as vscode from "vscode";
import { IFileHandler } from "./fileHandler/fileHandler";
import { getFileExtension, getFilename } from "./utils";
import { TypeScriptHandler } from "./fileHandler/typescript";
import { JavaScriptHandler } from "./fileHandler/javascript";
import { GoHandler } from "./fileHandler/go";
import { WindowManager } from "./windowManager";

const fileHandlers = new Map<string, IFileHandler>([
  [".ts", new TypeScriptHandler()],
  [".js", new JavaScriptHandler()],
  [".go", new GoHandler()],
]);

const windowManager = new WindowManager();

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "testjumper.toggleFile",
    async () => {
      const activeDoc = windowManager.activeDocument;
      if (!activeDoc) {
        windowManager.showInfoMessage("No file open.");
        return;
      }

      const fileExtension = getFileExtension(activeDoc.fileName);
      const fileHandler = fileHandlers.get(fileExtension);
      if (!fileHandler) {
        windowManager.showErrorMessage("Current filetype not supported.");
        return;
      }

      try {
        const filePath = await fileHandler.findFile(activeDoc);
        const doc = await vscode.workspace.openTextDocument(filePath!);
        const { isOpen, viewColumn } = windowManager.isDocumentAlreadyOpen(doc);

        if (isOpen) {
          windowManager.openDocument(doc, viewColumn);
        } else {
          const configuration = vscode.workspace.getConfiguration("testjumper");
          windowManager.openDocument(doc, configuration.openBehaviour);
        }
      } catch (error: any) {
        windowManager.showErrorMessage(error.message);
        return;
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

import * as path from "path";

export function getFilename(filePath: string): string {
  return path.parse(filePath).base;
}

export function getFileExtension(filePath: string): string {
  return path.extname(filePath);
}

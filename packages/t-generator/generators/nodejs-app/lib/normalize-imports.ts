import path from 'node:path';

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join(path.posix.sep);
}

function toRelativeImportPath(
  fromFilePath: string,
  aliasTargetPath: string,
): string {
  const relativeImportPath = path.posix.relative(
    path.posix.dirname(fromFilePath),
    path.posix.join('src', aliasTargetPath),
  );

  return relativeImportPath.startsWith('.')
    ? relativeImportPath
    : `./${relativeImportPath}`;
}

function normalizeNodeImportAliases(
  filePath: string,
  contents: string,
): string {
  const normalizedFilePath = toPosixPath(filePath);

  return contents.replace(/(['"])@\/([^'"`]+)\1/g, (_match, quote, targetPath) => {
    const relativeImportPath = toRelativeImportPath(
      normalizedFilePath,
      String(targetPath),
    );

    return `${quote}${relativeImportPath}${quote}`;
  });
}

export function normalizeNodeServerImports(
  files: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(files).map(([filePath, contents]) => [
      filePath,
      normalizeNodeImportAliases(filePath, contents),
    ]),
  );
}

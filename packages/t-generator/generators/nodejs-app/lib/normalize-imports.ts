import path from 'node:path';

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join(path.posix.sep);
}

function toRelativeImportPath(
  fromFilePath: string,
  aliasTargetPath: string,
  knownFilePaths: ReadonlySet<string>,
): string {
  const relativePath = path.posix.relative(
    path.posix.dirname(fromFilePath),
    path.posix.join('src', aliasTargetPath),
  );
  const pathWithExtension = knownFilePaths.has(`src/${aliasTargetPath}/index.ts`)
    ? relativePath
    : `${relativePath}.js`;

  return pathWithExtension.startsWith('.')
    ? pathWithExtension
    : `./${pathWithExtension}`;
}

function normalizeNodeImportAliases(
  filePath: string,
  contents: string,
  knownFilePaths: ReadonlySet<string>,
): string {
  const normalizedFilePath = toPosixPath(filePath);

  return contents.replace(/(['"])@\/([^'"`]+)\1/g, (_match, quote, targetPath) => {
    const relativeImportPath = toRelativeImportPath(
      normalizedFilePath,
      String(targetPath),
      knownFilePaths,
    );

    return `${quote}${relativeImportPath}${quote}`;
  });
}

export function normalizeNodeServerImports(
  files: Record<string, string>,
): Record<string, string> {
  const knownFilePaths = new Set(Object.keys(files).map(toPosixPath));

  return Object.fromEntries(
    Object.entries(files).map(([filePath, contents]) => [
      filePath,
      normalizeNodeImportAliases(filePath, contents, knownFilePaths),
    ]),
  );
}

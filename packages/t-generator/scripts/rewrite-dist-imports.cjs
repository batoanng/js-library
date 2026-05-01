const fs = require('node:fs');
const path = require('node:path');

const distGeneratorsRoot = path.join(__dirname, '..', 'dist', 'generators');

function walk(directoryPath) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const absolutePath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      walk(absolutePath);
      continue;
    }

    if (entry.name.endsWith('.js')) {
      rewriteFileImports(absolutePath);
    }
  }
}

function hasExtension(importPath) {
  return path.posix.extname(importPath) !== '';
}

function resolveRuntimeImport(filePath, importPath) {
  if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
    return importPath;
  }

  if (hasExtension(importPath)) {
    return importPath;
  }

  const absoluteTarget = path.resolve(path.dirname(filePath), importPath);

  if (fs.existsSync(`${absoluteTarget}.js`)) {
    return `${importPath}.js`;
  }

  if (fs.existsSync(path.join(absoluteTarget, 'index.js'))) {
    return `${importPath}/index.js`;
  }

  return importPath;
}

function rewriteFileImports(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');
  const rewrittenContents = contents
    .replace(
      /(from\s+['"])([^'"]+)(['"])/g,
      (_match, prefix, importPath, suffix) =>
        `${prefix}${resolveRuntimeImport(filePath, importPath)}${suffix}`,
    )
    .replace(
      /(import\(\s*['"])([^'"]+)(['"]\s*\))/g,
      (_match, prefix, importPath, suffix) =>
        `${prefix}${resolveRuntimeImport(filePath, importPath)}${suffix}`,
    );

  if (rewrittenContents !== contents) {
    fs.writeFileSync(filePath, rewrittenContents);
  }
}

walk(distGeneratorsRoot);

const fs = require('node:fs');
const path = require('node:path');

const generatorRoot = path.join(__dirname, '..', 'generators');
const distRoot = path.join(__dirname, '..', 'dist');

function walk(directoryPath) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const absolutePath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      walk(absolutePath);
      continue;
    }

    if (
      entry.name.endsWith('.js') ||
      entry.name.endsWith('.js.map') ||
      entry.name.endsWith('.d.ts') ||
      entry.name.endsWith('.d.ts.map')
    ) {
      fs.rmSync(absolutePath, { force: true });
    }
  }
}

walk(generatorRoot);
fs.rmSync(distRoot, { recursive: true, force: true });

const fs = require('node:fs');
const path = require('node:path');

const generatorRoot = path.join(__dirname, '..', 'generators');
const distRoot = path.join(__dirname, '..', 'dist');

function cleanLegacyBuildOutput(directoryPath) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const absolutePath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      cleanLegacyBuildOutput(absolutePath);
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

cleanLegacyBuildOutput(generatorRoot);
fs.rmSync(distRoot, { recursive: true, force: true });

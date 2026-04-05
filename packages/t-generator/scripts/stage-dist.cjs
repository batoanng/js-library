const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const distRoot = path.join(projectRoot, 'dist');
const generatorsRoot = path.join(projectRoot, 'generators');
const packageJsonPath = path.join(projectRoot, 'package.json');

const rootPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const distPackageJson = {
  name: rootPackageJson.name,
  version: rootPackageJson.version,
  description: rootPackageJson.description,
  publishConfig: rootPackageJson.publishConfig,
  type: rootPackageJson.type,
  main: rootPackageJson.main,
  files: rootPackageJson.files,
  keywords: rootPackageJson.keywords,
  engines: rootPackageJson.engines,
  dependencies: rootPackageJson.dependencies,
};

fs.rmSync(distRoot, { recursive: true, force: true });
fs.mkdirSync(distRoot, { recursive: true });

copyFile('README.md');
copyFile('CHANGELOG.md');
copyDirectory(generatorsRoot, path.join(distRoot, 'generators'));
fs.writeFileSync(
  path.join(distRoot, 'package.json'),
  `${JSON.stringify(distPackageJson, null, 2)}\n`,
);

function copyFile(relativePath) {
  fs.copyFileSync(
    path.join(projectRoot, relativePath),
    path.join(distRoot, relativePath),
  );
}

function copyDirectory(sourcePath, destinationPath) {
  fs.mkdirSync(destinationPath, { recursive: true });
  fs.cpSync(sourcePath, destinationPath, {
    recursive: true,
    filter: (currentSourcePath) => {
      const stats = fs.statSync(currentSourcePath);

      if (stats.isDirectory()) {
        return true;
      }

      return currentSourcePath.endsWith('.js') || currentSourcePath.includes(`${path.sep}templates${path.sep}`);
    },
  });
}

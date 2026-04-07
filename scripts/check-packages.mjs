import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceDir = path.resolve(rootDir, '..');
const packagesDir = path.join(workspaceDir, 'packages');
const npmCacheDir = mkdtempSync(path.join(tmpdir(), 'js-library-pack-'));

const packageDirs = readdirSync(packagesDir)
  .map((entry) => path.join(packagesDir, entry))
  .filter((dir) => statSync(dir).isDirectory())
  .filter((dir) => {
    const packageJsonPath = path.join(dir, 'package.json');

    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      return packageJson.private !== true;
    } catch {
      return false;
    }
  });

const globalBans = [
  { label: 'root source files', test: (filePath) => filePath.startsWith('src/') },
  { label: 'source maps', test: (filePath) => filePath.endsWith('.map') },
  { label: 'Turbo artifacts', test: (filePath) => /(^|\/)\.turbo(\/|$)/.test(filePath) },
  { label: 'TypeScript build info', test: (filePath) => filePath.endsWith('.tsbuildinfo') },
  { label: 'storybook build output', test: (filePath) => /(^|\/)storybook-static(\/|$)/.test(filePath) },
  { label: 'dist backup artifacts', test: (filePath) => /(^|\/)js-library-utils-dist-backup(\/|$)/.test(filePath) },
  { label: 'MDX docs', test: (filePath) => filePath.endsWith('.mdx') },
  { label: 'packaged test declarations', test: (filePath) => /(^|\/)dist\/(?:.*\/)?tests?\//.test(filePath) },
  { label: 'packaged config declarations', test: (filePath) => /(^|\/)(vite|vitest)\.config\.d\.ts$/.test(filePath) },
];

const fileNameBans = [
  { label: 'story files', test: (filePath) => filePath.includes('.stories.') || filePath.includes('.story.') },
  { label: 'spec files', test: (filePath) => filePath.includes('.spec.') },
  { label: 'test files', test: (filePath) => filePath.includes('.test.') },
];

const allowedExceptions = {
  '@batoanng/eslint-config': [/^smoke\/example\.spec\.tsx$/],
  'generator-t-generator': [/\/templates\//],
};

const parsePackOutput = (output) => {
  const match = output.trim().match(/(\[\s*\{[\s\S]*\}\s*\])\s*$/);

  if (match === null) {
    throw new Error(`Unable to parse npm pack output:\n${output}`);
  }

  return JSON.parse(match[1]);
};

const isAllowedException = (packageName, filePath) =>
  (allowedExceptions[packageName] ?? []).some((pattern) => pattern.test(filePath));

const violations = [];

for (const packageDir of packageDirs) {
  const packageJson = JSON.parse(readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  const [{ files }] = parsePackOutput(
    execFileSync('npm', ['pack', '--json', '--dry-run', packageDir], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        npm_config_cache: npmCacheDir,
      },
    })
  );
  const packageViolations = [];
  const activeBans = packageJson.name === 'generator-t-generator' ? globalBans : [...globalBans, ...fileNameBans];

  for (const { path: filePath } of files) {
    if (isAllowedException(packageJson.name, filePath)) {
      continue;
    }

    for (const ban of activeBans) {
      if (ban.test(filePath)) {
        packageViolations.push(`${ban.label}: ${filePath}`);
      }
    }
  }

  if (packageViolations.length > 0) {
    violations.push(`\n${packageJson.name}\n${packageViolations.map((entry) => `  - ${entry}`).join('\n')}`);
  }
}

if (violations.length > 0) {
  console.error('Packaging regression check failed.');
  console.error(violations.join('\n'));
  process.exit(1);
}

console.log('Packaging regression check passed.');

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
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

const packageBudgets = {
  '@batoanng/mui-components': {
    packedSize: 150_000,
    unpackedSize: 550_000,
  },
};

const productionBundleBans = {
  '@batoanng/mui-components': {
    bundlePath: 'dist/components.js',
    patterns: [
      { label: '@testing-library/react', test: (contents) => contents.includes('@testing-library/react') },
      { label: 'react-dom/test-utils', test: (contents) => contents.includes('react-dom/test-utils') },
      { label: 'pretty-format', test: (contents) => contents.includes('pretty-format') },
    ],
  },
};

const dependencyFields = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
  'bundledDependencies',
  'bundleDependencies',
];

const parsePackOutput = (output) => {
  const match = output.trim().match(/(\[\s*\{[\s\S]*\}\s*\])\s*$/);

  if (match === null) {
    throw new Error(`Unable to parse npm pack output:\n${output}`);
  }

  return JSON.parse(match[1]);
};

const isAllowedException = (packageName, filePath) =>
  (allowedExceptions[packageName] ?? []).some((pattern) => pattern.test(filePath));

const collectWorkspaceDependencyViolations = (packageJson) =>
  dependencyFields.flatMap((field) =>
    Object.entries(packageJson[field] ?? {})
      .filter(([, specifier]) => String(specifier).startsWith('workspace:'))
      .map(([dependencyName, specifier]) => `${field}: ${dependencyName}@${specifier}`)
  );

const violations = [];

for (const packageDir of packageDirs) {
  const packageJson = JSON.parse(readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  const workspaceDependencyViolations = collectWorkspaceDependencyViolations(packageJson);

  if (workspaceDependencyViolations.length > 0) {
    violations.push(
      `\n${packageJson.name}\n${workspaceDependencyViolations
        .map((entry) => `  - workspace protocol dependency: ${entry}`)
        .join('\n')}`
    );
  }

  const [packInfo] = parsePackOutput(
    execFileSync('npm', ['pack', '--json', '--dry-run', packageDir], {
      cwd: workspaceDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        npm_config_cache: npmCacheDir,
      },
    })
  );
  const { files, size, unpackedSize } = packInfo;
  const packageViolations = [];
  const activeBans = packageJson.name === 'generator-t-generator' ? globalBans : [...globalBans, ...fileNameBans];
  const packageBudget = packageBudgets[packageJson.name];

  if (packageBudget && size > packageBudget.packedSize) {
    packageViolations.push(`packed size ${size} exceeds budget ${packageBudget.packedSize}`);
  }

  if (packageBudget && unpackedSize > packageBudget.unpackedSize) {
    packageViolations.push(`unpacked size ${unpackedSize} exceeds budget ${packageBudget.unpackedSize}`);
  }

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

  if (
    packageJson.name === '@batoanng/mui-components' &&
    files.some(({ path: filePath }) => filePath === 'dist/src/test-utils.d.ts') &&
    packageJson.exports?.['./test-utils'] == null
  ) {
    packageViolations.push('test utilities declaration is packed without an explicit ./test-utils export');
  }

  const bundleBan = productionBundleBans[packageJson.name];
  const bundlePath = bundleBan ? path.join(packageDir, bundleBan.bundlePath) : null;

  if (bundleBan && existsSync(bundlePath)) {
    const bundleContents = readFileSync(bundlePath, 'utf8');

    for (const pattern of bundleBan.patterns) {
      if (pattern.test(bundleContents)) {
        packageViolations.push(`production bundle includes ${pattern.label}`);
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

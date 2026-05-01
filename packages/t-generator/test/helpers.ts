import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { RunResult } from 'yeoman-test';
import type { PackageJson } from '../generators/lib/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ScaffoldResult = {
  runResult: RunResult;
  projectRoot: string;
  tmpDir: string;
};

const testTarget = process.env.TEST_TARGET;
const useBuiltGenerators = testTarget === 'build' || testTarget === 'dist';
const generatorExtension = useBuiltGenerators
  ? '.js'
  : path.extname(__filename) === '.ts'
    ? '.ts'
    : '.js';
const generatorRoot = useBuiltGenerators
  ? path.join(__dirname, '../dist/generators')
  : path.join(__dirname, '../generators');

export const appGeneratorPath = path.join(
  generatorRoot,
  `index${generatorExtension}`,
);
export const rootGeneratorPath = appGeneratorPath;
export const reactAppGeneratorPath = path.join(
  generatorRoot,
  'react-app',
  `index${generatorExtension}`,
);
export const reactAddGeneratorPath = path.join(
  generatorRoot,
  'react-add',
  `index${generatorExtension}`,
);
export const nextjsAppGeneratorPath = path.join(
  generatorRoot,
  'nextjs-app',
  `index${generatorExtension}`,
);
export const nextjsAddGeneratorPath = path.join(
  generatorRoot,
  'nextjs-add',
  `index${generatorExtension}`,
);
export const addGeneratorPath = reactAddGeneratorPath;
export const nestjsAppGeneratorPath = path.join(
  generatorRoot,
  'nestjs-app',
  `index${generatorExtension}`,
);
export const nestjsAddGeneratorPath = path.join(
  generatorRoot,
  'nestjs-add',
  `index${generatorExtension}`,
);
export const nodejsAppGeneratorPath = path.join(
  generatorRoot,
  'nodejs-app',
  `index${generatorExtension}`,
);
export const nodejsAddGeneratorPath = path.join(
  generatorRoot,
  'nodejs-add',
  `index${generatorExtension}`,
);

export function readJson<T = PackageJson>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

export async function createYeomanTestHelpers() {
  const { createHelpers } = await import('yeoman-test');

  return createHelpers({});
}

export function readText(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function collectDirectoryFiles(rootPath: string): string[] {
  const files: string[] = [];

  function visit(currentPath: string, prefix = ''): void {
    fs.readdirSync(currentPath, { withFileTypes: true }).forEach((entry) => {
      const relativePath = prefix ? path.join(prefix, entry.name) : entry.name;
      const absolutePath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        visit(absolutePath, relativePath);
        return;
      }

      files.push(relativePath);
    });
  }

  visit(rootPath);

  return files.sort();
}

export function snapshotDirectory(rootPath: string): Record<string, string> {
  return Object.fromEntries(
    collectDirectoryFiles(rootPath).map((relativePath) => [
      relativePath,
      readText(path.join(rootPath, relativePath)),
    ]),
  );
}

export async function scaffoldAppWithGenerator(
  generatorPath: string,
  appName: string,
): Promise<ScaffoldResult> {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  const runResult = await helpers
    .run(generatorPath)
    .inTmpDir((directory) => {
      tmpDir = directory;
    })
    .withArguments([appName]);

  return {
    runResult,
    projectRoot: path.join(tmpDir, appName),
    tmpDir,
  };
}

export async function scaffoldBaseApp(appName: string): Promise<ScaffoldResult> {
  return scaffoldAppWithGenerator(reactAppGeneratorPath, appName);
}

export async function scaffoldReactApp(appName: string): Promise<ScaffoldResult> {
  return scaffoldAppWithGenerator(reactAppGeneratorPath, appName);
}

export async function scaffoldNestApp(appName: string): Promise<ScaffoldResult> {
  return scaffoldAppWithGenerator(nestjsAppGeneratorPath, appName);
}

export async function scaffoldNextjsApp(appName: string): Promise<ScaffoldResult> {
  return scaffoldAppWithGenerator(nextjsAppGeneratorPath, appName);
}

export async function scaffoldNodeApp(
  appName: string,
  architecture: 'clean' | 'mvp' = 'clean',
): Promise<ScaffoldResult> {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  const runResult = await helpers
    .run(nodejsAppGeneratorPath)
    .inTmpDir((directory) => {
      tmpDir = directory;
    })
    .withArguments([appName])
    .withPrompts({ architecture });

  return {
    runResult,
    projectRoot: path.join(tmpDir, appName),
    tmpDir,
  };
}

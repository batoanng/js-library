import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import type { PackageJson } from '../generators/lib/types';
import {
  createYeomanTestHelpers,
  nextjsAppGeneratorPath,
  readJson,
  rootGeneratorPath,
  scaffoldNextjsApp,
} from './helpers';

const blockedDependencies = [
  '@apollo/client',
  '@auth0/nextjs-auth0',
  '@batoanng/mui-components',
  '@batoanng/tailwind-config',
  '@emotion/react',
  '@emotion/styled',
  '@mui/material',
  '@mui/material-nextjs',
  '@mui/icons-material',
  '@reduxjs/toolkit',
  '@tailwindcss/postcss',
  '@tanstack/react-query',
  '@tanstack/react-query-devtools',
  'axios',
  'graphql',
  'react-redux',
  'redux',
  'redux-persist',
  'tailwindcss',
];

test('generates the Next.js base app with the expected project structure', async () => {
  const { projectRoot } = await scaffoldNextjsApp('starter-next');
  const packageJson = readJson<PackageJson>(path.join(projectRoot, 'package.json'));

  yoAssert.file([
    path.join(projectRoot, 'package.json'),
    path.join(projectRoot, 'next.config.mjs'),
    path.join(projectRoot, 'jest.config.js'),
    path.join(projectRoot, 'eslint.config.mjs'),
    path.join(projectRoot, 'prettier.config.js'),
    path.join(projectRoot, 'tsconfig.json'),
    path.join(projectRoot, 'next-env.d.ts'),
    path.join(projectRoot, '.env.example'),
    path.join(projectRoot, 'src/app/layout.tsx'),
    path.join(projectRoot, 'src/app/page.tsx'),
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    path.join(projectRoot, 'src/app/providers/index.ts'),
    path.join(projectRoot, 'src/app/globals.css'),
    path.join(projectRoot, 'src/pages/home/index.ts'),
    path.join(projectRoot, 'src/pages/home/ui/HomePage.tsx'),
    path.join(projectRoot, 'src/pages/home/ui/HomePage.test.tsx'),
    path.join(projectRoot, 'src/shared/config/env.ts'),
  ]);

  assert.deepEqual(Object.keys(packageJson.scripts || {}), [
    'dev',
    'build',
    'start',
    'analyze',
    'lint',
    'test',
    'type-check',
  ]);

  assert.deepEqual(Object.keys(packageJson.dependencies || {}).sort(), [
    'next',
    'react',
    'react-dom',
    'zod',
  ]);
  assert.equal(packageJson.devDependencies?.['@batoanng/eslint-config'], '^3.3.2');
  assert.equal(packageJson.devDependencies?.['@batoanng/jest-config'], '^1.4.1');
  assert.equal(packageJson.devDependencies?.['@batoanng/prettier-config'], '^1.7.0');
  assert.equal(packageJson.devDependencies?.['@batoanng/tsconfig'], '^1.5.1');
  assert.equal(packageJson.tGenerator?.stack, 'nextjs');
  assert.deepEqual(packageJson.tGenerator?.features, []);

  blockedDependencies.forEach((dependencyName) => {
    assert.equal(packageJson.dependencies?.[dependencyName], undefined);
    assert.equal(packageJson.devDependencies?.[dependencyName], undefined);
  });

  [
    'src/widgets',
    'src/features',
    'src/entities',
    'src/shared/ui',
    'src/shared/api',
    'src/shared/lib',
  ].forEach((directory) => {
    assert.equal(
      fs.statSync(path.join(projectRoot, directory)).isDirectory(),
      true,
      `${directory} should exist`,
    );
  });

  assert.equal(fs.existsSync(path.join(projectRoot, 'postcss.config.js')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/lib/auth0.ts')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/app/redux')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/app/react-query')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/app/apollo')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/app/pwa')), false);

  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'NEXT_PUBLIC_APP_NAME=starter-next',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/shared/config/env.ts'),
    "appName: process.env.NEXT_PUBLIC_APP_NAME?.trim() || fallbackAppName",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/layout.tsx'),
    "import './globals.css';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    'return (\n    <>\n      {children}\n    </>\n  );',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'prettier.config.js'),
    "require('@batoanng/prettier-config')",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'README.md'),
    'yo t-generator:nextjs-add tailwind',
  );
  assert.equal(
    fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf8').includes(
      'yo t-generator:nextjs-add bff',
    ),
    false,
  );
});

test('prompts for the Next.js app name when one is not provided', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await helpers
    .run(nextjsAppGeneratorPath)
    .inTmpDir((directory) => {
      tmpDir = directory;
    })
    .withPrompts({ appName: 'Prompt Driven Next App' });

  const projectRoot = path.join(tmpDir, 'prompt-driven-next-app');

  yoAssert.file([
    path.join(projectRoot, 'package.json'),
    path.join(projectRoot, 'src/pages/home/ui/HomePage.tsx'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'NEXT_PUBLIC_APP_NAME=Prompt Driven Next App',
  );
});

test('fails when the Next.js target directory already exists and is not empty', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await assert.rejects(
    async () =>
      helpers
        .run(nextjsAppGeneratorPath)
        .inTmpDir((directory) => {
          tmpDir = directory;
          const targetDirectory = path.join(directory, 'existing-next-app');

          fs.mkdirSync(targetDirectory, { recursive: true });
          fs.writeFileSync(path.join(targetDirectory, 'keep.txt'), 'existing');
        })
        .withArguments(['existing-next-app'])
        .run(),
    /already exists and is not empty/,
  );

  assert.equal(
    fs.existsSync(path.join(tmpDir, 'existing-next-app', 'keep.txt')),
    true,
  );
});

test('root generator can route to the Next.js base generator', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await helpers
    .run(rootGeneratorPath)
    .inTmpDir((directory) => {
      tmpDir = directory;
    })
    .withPrompts({
      stack: 'nextjs',
      action: 'create-base',
      appName: 'root-next-app',
    });

  yoAssert.file([
    path.join(tmpDir, 'root-next-app/package.json'),
    path.join(tmpDir, 'root-next-app/src/app/layout.tsx'),
  ]);
});

test('root generator can route to Next.js feature generation', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('root-next-feature');

  await runResult
    .create(rootGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withPrompts({
      stack: 'nextjs',
      action: 'add-feature',
      featureName: 'tailwind',
    })
    .run();

  yoAssert.file([path.join(projectRoot, 'postcss.config.js')]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/globals.css'),
    '@import "tailwindcss";',
  );
});

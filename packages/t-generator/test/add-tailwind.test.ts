import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import type { PackageJson } from '../generators/lib/types';
import {
  addGeneratorPath,
  readJson,
  scaffoldBaseApp,
} from './helpers';

test('adds the Tailwind feature to an existing generated React base app', async () => {
  const { projectRoot, runResult } = await scaffoldBaseApp('starter-tailwind');

  await runResult
    .create(addGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['tailwind'])
    .run();

  const packageJson = readJson<PackageJson>(path.join(projectRoot, 'package.json'));

  assert.equal(packageJson.devDependencies?.['@tailwindcss/vite'], '^4.1.13');
  assert.equal(packageJson.devDependencies?.tailwindcss, '^4.1.13');
  assert.equal(
    packageJson.devDependencies?.['@batoanng/tailwind-config'],
    '^1.2.0',
  );

  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    "import tailwindcss from '@tailwindcss/vite';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    'tailwindcss()',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/styles/global.css'),
    '@import "tailwindcss";',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/styles/global.css'),
    '@import "@batoanng/tailwind-config/styles.css";',
  );
});

test('tailwind can be added after ui-library without removing theme wiring', async () => {
  const { projectRoot, runResult } = await scaffoldBaseApp('ui-first-tailwind');

  await runResult
    .create(addGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['ui-library'])
    .run();

  await runResult
    .create(addGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['tailwind'])
    .run();

  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    'StyledEngineProvider injectFirst',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    'ThemeProvider theme={appTheme}',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/styles/global.css'),
    '@import "tailwindcss";',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/pages/home/ui/HomePage.tsx'),
    'Tailwind CSS v4 can sit alongside the generated MUI setup',
  );
});

test('ui-library can be added after tailwind without removing Tailwind wiring', async () => {
  const { projectRoot, runResult } = await scaffoldBaseApp('tailwind-first-ui');

  await runResult
    .create(addGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['tailwind'])
    .run();

  await runResult
    .create(addGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['ui-library'])
    .run();

  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    "import tailwindcss from '@tailwindcss/vite';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    'StyledEngineProvider injectFirst',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/widgets/ui-library-showcase/ui/UiLibraryShowcase.tsx'),
    'Shared UI, ready to extend',
  );
});

test('tailwind can be added after pwa without removing the PWA build wiring', async () => {
  const { projectRoot, runResult } = await scaffoldBaseApp('pwa-first-tailwind');

  await runResult
    .create(addGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['pwa'])
    .run();

  await runResult
    .create(addGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['tailwind'])
    .run();

  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    "import { VitePWA } from 'vite-plugin-pwa';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    "import tailwindcss from '@tailwindcss/vite';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    'VitePWA({',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    'tailwindcss()',
  );
});

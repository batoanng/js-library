import assert from 'node:assert/strict';
import fs from 'node:fs';
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

  assert.equal(packageJson.devDependencies?.['@tailwindcss/vite'], '^4.2.4');
  assert.equal(packageJson.devDependencies?.tailwindcss, '^4.2.4');
  assert.equal(
    packageJson.devDependencies?.['@batoanng/tailwind-config'],
    '^1.4.1',
  );
  assert.equal(packageJson.dependencies?.['@auth0/auth0-react'], undefined);
  assert.equal(packageJson.dependencies?.['@batoanng/mui-components'], undefined);
  assert.equal(packageJson.dependencies?.['@reduxjs/toolkit'], undefined);
  assert.equal(packageJson.dependencies?.['@tanstack/react-query'], undefined);
  assert.equal(packageJson.dependencies?.['@apollo/client'], undefined);
  assert.equal(packageJson.devDependencies?.['vite-plugin-pwa'], undefined);

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
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/widgets')), true);
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/widgets/ui-library-showcase')),
    false,
  );
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/app/providers/auth')),
    false,
  );
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/app/store')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/pages/apollo')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/features/pwa')), false);
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

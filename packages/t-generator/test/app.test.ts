import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import type { PackageJson } from '../generators/lib/types';
import {
  createYeomanTestHelpers,
  readJson,
  reactAppGeneratorPath,
  rootGeneratorPath,
  scaffoldNestApp,
} from './helpers';

const blockedDependencies = [
  '@batoanng/mui-components',
  '@emotion/react',
  '@emotion/styled',
  '@apollo/client',
  '@auth0/auth0-react',
  '@types/redux-immutable-state-invariant',
  '@types/redux-logger',
  '@tailwindcss/vite',
  '@mui/material',
  '@mui/icons-material',
  '@reduxjs/toolkit',
  '@tanstack/react-query',
  '@tanstack/react-query-devtools',
  'react-redux',
  'redux',
  'redux-immutable-state-invariant',
  'redux-logger',
  'redux-persist',
  'axios',
  'graphql',
  'tailwindcss',
  'vite-plugin-pwa',
  'notistack',
];

test('generates the React base app with the expected project structure', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await helpers
    .run(reactAppGeneratorPath)
    .inTmpDir((directory) => {
      tmpDir = directory;
    })
    .withArguments(['starter-app']);

  const projectRoot = path.join(tmpDir, 'starter-app');
  const packageJson = readJson<PackageJson>(
    path.join(projectRoot, 'package.json'),
  );

  yoAssert.file([
    path.join(projectRoot, 'package.json'),
    path.join(projectRoot, '.codex/config.toml'),
    path.join(projectRoot, '.husky/pre-push'),
    path.join(
      projectRoot,
      '.codex/skills/use-types-structures/SKILL.md',
    ),
    path.join(projectRoot, 'Dockerfile'),
    path.join(
      projectRoot,
      '.codex/skills/use-types-structures/agents/openai.yaml',
    ),
    path.join(projectRoot, 'index.html'),
    path.join(projectRoot, 'tsconfig.json'),
    path.join(projectRoot, 'vite.config.ts'),
    path.join(projectRoot, 'vitest.config.ts'),
    path.join(projectRoot, 'eslint.config.js'),
    path.join(projectRoot, '.prettierrc.json'),
    path.join(projectRoot, '.prettierignore'),
    path.join(projectRoot, '.env.example'),
    path.join(projectRoot, 'src/main.tsx'),
    path.join(projectRoot, 'src/app/entrypoint/App.tsx'),
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    path.join(projectRoot, 'src/app/routes/AppRouter.tsx'),
    path.join(projectRoot, 'src/app/styles/global.css'),
    path.join(projectRoot, 'src/pages/home/index.ts'),
    path.join(projectRoot, 'src/pages/home/ui/HomePage.tsx'),
    path.join(projectRoot, 'src/pages/home/ui/HomePage.test.tsx'),
    path.join(projectRoot, 'src/shared/config/env.ts'),
    path.join(projectRoot, 'src/test/setup.ts'),
  ]);

  assert.deepEqual(Object.keys(packageJson.scripts || {}), [
    'dev',
    'build',
    'preview',
    'lint',
    'prepush',
    'test',
    'prepare',
  ]);

  assert.deepEqual(Object.keys(packageJson.dependencies || {}).sort(), [
    '@batoanng/types',
    'react',
    'react-dom',
    'react-router-dom',
    'zod',
  ]);
  assert.equal(packageJson.dependencies?.['@batoanng/types'], '^0.5.2');
  assert.equal(packageJson.dependencies?.react, '^19.2.5');
  assert.equal(packageJson.dependencies?.['react-dom'], '^19.2.5');
  assert.equal(packageJson.dependencies?.['react-router-dom'], '^7.14.2');
  assert.equal(packageJson.dependencies?.zod, '^4.4.1');
  assert.equal(packageJson.devDependencies?.['@types/react'], '^19.2.14');
  assert.equal(packageJson.devDependencies?.['@types/react-dom'], '^19.2.3');
  assert.equal(packageJson.tGenerator?.stack, 'react');
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

  assert.equal(fs.existsSync(path.join(projectRoot, 'server')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'prisma')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/server.ts')), false);
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/modules/app.module.ts')),
    false,
  );
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/app/store')), false);
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/features/auth')),
    false,
  );
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/pages/redux')), false);
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/pages/react-query')),
    false,
  );
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/pages/apollo')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/shared/apollo')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/pages/pwa')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/features/pwa')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'public/pwa-icon.svg')), false);

  yoAssert.fileContent(
    path.join(
      projectRoot,
      '.codex/skills/use-types-structures/SKILL.md',
    ),
    'Prefer reusing that package over ad hoc arrays, objects, or one-off storage utilities',
  );
  yoAssert.fileContent(
    path.join(
      projectRoot,
      '.codex/skills/use-types-structures/agents/openai.yaml',
    ),
    'default_prompt: "Use $use-types-structures when implementing or reviewing this feature so the solution reuses @batoanng/types where appropriate and explains the expected complexity of the critical path."',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/shared/config/env.ts'),
    'appName: import.meta.env.VITE_APP_NAME?.trim() || fallbackAppName',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/vite-env.d.ts'),
    'readonly VITE_APP_PORT?: string;',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/shared/config/env.ts'),
    "import { z } from 'zod';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/shared/config/env.ts'),
    'export const envSchema = z.object({',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/routes/AppRouter.tsx'),
    '<Route path="/" element={<HomePage />} />',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    'return (\n    <>\n      {children}\n    </>\n  );',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/pages/home/ui/HomePage.test.tsx'),
    '<AppProviders>',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'Dockerfile'),
    'CMD ["serve", "-s", "dist", "-l", "3000"]',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'Dockerfile'),
    'FROM node:24-alpine AS builder',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'Dockerfile'),
    'RUN pnpm run build',
  );
  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'VITE_APP_PORT=3000',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    "import { defineConfig, loadEnv } from 'vite';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    "const appPort = Number.parseInt(env.VITE_APP_PORT || '3000', 10);",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    'port: Number.isNaN(appPort) ? 3000 : appPort,',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'README.md'),
    'yo t-generator:react-add',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'README.md'),
    'yo t-generator:react-add tailwind',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'README.md'),
    'yo t-generator:react-add auth',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'README.md'),
    'yo t-generator:react-add redux',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'README.md'),
    'yo t-generator:react-add react-query',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'README.md'),
    'yo t-generator:react-add apollo',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'README.md'),
    'yo t-generator:react-add pwa',
  );
  assert.equal(
    fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf8').includes(
      'yo t-generator:add',
    ),
    false,
  );
});

test('prompts for the app name when one is not provided', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await helpers
    .run(reactAppGeneratorPath)
    .inTmpDir((directory) => {
      tmpDir = directory;
    })
    .withPrompts({ appName: 'Prompt Driven App' });

  const projectRoot = path.join(tmpDir, 'prompt-driven-app');

  yoAssert.file([
    path.join(projectRoot, 'package.json'),
    path.join(projectRoot, 'src/pages/home/ui/HomePage.tsx'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'VITE_APP_NAME=Prompt Driven App',
  );
  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'VITE_APP_PORT=3000',
  );
});

test('fails when the React target directory already exists and is not empty', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await assert.rejects(
    async () =>
      helpers
        .run(reactAppGeneratorPath)
        .inTmpDir((directory) => {
          tmpDir = directory;
          const targetDirectory = path.join(directory, 'existing-app');

          fs.mkdirSync(targetDirectory, { recursive: true });
          fs.writeFileSync(path.join(targetDirectory, 'keep.txt'), 'existing');
        })
        .withArguments(['existing-app'])
        .run(),
    /already exists and is not empty/,
  );

  assert.equal(
    fs.existsSync(path.join(tmpDir, 'existing-app', 'keep.txt')),
    true,
  );
});

test('root generator can route to the React base generator', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await helpers
    .run(rootGeneratorPath)
    .inTmpDir((directory) => {
      tmpDir = directory;
    })
    .withPrompts({
      stack: 'react',
      action: 'create-base',
      appName: 'root-react-app',
    })
    .run();

  yoAssert.file([
    path.join(tmpDir, 'root-react-app/package.json'),
    path.join(tmpDir, 'root-react-app/src/main.tsx'),
  ]);
});

test('root generator can route to NestJS feature generation', async () => {
  const { projectRoot, runResult } = await scaffoldNestApp('root-nest');

  await runResult
    .create(
      rootGeneratorPath,
      { cwd: projectRoot, tmpdir: false },
      undefined,
    )
    .withPrompts({
      stack: 'nestjs',
      action: 'add-feature',
      featureName: 'cache',
    })
    .run();

  yoAssert.file([
    path.join(projectRoot, 'src/modules/cache/cache.module.ts'),
    path.join(projectRoot, 'src/modules/cache/cache.service.ts'),
  ]);
});

test('root generator can route to the Node.js base generator', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await helpers
    .run(rootGeneratorPath)
    .inTmpDir((directory) => {
      tmpDir = directory;
    })
    .withPrompts({
      stack: 'nodejs',
      action: 'create-base',
      appName: 'root-node-server',
      architecture: 'clean',
    })
    .run();

  yoAssert.file([
    path.join(tmpDir, 'root-node-server/package.json'),
    path.join(tmpDir, 'root-node-server/src/app.ts'),
    path.join(tmpDir, 'root-node-server/src/interfaces/routes/health.route.ts'),
  ]);
});

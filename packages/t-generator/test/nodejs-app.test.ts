import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import type { PackageJson } from '../generators/lib/types';
import {
  createYeomanTestHelpers,
  nodejsAppGeneratorPath,
  readJson,
  scaffoldNodeApp,
} from './helpers';

const blockedDependencies = [
  'bullmq',
  'graphql',
  'graphql-http',
  'ioredis',
  'openai',
  'react',
  'react-dom',
  'react-router-dom',
  'tsc-alias',
  'tsconfig-paths',
];

test('generates the clean Node.js base app with the expected project structure', async () => {
  const { projectRoot } = await scaffoldNodeApp('starter-node', 'clean');
  const packageJson = readJson<PackageJson>(
    path.join(projectRoot, 'package.json'),
  );
  const hasPackageDependency = (dependencyName: string): boolean =>
    typeof packageJson.dependencies?.[dependencyName] === 'string' ||
    typeof packageJson.devDependencies?.[dependencyName] === 'string';

  yoAssert.file([
    path.join(projectRoot, 'package.json'),
    path.join(projectRoot, 'README.md'),
    path.join(projectRoot, 'tsconfig.json'),
    path.join(projectRoot, 'tsconfig.test.json'),
    path.join(projectRoot, 'jest.config.js'),
    path.join(projectRoot, 'eslint.config.mjs'),
    path.join(projectRoot, 'nodemon.json'),
    path.join(projectRoot, 'prettier.config.cjs'),
    path.join(projectRoot, '.gitignore'),
    path.join(projectRoot, '.env.example'),
    path.join(projectRoot, 'prisma/schema.prisma'),
    path.join(projectRoot, 'src/app.ts'),
    path.join(projectRoot, 'src/server.ts'),
    path.join(projectRoot, 'src/config/env.ts'),
    path.join(projectRoot, 'src/config/logger.ts'),
    path.join(projectRoot, 'src/infrastructure/prisma/prisma.ts'),
    path.join(projectRoot, 'src/infrastructure/repositories/health.repository.ts'),
    path.join(projectRoot, 'src/domain/health.ts'),
    path.join(projectRoot, 'src/usecases/check-health.ts'),
    path.join(projectRoot, 'src/interfaces/controllers/health.controller.ts'),
    path.join(projectRoot, 'src/interfaces/routes/health.route.ts'),
    path.join(projectRoot, 'src/interfaces/index.ts'),
    path.join(projectRoot, 'src/shared/error-middleware.ts'),
    path.join(projectRoot, 'src/shared/graceful-shutdown.ts'),
    path.join(projectRoot, 'tests/health.test.ts'),
  ]);

  assert.deepEqual(Object.keys(packageJson.scripts || {}), [
    'postinstall',
    'start',
    'dev',
    'build',
    'lint',
    'test',
    'prisma:generate',
    'prisma:migrate:dev',
  ]);
  assert.equal(packageJson.tGenerator?.stack, 'nodejs');
  assert.equal(packageJson.tGenerator?.architecture, 'clean');

  [
    '@prisma/client',
    'cors',
    'dotenv',
    'express',
    'express-rate-limit',
    'helmet',
    'hpp',
    'morgan',
    'winston',
    'zod',
  ].forEach((dependencyName) => {
    assert.equal(
      hasPackageDependency(dependencyName),
      true,
      `${dependencyName} should exist`,
    );
  });

  blockedDependencies.forEach((dependencyName) => {
    assert.equal(packageJson.dependencies?.[dependencyName], undefined);
    assert.equal(packageJson.devDependencies?.[dependencyName], undefined);
  });

  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'DATABASE_URL=mysql://root:root@localhost:3306/starter_node',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'prisma/schema.prisma'),
    "provider = 'mysql'",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app.ts'),
    "app.use('/health', healthRouter);",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app.ts'),
    "import { env } from './config/env';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/interfaces/index.ts'),
    "export { healthRouter } from './routes/health.route';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'tests/health.test.ts'),
    "const response = await request(app).get('/health');",
  );
  assert.doesNotMatch(
    fs.readFileSync(path.join(projectRoot, 'src/app.ts'), 'utf8'),
    /'@\//,
  );

  assert.equal(fs.existsSync(path.join(projectRoot, 'src/modules')), false);
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/interfaces/routes/queue.route.ts')),
    false,
  );
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/interfaces/graphql/register-graphql.ts')),
    false,
  );
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/infrastructure/redis/redis.client.ts')),
    false,
  );
});

test('generates the MVP Node.js base app when selected', async () => {
  const { projectRoot } = await scaffoldNodeApp('starter-mvp', 'mvp');
  const packageJson = readJson<PackageJson>(
    path.join(projectRoot, 'package.json'),
  );

  yoAssert.file([
    path.join(projectRoot, 'src/modules/health/health.repository.ts'),
    path.join(projectRoot, 'src/modules/health/health.service.ts'),
    path.join(projectRoot, 'src/modules/health/health.controller.ts'),
    path.join(projectRoot, 'src/modules/health/health.route.ts'),
    path.join(projectRoot, 'src/modules/index.ts'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/modules/index.ts'),
    "export { healthRouter } from './health/health.route';",
  );
  assert.doesNotMatch(
    fs.readFileSync(
      path.join(projectRoot, 'src/modules/health/health.service.ts'),
      'utf8',
    ),
    /'@\//,
  );
  assert.equal(packageJson.tGenerator?.architecture, 'mvp');
  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/interfaces/index.ts')),
    false,
  );
});

test('prompts for the Node.js app name and architecture when they are not provided', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await helpers
    .run(nodejsAppGeneratorPath)
    .inTmpDir((directory) => {
      tmpDir = directory;
    })
    .withPrompts({
      appName: 'Prompted Node Server',
      architecture: 'mvp',
    });

  const projectRoot = path.join(tmpDir, 'prompted-node-server');
  const packageJson = readJson<PackageJson>(
    path.join(projectRoot, 'package.json'),
  );

  yoAssert.file([
    path.join(projectRoot, 'package.json'),
    path.join(projectRoot, 'src/modules/health/health.route.ts'),
  ]);
  assert.equal(packageJson.tGenerator?.architecture, 'mvp');
});

test('fails when the Node.js target directory already exists and is not empty', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await assert.rejects(
    async () =>
      helpers
        .run(nodejsAppGeneratorPath)
        .inTmpDir((directory) => {
          tmpDir = directory;
          const targetDirectory = path.join(directory, 'existing-node-server');

          fs.mkdirSync(targetDirectory, { recursive: true });
          fs.writeFileSync(path.join(targetDirectory, 'keep.txt'), 'existing');
        })
        .withArguments(['existing-node-server'])
        .withPrompts({ architecture: 'clean' })
        .run(),
    /already exists and is not empty/,
  );

  assert.equal(
    fs.existsSync(path.join(tmpDir, 'existing-node-server', 'keep.txt')),
    true,
  );
});

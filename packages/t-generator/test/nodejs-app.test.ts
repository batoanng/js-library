import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import type { PackageJson } from '../generators/lib/types';
import {
  createYeomanTestHelpers,
  nodejsAppGeneratorPath,
  readGeneratorMetadata,
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
  '@types/jest',
  'jest',
  'ts-jest',
  'vite-tsconfig-paths',
  '@eslint/js',
  'eslint-config-prettier',
  'globals',
  'typescript-eslint',
];

test('generates the clean Node.js base app with the expected project structure', async () => {
  const { projectRoot } = await scaffoldNodeApp('starter-node', 'clean');
  const packageJson = readJson<PackageJson>(path.join(projectRoot, 'package.json'));
  const generatorMetadata = readGeneratorMetadata(projectRoot);
  const hasPackageDependency = (dependencyName: string): boolean =>
    typeof packageJson.dependencies?.[dependencyName] === 'string' ||
    typeof packageJson.devDependencies?.[dependencyName] === 'string';

  yoAssert.file([
    path.join(projectRoot, 'package.json'),
    path.join(projectRoot, 't-generator.js'),
    path.join(projectRoot, '.codex/config.toml'),
    path.join(projectRoot, '.husky/pre-push'),
    path.join(projectRoot, '.codex/skills/use-types-structures/SKILL.md'),
    path.join(projectRoot, '.codex/skills/use-types-structures/agents/openai.yaml'),
    path.join(projectRoot, 'Dockerfile'),
    path.join(projectRoot, 'README.md'),
    path.join(projectRoot, 'tsconfig.json'),
    path.join(projectRoot, 'tsconfig.test.json'),
    path.join(projectRoot, 'vite.config.ts'),
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
    path.join(projectRoot, 'src/docs/openapi.ts'),
    path.join(projectRoot, 'src/docs/swagger.ts'),
    path.join(projectRoot, 'src/domain/auth.ts'),
    path.join(projectRoot, 'src/infrastructure/prisma/prisma.ts'),
    path.join(projectRoot, 'src/infrastructure/repositories/health.repository.ts'),
    path.join(projectRoot, 'src/domain/health.ts'),
    path.join(projectRoot, 'src/usecases/auth.ts'),
    path.join(projectRoot, 'src/usecases/check-health.ts'),
    path.join(projectRoot, 'src/interfaces/controllers/auth.controller.ts'),
    path.join(projectRoot, 'src/interfaces/controllers/health.controller.ts'),
    path.join(projectRoot, 'src/interfaces/routes/auth.route.ts'),
    path.join(projectRoot, 'src/interfaces/routes/health.route.ts'),
    path.join(projectRoot, 'src/interfaces/index.ts'),
    path.join(projectRoot, 'src/shared/auth/access-auth.ts'),
    path.join(projectRoot, 'src/shared/auth/contracts.ts'),
    path.join(projectRoot, 'src/shared/auth/errors.ts'),
    path.join(projectRoot, 'src/shared/auth/index.ts'),
    path.join(projectRoot, 'src/shared/auth/tokens.ts'),
    path.join(projectRoot, 'src/shared/error-middleware.ts'),
    path.join(projectRoot, 'src/shared/graceful-shutdown.ts'),
    path.join(projectRoot, 'tests/auth.test.ts'),
    path.join(projectRoot, 'tests/docs.test.ts'),
    path.join(projectRoot, 'tests/health.test.ts'),
  ]);

  assert.deepEqual(Object.keys(packageJson.scripts || {}), [
    'postinstall',
    'start',
    'dev',
    'build',
    'lint',
    'test',
    'prepush',
    'prepare',
    'prisma:generate',
    'prisma:migrate:dev',
  ]);
  assert.equal(generatorMetadata.stack, 'nodejs');
  assert.equal(generatorMetadata.architecture, 'clean');
  assert.deepEqual(generatorMetadata.features, []);

  [
    '@batoanng/types',
    '@prisma/adapter-pg',
    '@prisma/client',
    'cors',
    'dotenv',
    'express',
    'express-rate-limit',
    'helmet',
    'hpp',
    'jsonwebtoken',
    'morgan',
    'swagger-ui-express',
    'winston',
    'zod',
  ].forEach((dependencyName) => {
    assert.equal(hasPackageDependency(dependencyName), true, `${dependencyName} should exist`);
  });
  assert.equal(packageJson.dependencies?.['@prisma/adapter-mariadb'], undefined);
  assert.equal(packageJson.scripts?.test, 'vitest run');
  assert.equal(packageJson.devDependencies?.['@batoanng/eslint-config'], '^3.4.0');
  assert.equal(packageJson.devDependencies?.['@batoanng/prettier-config'], '^1.7.1');
  assert.equal(packageJson.devDependencies?.['@batoanng/tsconfig'], '^1.6.1');
  assert.equal(packageJson.devDependencies?.['@batoanng/vite-config'], '^1.4.0');
  assert.equal(packageJson.devDependencies?.vite, '^8.0.10');
  assert.equal(packageJson.devDependencies?.vitest, '^4.1.5');
  assert.equal(packageJson.devDependencies?.['@types/swagger-ui-express'], '^4.1.8');
  assert.equal(fs.existsSync(path.join(projectRoot, 'jest.config.js')), false);

  blockedDependencies.forEach((dependencyName) => {
    assert.equal(packageJson.dependencies?.[dependencyName], undefined);
    assert.equal(packageJson.devDependencies?.[dependencyName], undefined);
  });

  yoAssert.fileContent(
    path.join(projectRoot, '.codex/skills/use-types-structures/SKILL.md'),
    'Prefer reusing that package over ad hoc arrays, objects, or one-off storage utilities',
  );
  yoAssert.fileContent(
    path.join(projectRoot, '.codex/skills/use-types-structures/agents/openai.yaml'),
    'default_prompt: "Use $use-types-structures when implementing or reviewing this feature so the solution reuses @batoanng/types where appropriate and explains the expected complexity of the critical path."',
  );
  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/starter_node?schema=public',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'vite.config.ts'),
    "import { vitestConfig } from '@batoanng/vite-config/vitest.config';",
  );
  yoAssert.fileContent(path.join(projectRoot, 'vite.config.ts'), "include: ['tests/**/*.test.ts']");
  yoAssert.fileContent(
    path.join(projectRoot, 'prettier.config.cjs'),
    "require('@batoanng/prettier-config')",
  );
  yoAssert.fileContent(path.join(projectRoot, '.env.example'), 'ACCESS_SECRET=change-me-access-secret');
  yoAssert.fileContent(path.join(projectRoot, '.env.example'), 'REFRESH_SECRET=change-me-refresh-secret');
  yoAssert.fileContent(path.join(projectRoot, '.env.example'), 'ACCESS_EXPIRES_IN=15m');
  yoAssert.fileContent(path.join(projectRoot, '.env.example'), 'REFRESH_EXPIRES_IN=7d');
  yoAssert.fileContent(path.join(projectRoot, 'prisma/schema.prisma'), "provider = 'postgresql'");
  assert.doesNotMatch(
    fs.readFileSync(path.join(projectRoot, 'prisma/schema.prisma'), 'utf8'),
    /url\s*=|provider\s*=\s*['"]mysql['"]/,
  );
  assert.doesNotMatch(
    fs.readFileSync(path.join(projectRoot, 'src/infrastructure/prisma/prisma.ts'), 'utf8'),
    /adapter-mariadb|PrismaMariaDb|mysql/i,
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/infrastructure/prisma/prisma.ts'),
    "import { PrismaPg } from '@prisma/adapter-pg';",
  );
  yoAssert.fileContent(path.join(projectRoot, 'README.md'), 'Prisma + PostgreSQL');
  assert.doesNotMatch(
    ['.env.example', 'package.json', 'prisma/schema.prisma', 'src/infrastructure/prisma/prisma.ts', 'README.md']
      .map((relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8'))
      .join('\n'),
    /adapter-mariadb|PrismaMariaDb|mysql:\/\/|provider\s*=\s*['"]mysql['"]|Prisma \+ MySQL/i,
  );
  yoAssert.fileContent(path.join(projectRoot, 'src/app.ts'), 'registerDocs(app);');
  yoAssert.fileContent(path.join(projectRoot, 'src/app.ts'), "app.use('/api/auth', authRouter);");
  yoAssert.fileContent(path.join(projectRoot, 'src/app.ts'), "app.use('/health', healthRouter);");
  yoAssert.fileContent(path.join(projectRoot, 'src/app.ts'), "import { env } from './config/env';");
  yoAssert.fileContent(path.join(projectRoot, 'src/app.ts'), "import { registerDocs } from './docs/swagger';");
  yoAssert.fileContent(path.join(projectRoot, 'src/docs/openapi.ts'), '"title": "starter-node API"');
  yoAssert.fileContent(path.join(projectRoot, 'src/docs/openapi.ts'), '"/api/auth/login"');
  yoAssert.fileContent(path.join(projectRoot, 'src/docs/swagger.ts'), "app.get('/docs'");
  yoAssert.fileContent(path.join(projectRoot, 'src/docs/swagger.ts'), "response.redirect(301, '/docs/');");
  yoAssert.fileContent(path.join(projectRoot, 'src/docs/swagger.ts'), 'swaggerUi.serve');
  yoAssert.fileContent(path.join(projectRoot, 'tests/docs.test.ts'), "get('/docs/swagger-ui-init.js')");
  yoAssert.fileContent(path.join(projectRoot, 'tests/docs.test.ts'), "headers['content-type']).toMatch(/javascript/)");
  yoAssert.fileContent(
    path.join(projectRoot, 'src/interfaces/index.ts'),
    "export { authRouter } from './routes/auth.route';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/interfaces/index.ts'),
    "export { healthRouter } from './routes/health.route';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/shared/auth/tokens.ts'),
    'accessTokenExpiresIn: env.ACCESS_EXPIRES_IN_SECONDS',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/shared/error-middleware.ts'),
    'error instanceof AuthenticationError',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'tests/auth.test.ts'),
    "import { beforeEach, describe, expect, it, vi } from 'vitest';",
  );
  yoAssert.fileContent(path.join(projectRoot, 'tests/auth.test.ts'), "post('/api/auth/login')");
  yoAssert.fileContent(path.join(projectRoot, 'tests/auth.test.ts'), "get('/api/auth/me')");
  yoAssert.fileContent(
    path.join(projectRoot, 'tests/health.test.ts'),
    "import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';",
  );
  yoAssert.fileContent(path.join(projectRoot, 'tests/health.test.ts'), 'vi.resetModules();');
  yoAssert.fileContent(
    path.join(projectRoot, 'tests/health.test.ts'),
    "const response = await request(app).get('/health');",
  );
  yoAssert.fileContent(path.join(projectRoot, 'Dockerfile'), 'RUN pnpm run prisma:generate');
  yoAssert.fileContent(path.join(projectRoot, 'Dockerfile'), 'FROM node:24-alpine AS builder');
  yoAssert.fileContent(
    path.join(projectRoot, 'Dockerfile'),
    'COPY --from=builder --chown=node:node /usr/app/prisma/ ./prisma/',
  );
  yoAssert.fileContent(path.join(projectRoot, 'Dockerfile'), 'CMD ["node", "dist/server.js"]');
  assert.doesNotMatch(fs.readFileSync(path.join(projectRoot, 'src/app.ts'), 'utf8'), /'@\//);

  assert.equal(fs.existsSync(path.join(projectRoot, 'src/modules')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/interfaces/routes/queue.route.ts')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/interfaces/graphql/register-graphql.ts')), false);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/infrastructure/redis/redis.client.ts')), false);
});

test('generates the MVP Node.js base app when selected', async () => {
  const { projectRoot } = await scaffoldNodeApp('starter-mvp', 'mvp');
  const generatorMetadata = readGeneratorMetadata(projectRoot);

  yoAssert.file([
    path.join(projectRoot, 'src/modules/auth/auth.controller.ts'),
    path.join(projectRoot, 'src/modules/auth/auth.route.ts'),
    path.join(projectRoot, 'src/modules/auth/auth.service.ts'),
    path.join(projectRoot, 'src/modules/health/health.repository.ts'),
    path.join(projectRoot, 'src/modules/health/health.service.ts'),
    path.join(projectRoot, 'src/modules/health/health.controller.ts'),
    path.join(projectRoot, 'src/modules/health/health.route.ts'),
    path.join(projectRoot, 'src/modules/index.ts'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/modules/index.ts'),
    "export { authRouter } from './auth/auth.route';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/modules/index.ts'),
    "export { healthRouter } from './health/health.route';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/modules/auth/auth.route.ts'),
    "authRouter.get('/me', requireAccessToken",
  );
  assert.doesNotMatch(fs.readFileSync(path.join(projectRoot, 'src/modules/health/health.service.ts'), 'utf8'), /'@\//);
  assert.equal(generatorMetadata.stack, 'nodejs');
  assert.equal(generatorMetadata.architecture, 'mvp');
  assert.deepEqual(generatorMetadata.features, []);
  assert.equal(fs.existsSync(path.join(projectRoot, 'src/interfaces/index.ts')), false);
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
  const generatorMetadata = readGeneratorMetadata(projectRoot);

  yoAssert.file([path.join(projectRoot, 'package.json'), path.join(projectRoot, 'src/modules/health/health.route.ts')]);
  assert.equal(generatorMetadata.architecture, 'mvp');
  assert.deepEqual(generatorMetadata.features, []);
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

  assert.equal(fs.existsSync(path.join(tmpDir, 'existing-node-server', 'keep.txt')), true);
});

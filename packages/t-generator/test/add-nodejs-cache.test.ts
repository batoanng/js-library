import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import {
  nodejsAddGeneratorPath,
  scaffoldNodeApp,
} from './helpers';

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function countOccurrences(contents: string, token: string): number {
  return contents.split(token).length - 1;
}

test('adds the cache feature to an existing MVP Node.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNodeApp(
    'starter-node-cache',
    'mvp',
  );

  await runResult
    .create(
      nodejsAddGeneratorPath,
      { cwd: projectRoot, tmpdir: false },
      undefined,
    )
    .withArguments(['cache'])
    .run();

  yoAssert.file([
    path.join(projectRoot, 'src/infrastructure/redis/redis.client.ts'),
    path.join(projectRoot, 'src/modules/cache/cache.service.ts'),
    path.join(projectRoot, 'src/modules/cache/cache.controller.ts'),
    path.join(projectRoot, 'src/modules/cache/cache.route.ts'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/modules/index.ts'),
    "export { cacheRouter } from './cache/cache.route';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app.ts'),
    "app.use('/api/cache', cacheRouter);",
  );
});

test('queue and cache compose without duplicating shared Redis env wiring', async () => {
  const { projectRoot, runResult } = await scaffoldNodeApp(
    'node-queue-cache-compose',
    'clean',
  );

  await runResult
    .create(
      nodejsAddGeneratorPath,
      { cwd: projectRoot, tmpdir: false },
      undefined,
    )
    .withArguments(['queue'])
    .run();

  await runResult
    .create(
      nodejsAddGeneratorPath,
      { cwd: projectRoot, tmpdir: false },
      undefined,
    )
    .withArguments(['cache'])
    .run();

  const envExample = readFile(path.join(projectRoot, '.env.example'));
  const appFile = readFile(path.join(projectRoot, 'src/app.ts'));

  assert.equal(countOccurrences(envExample, 'REDIS_URL='), 1);
  assert.equal(appFile.includes("app.use('/api/queue', queueRouter);"), true);
  assert.equal(appFile.includes("app.use('/api/cache', cacheRouter);"), true);
});

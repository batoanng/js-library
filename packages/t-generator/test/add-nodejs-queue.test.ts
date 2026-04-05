import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import type { PackageJson } from '../generators/lib/types';
import {
  nodejsAddGeneratorPath,
  readJson,
  scaffoldNodeApp,
} from './helpers';

test('adds the queue feature to an existing clean Node.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNodeApp(
    'starter-node-queue',
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

  const packageJson = readJson<PackageJson>(
    path.join(projectRoot, 'package.json'),
  );

  assert.equal(packageJson.dependencies?.bullmq, '^5.72.1');
  assert.equal(packageJson.dependencies?.ioredis, '^5.3.2');

  yoAssert.file([
    path.join(projectRoot, 'src/infrastructure/redis/redis.client.ts'),
    path.join(projectRoot, 'src/infrastructure/queue/demo-queue.ts'),
    path.join(projectRoot, 'src/usecases/enqueue-demo-job.ts'),
    path.join(projectRoot, 'src/interfaces/controllers/queue.controller.ts'),
    path.join(projectRoot, 'src/interfaces/routes/queue.route.ts'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'REDIS_URL=redis://localhost:6379',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app.ts'),
    "app.use('/api/queue', queueRouter);",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/server.ts'),
    'closeQueueFeature',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/server.ts'),
    'disconnectRedis',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/infrastructure/queue/demo-queue.ts'),
    "import redis from '../redis/redis.client';",
  );

  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/interfaces/routes/cache.route.ts')),
    false,
  );
});

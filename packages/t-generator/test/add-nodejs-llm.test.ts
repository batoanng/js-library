import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import type { PackageJson } from '../generators/lib/types';
import {
  nodejsAddGeneratorPath,
  readJson,
  scaffoldNodeApp,
} from './helpers';

test('adds the llm feature to an existing clean Node.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNodeApp(
    'starter-node-llm',
    'clean',
  );

  await runResult
    .create(
      nodejsAddGeneratorPath,
      { cwd: projectRoot, tmpdir: false },
      undefined,
    )
    .withArguments(['llm'])
    .run();

  const packageJson = readJson<PackageJson>(
    path.join(projectRoot, 'package.json'),
  );

  assert.equal(packageJson.dependencies?.openai, '^6.33.0');
  yoAssert.file([
    path.join(projectRoot, 'src/infrastructure/llm/openai.client.ts'),
    path.join(projectRoot, 'src/usecases/run-llm-demo.ts'),
    path.join(projectRoot, 'src/interfaces/controllers/llm.controller.ts'),
    path.join(projectRoot, 'src/interfaces/routes/llm.route.ts'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'OPENAI_API_KEY=sk-proj-...',
  );
  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'OPENAI_MODEL=gpt-5',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app.ts'),
    "app.use('/api/llm', llmRouter);",
  );
});

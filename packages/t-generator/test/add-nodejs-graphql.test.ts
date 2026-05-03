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

test('adds the graphql feature to an existing clean Node.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNodeApp(
    'starter-node-graphql',
    'clean',
  );

  await runResult
    .create(
      nodejsAddGeneratorPath,
      { cwd: projectRoot, tmpdir: false },
      undefined,
    )
    .withArguments(['graphql'])
    .run();

  const packageJson = readJson<PackageJson>(
    path.join(projectRoot, 'package.json'),
  );

  assert.equal(packageJson.dependencies?.graphql, '^16.13.2');
  assert.equal(packageJson.dependencies?.['graphql-http'], '^1.22.4');

  yoAssert.file([
    path.join(projectRoot, 'src/interfaces/graphql/register-graphql.ts'),
    path.join(projectRoot, 'src/usecases/get-graphql-demo.ts'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/interfaces/index.ts'),
    "export { registerGraphql } from './graphql/register-graphql';",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app.ts'),
    'await registerGraphql(app);',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/interfaces/graphql/register-graphql.ts'),
    "app.use(",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/interfaces/graphql/register-graphql.ts'),
    "'/api/graphql'",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/interfaces/graphql/register-graphql.ts'),
    "import { getGraphqlDemo } from '../../usecases/get-graphql-demo';",
  );

  assert.equal(
    fs.existsSync(path.join(projectRoot, 'src/interfaces/routes/queue.route.ts')),
    false,
  );
});

test('prompt-based add can select the graphql feature for an MVP Node.js server', async () => {
  const { projectRoot, runResult } = await scaffoldNodeApp(
    'prompted-node-graphql',
    'mvp',
  );

  await runResult
    .create(
      nodejsAddGeneratorPath,
      { cwd: projectRoot, tmpdir: false },
      undefined,
    )
    .withPrompts({ featureName: 'graphql' })
    .run();

  yoAssert.file([
    path.join(projectRoot, 'src/modules/graphql/register-graphql.ts'),
    path.join(projectRoot, 'src/modules/graphql/graphql.service.ts'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/modules/graphql/register-graphql.ts'),
    "import { GraphqlService } from './graphql.service';",
  );
});

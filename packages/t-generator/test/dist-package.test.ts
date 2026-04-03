import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import type { PackageJson } from '../generators/lib/types';
import {
  createYeomanTestHelpers,
  nestjsAddGeneratorPath,
  nestjsAppGeneratorPath,
  reactAddGeneratorPath,
  reactAppGeneratorPath,
  readJson,
  readText,
} from './helpers';

const packageSmokeTest = process.env.DIST_SMOKE === '1' ? test : test.skip;

packageSmokeTest(
  'built root package keeps the expected Yeoman layout',
  async () => {
    const packageRoot = path.join(__dirname, '..');
    const packageJson = readJson<PackageJson>(path.join(packageRoot, 'package.json'));

    yoAssert.file([
      path.join(packageRoot, 'README.md'),
      path.join(packageRoot, 'package.json'),
      path.join(packageRoot, 'generators/index.js'),
      path.join(packageRoot, 'generators/react-app/index.js'),
      path.join(packageRoot, 'generators/react-app/templates/package.json.ejs'),
      path.join(packageRoot, 'generators/react-add/index.js'),
      path.join(packageRoot, 'generators/react-add/templates/auth/_env.example.ejs'),
      path.join(packageRoot, 'generators/nestjs-app/index.js'),
      path.join(packageRoot, 'generators/nestjs-add/index.js'),
      path.join(
        packageRoot,
        'generators/react-add/templates/apollo/src/shared/apollo/ApolloWithAuthProvider.tsx.ejs',
      ),
      path.join(
        packageRoot,
        'generators/react-add/templates/bff/server/server.js.ejs',
      ),
      path.join(packageRoot, 'generators/react-add/templates/pwa/vite.config.ts.ejs'),
      path.join(
        packageRoot,
        'generators/react-add/templates/redux/src/app/store/index.ts.ejs',
      ),
      path.join(
        packageRoot,
        'generators/react-add/templates/react-query/src/shared/api/useApiQuery.ts.ejs',
      ),
    ]);

    assert.equal(packageJson.main, 'generators/index.js');
    assert.deepEqual(packageJson.files, [
      'generators/**/*.js',
      'generators/**/templates/**',
      'README.md',
      'CHANGELOG.md',
    ]);
    assert.match(
      readText(path.join(packageRoot, 'README.md')),
      /## Using the published npm package/,
    );

    let tmpDir = '';
    const helpers = await createYeomanTestHelpers();

    const runResult = await helpers
      .run(reactAppGeneratorPath)
      .inTmpDir((directory) => {
        tmpDir = directory;
      })
      .withArguments(['dist-smoke']);

    const projectRoot = path.join(tmpDir, 'dist-smoke');

    yoAssert.file([path.join(projectRoot, 'package.json')]);

    await runResult
      .create(
        reactAddGeneratorPath,
        { cwd: projectRoot, tmpdir: false },
        undefined,
      )
      .withArguments(['pwa'])
      .run();

    yoAssert.file([
      path.join(projectRoot, 'src/features/pwa/index.ts'),
      path.join(projectRoot, 'src/pages/pwa/index.ts'),
    ]);

    let reactTmpDir = '';
    const reactRunResult = await helpers
      .run(reactAppGeneratorPath)
      .inTmpDir((directory) => {
        reactTmpDir = directory;
      })
      .withArguments(['explicit-react']);

    const explicitReactRoot = path.join(reactTmpDir, 'explicit-react');

    await reactRunResult
      .create(
        reactAddGeneratorPath,
        { cwd: explicitReactRoot, tmpdir: false },
        undefined,
      )
      .withArguments(['auth'])
      .run();

    yoAssert.file([
      path.join(explicitReactRoot, 'src/pages/auth/index.ts'),
      path.join(
        explicitReactRoot,
        'src/app/providers/auth/Auth0ProviderWithNavigate.tsx',
      ),
    ]);

    let nestTmpDir = '';
    const nestRunResult = await helpers
      .run(nestjsAppGeneratorPath)
      .inTmpDir((directory) => {
        nestTmpDir = directory;
      })
      .withArguments(['dist-nest']);

    yoAssert.file([
      path.join(nestTmpDir, 'dist-nest/package.json'),
      path.join(nestTmpDir, 'dist-nest/src/server.ts'),
      path.join(nestTmpDir, 'dist-nest/prisma/schema.prisma'),
    ]);

    await nestRunResult
      .create(
        nestjsAddGeneratorPath,
        { cwd: path.join(nestTmpDir, 'dist-nest'), tmpdir: false },
        undefined,
      )
      .withArguments(['queue'])
      .run();

    yoAssert.file([
      path.join(nestTmpDir, 'dist-nest/src/modules/queue/queue.module.ts'),
      path.join(nestTmpDir, 'dist-nest/src/modules/queue/queue.service.ts'),
    ]);
  },
);

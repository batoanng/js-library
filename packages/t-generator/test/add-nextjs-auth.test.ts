import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import yoAssert from 'yeoman-assert';

import type { PackageJson } from '../generators/lib/types';
import {
  createYeomanTestHelpers,
  nextjsAddGeneratorPath,
  readJson,
  scaffoldNextjsApp,
} from './helpers';

test('adds the auth feature to an existing generated Next.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('next-auth');

  await runResult
    .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['auth'])
    .run();

  const packageJson = readJson<PackageJson>(path.join(projectRoot, 'package.json'));

  assert.equal(packageJson.dependencies?.['@auth0/nextjs-auth0'], '^4.9.0');

  yoAssert.file([
    path.join(projectRoot, 'src/lib/auth0.ts'),
    path.join(projectRoot, 'src/middleware.ts'),
    path.join(projectRoot, 'src/app/auth/page.tsx'),
    path.join(projectRoot, 'src/pages/auth/index.ts'),
    path.join(projectRoot, 'src/pages/auth/ui/AuthPage.tsx'),
    path.join(projectRoot, 'src/pages/auth/ui/AuthPage.test.tsx'),
  ]);

  yoAssert.fileContent(path.join(projectRoot, '.env.example'), 'AUTH0_CLIENT_SECRET=');
  yoAssert.fileContent(path.join(projectRoot, '.env.example'), 'NEXT_PUBLIC_AUTH0_DOMAIN=');
  yoAssert.fileContent(
    path.join(projectRoot, 'src/pages/home/ui/HomePage.tsx'),
    'Open the authentication example',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/pages/auth/ui/AuthPage.tsx'),
    'Auth0 route handling is ready',
  );
});

test('prompt-based add can select the Tailwind feature for Next.js', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('next-prompt-tailwind');

  await runResult
    .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withPrompts({ featureName: 'tailwind' })
    .run();

  yoAssert.file([
    path.join(projectRoot, 'postcss.config.js'),
    path.join(projectRoot, 'src/app/globals.css'),
  ]);
});

test('adds the ui-library feature to an existing generated Next.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('next-ui-library');

  await runResult
    .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['ui-library'])
    .run();

  const packageJson = readJson<PackageJson>(path.join(projectRoot, 'package.json'));

  assert.equal(packageJson.dependencies?.['@mui/material-nextjs'], '6.1.8');
  yoAssert.file([
    path.join(projectRoot, 'src/widgets/ui-library-showcase/index.ts'),
    path.join(projectRoot, 'src/widgets/ui-library-showcase/ui/UiLibraryShowcase.tsx'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    'AppRouterCacheProvider',
  );
});

test('adds the redux feature to an existing generated Next.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('next-redux');

  await runResult
    .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['redux'])
    .run();

  const packageJson = readJson<PackageJson>(path.join(projectRoot, 'package.json'));

  assert.equal(packageJson.dependencies?.['@reduxjs/toolkit'], '^2.2.7');
  yoAssert.file([
    path.join(projectRoot, 'src/app/store/index.ts'),
    path.join(projectRoot, 'src/pages/redux/ui/ReduxPage.tsx'),
    path.join(projectRoot, 'src/app/redux/page.tsx'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, '.env.example'),
    'NEXT_PUBLIC_ENABLE_REDUX_LOGGING=false',
  );
});

test('adds the react-query feature to an existing generated Next.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('next-react-query');

  await runResult
    .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['react-query'])
    .run();

  const packageJson = readJson<PackageJson>(path.join(projectRoot, 'package.json'));

  assert.equal(packageJson.dependencies?.['@tanstack/react-query'], '^5.59.16');
  yoAssert.file([
    path.join(projectRoot, 'src/shared/api/createQueryClient.ts'),
    path.join(projectRoot, 'src/features/react-query-demo/api/useSampleGetQuery.ts'),
    path.join(projectRoot, 'src/features/react-query-demo/api/useSamplePostMutation.ts'),
    path.join(projectRoot, 'src/pages/react-query/ui/ReactQueryPage.tsx'),
    path.join(projectRoot, 'src/app/react-query/page.tsx'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    'QueryClientProvider',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/features/react-query-demo/model/CacheKeys.ts'),
    "sampleGet: 'sample-get'",
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/features/react-query-demo/model/CacheKeys.ts'),
    "samplePost: 'sample-post'",
  );
  assert.equal(
    fs.existsSync(
      path.join(projectRoot, 'src/features/react-query-demo/api/useGetChatMessages.ts'),
    ),
    false,
  );
  assert.equal(
    fs.existsSync(
      path.join(projectRoot, 'src/features/react-query-demo/api/useCallChatMutation.ts'),
    ),
    false,
  );
});

test('adds the apollo feature to an existing generated Next.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('next-apollo');

  await runResult
    .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['apollo'])
    .run();

  const packageJson = readJson<PackageJson>(path.join(projectRoot, 'package.json'));

  assert.equal(packageJson.dependencies?.['@apollo/client'], '^4.1.6');
  yoAssert.file([
    path.join(projectRoot, 'src/shared/apollo/ApolloAppProvider.tsx'),
    path.join(projectRoot, 'src/pages/apollo/ui/ApolloPage.tsx'),
    path.join(projectRoot, 'src/app/apollo/page.tsx'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/shared/apollo/index.ts'),
    'ApolloAppProvider',
  );
});

test('adds the pwa feature to an existing generated Next.js base app', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('next-pwa');

  await runResult
    .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['pwa'])
    .run();

  yoAssert.file([
    path.join(projectRoot, 'src/features/pwa/PwaClient.tsx'),
    path.join(projectRoot, 'src/app/manifest.ts'),
    path.join(projectRoot, 'src/app/pwa/page.tsx'),
    path.join(projectRoot, 'public/sw.js'),
    path.join(projectRoot, 'public/pwa-icon.svg'),
  ]);
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    'PwaClient',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/pages/home/ui/HomePage.tsx'),
    'Open the PWA example',
  );
});

test('tailwind composes with ui-library in a generated Next.js app', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('next-ui-tailwind');

  await runResult
    .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['ui-library'])
    .run();

  await runResult
    .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
    .withArguments(['tailwind'])
    .run();

  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/providers/AppProviders.tsx'),
    'enableCssLayer: true',
  );
  yoAssert.fileContent(
    path.join(projectRoot, 'src/app/globals.css'),
    '@layer theme, base, mui, components, utilities;',
  );
});

test('fails when nextjs-add is run outside a generated Next.js base project', async () => {
  let tmpDir = '';
  const helpers = await createYeomanTestHelpers();

  await assert.rejects(
    async () =>
      helpers
        .run(nextjsAddGeneratorPath)
        .inTmpDir((directory) => {
          tmpDir = directory;
          fs.writeFileSync(
            path.join(directory, 'package.json'),
            JSON.stringify(
              {
                name: 'custom-next-app',
                scripts: {
                  dev: 'next dev',
                  build: 'next build',
                  start: 'next start',
                  analyze: 'ANALYZE=true next build',
                  lint: 'eslint .',
                  test: 'jest',
                  'type-check': 'tsc --noEmit',
                },
              },
              null,
              2,
            ),
          );
        })
        .withArguments(['auth'])
        .run(),
    /Auth can only be generated inside a t-generator Next\.js app/,
  );

  assert.equal(fs.existsSync(path.join(tmpDir, 'src/pages/auth')), false);
});

test('fails clearly when Next.js bff is requested', async () => {
  const { projectRoot, runResult } = await scaffoldNextjsApp('next-unknown-feature');

  await assert.rejects(
    runResult
      .create(nextjsAddGeneratorPath, { cwd: projectRoot, tmpdir: false }, undefined)
      .withArguments(['bff'])
      .run(),
    /Supported features: tailwind, ui-library, auth, redux, react-query, apollo, pwa/,
  );
});

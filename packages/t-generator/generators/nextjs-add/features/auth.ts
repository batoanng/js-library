import fs from 'node:fs';

import { addManagedFile, hasPackageDependency } from '../lib/helpers';
import type { FeatureDefinition } from '../lib/types';

const AUTH_NEW_FILES = [
  addManagedFile('src/lib/auth0.ts', 'auth/src/lib/auth0.ts.ejs'),
  addManagedFile('src/middleware.ts', 'auth/src/middleware.ts.ejs'),
  addManagedFile('src/pages/auth/index.ts', 'auth/src/pages/auth/index.ts.ejs'),
  addManagedFile(
    'src/pages/auth/ui/AuthPage.tsx',
    'auth/src/pages/auth/ui/AuthPage.tsx.ejs',
  ),
  addManagedFile(
    'src/pages/auth/ui/AuthPage.test.tsx',
    'auth/src/pages/auth/ui/AuthPage.test.tsx.ejs',
  ),
  addManagedFile('src/app/auth/page.tsx', 'auth/src/app/auth/page.tsx.ejs'),
];

const AUTH_DEPENDENCIES = {
  '@auth0/nextjs-auth0': '^4.9.0',
};

const AUTH_MANAGED_PATHS = [
  'src/lib/auth0.ts',
  'src/middleware.ts',
  'src/pages/auth',
  'src/app/auth',
] as const;

function isAuthInstalled(
  generator: Parameters<FeatureDefinition['validate']>[0],
): boolean {
  return (
    hasPackageDependency(generator.rootPackageJson, '@auth0/nextjs-auth0') ||
    AUTH_MANAGED_PATHS.some((managedPath) =>
      fs.existsSync(generator.destinationPath(managedPath)),
    )
  );
}

const authFeature: FeatureDefinition = {
  name: 'auth',
  label: 'Auth',
  isInstalled(generator) {
    return isAuthInstalled(generator);
  },
  validate(generator) {
    if (isAuthInstalled(generator)) {
      throw new Error(
        'Auth generation aborted because package.json already defines "@auth0/nextjs-auth0".',
      );
    }

    const existingPaths = AUTH_MANAGED_PATHS.filter((managedPath) =>
      fs.existsSync(generator.destinationPath(managedPath)),
    );

    if (existingPaths.length > 0) {
      throw new Error(
        `Auth generation aborted because these managed paths already exist: ${existingPaths.join(', ')}.`,
      );
    }

    generator._validateSharedScaffold('Auth', generator.installedFeatures);
  },
  write(generator) {
    generator._writeDependencies(AUTH_DEPENDENCIES);
    generator._writeSharedScaffold({
      ...generator.installedFeatures,
      auth: true,
    });
    generator._writeManagedFiles(AUTH_NEW_FILES);
  },
  end(generator) {
    generator.log('Auth feature scaffolded in "./src/pages/auth".');
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  Add Auth0 values to .env.local');
    generator.log('  npm run dev');
    generator.log('  Open /auth');
  },
};

export = authFeature;

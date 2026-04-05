import fs from 'node:fs';

import { addManagedFile, hasPackageDependency } from '../lib/helpers';
import type { FeatureDefinition } from '../lib/types';

const REDUX_NEW_FILES = [
  addManagedFile('src/app/store/index.ts', 'redux/src/app/store/index.ts.ejs'),
  addManagedFile(
    'src/app/store/GlobalSlice.ts',
    'redux/src/app/store/GlobalSlice.ts.ejs',
  ),
  addManagedFile(
    'src/app/store/actions.ts',
    'redux/src/app/store/actions.ts.ejs',
  ),
  addManagedFile(
    'src/pages/redux/index.ts',
    'redux/src/pages/redux/index.ts.ejs',
  ),
  addManagedFile(
    'src/pages/redux/ui/ReduxPage.tsx',
    'redux/src/pages/redux/ui/ReduxPage.tsx.ejs',
  ),
  addManagedFile(
    'src/pages/redux/ui/ReduxPage.test.tsx',
    'redux/src/pages/redux/ui/ReduxPage.test.tsx.ejs',
  ),
  addManagedFile('src/app/redux/page.tsx', 'redux/src/app/redux/page.tsx.ejs'),
];

const REDUX_DEPENDENCIES = {
  '@reduxjs/toolkit': '^2.2.7',
  'react-redux': '^8.0.2',
  redux: '^4.2.0',
  'redux-persist': '^6.0.0',
};

const REDUX_DEV_DEPENDENCIES = {
  '@types/redux-immutable-state-invariant': '^2.1.4',
  '@types/redux-logger': '^3.0.13',
  'redux-immutable-state-invariant': '^2.1.0',
  'redux-logger': '^3.0.6',
};

const REDUX_MANAGED_PATHS = [
  'src/app/store',
  'src/pages/redux',
  'src/app/redux',
] as const;
const REDUX_GUARD_DEPENDENCIES = [
  '@reduxjs/toolkit',
  'react-redux',
  'redux',
  'redux-persist',
  'redux-immutable-state-invariant',
  'redux-logger',
] as const;

const reduxFeature: FeatureDefinition = {
  name: 'redux',
  label: 'Redux',
  isInstalled(generator) {
    return (
      REDUX_GUARD_DEPENDENCIES.some((dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
      ) ||
      REDUX_MANAGED_PATHS.some((managedPath) =>
        fs.existsSync(generator.destinationPath(managedPath)),
      )
    );
  },
  validate(generator) {
    const existingDependencies = REDUX_GUARD_DEPENDENCIES.filter(
      (dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
    );

    if (existingDependencies.length > 0) {
      throw new Error(
        `Redux generation aborted because package.json already defines: ${existingDependencies.join(', ')}.`,
      );
    }

    const existingPaths = REDUX_MANAGED_PATHS.filter((managedPath) =>
      fs.existsSync(generator.destinationPath(managedPath)),
    );

    if (existingPaths.length > 0) {
      throw new Error(
        `Redux generation aborted because these managed paths already exist: ${existingPaths.join(', ')}.`,
      );
    }

    generator._validateSharedScaffold('Redux', generator.installedFeatures);
  },
  write(generator) {
    generator._writeDependencies(REDUX_DEPENDENCIES);
    generator._writeDevDependencies(REDUX_DEV_DEPENDENCIES);
    generator._writeSharedScaffold({
      ...generator.installedFeatures,
      redux: true,
    });
    generator._writeManagedFiles(REDUX_NEW_FILES);
  },
  end(generator) {
    generator.log('Redux feature scaffolded in "./src/app/store".');
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  npm run dev');
    generator.log('  Open /redux');
  },
};

export = reduxFeature;

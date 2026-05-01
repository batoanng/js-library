import fs from 'node:fs';

import { addManagedFile, hasPackageDependency } from '../lib/helpers';
import type { FeatureDefinition } from '../lib/types';

const UI_LIBRARY_NEW_FILES = [
  addManagedFile(
    'src/app/styles/global.css',
    'ui-library/src/app/styles/global.css.ejs',
  ),
  addManagedFile(
    'src/widgets/ui-library-showcase/index.ts',
    'ui-library/src/widgets/ui-library-showcase/index.ts.ejs',
  ),
  addManagedFile(
    'src/widgets/ui-library-showcase/ui/UiLibraryShowcase.tsx',
    'ui-library/src/widgets/ui-library-showcase/ui/UiLibraryShowcase.tsx.ejs',
  ),
];

const UI_LIBRARY_DEPENDENCIES = {
  '@batoanng/mui-components': '^3.6.0',
  '@emotion/react': '^11.14.0',
  '@emotion/styled': '^11.14.1',
  '@mui/icons-material': '9.0.0',
  '@mui/material': '9.0.0',
  '@mui/utils': '^9.0.0',
  '@mui/x-date-pickers': '9.0.4',
  'framer-motion': '^12.38.0',
  'react-dropzone': '^15.0.0',
  'react-easy-crop': '^5.5.7',
  'react-hook-form': '7.74.0',
  'react-idle-timer': '^5.7.3',
};

const UI_LIBRARY_MANAGED_DIRECTORY = 'src/widgets/ui-library-showcase';

function isUiLibraryInstalled(generator: Parameters<FeatureDefinition['validate']>[0]): boolean {
  return (
    hasPackageDependency(
      generator.rootPackageJson,
      '@batoanng/mui-components',
    ) ||
    fs.existsSync(generator.destinationPath(UI_LIBRARY_MANAGED_DIRECTORY))
  );
}

const uiLibraryFeature: FeatureDefinition = {
  name: 'ui-library',
  label: 'UI library',
  isInstalled(generator) {
    return isUiLibraryInstalled(generator);
  },
  validate(generator) {
    if (isUiLibraryInstalled(generator)) {
      throw new Error(
        'UI library generation aborted because package.json already defines "@batoanng/mui-components".',
      );
    }

    if (
      fs.existsSync(generator.destinationPath(UI_LIBRARY_MANAGED_DIRECTORY))
    ) {
      throw new Error(
        `UI library generation aborted because "${UI_LIBRARY_MANAGED_DIRECTORY}/" already exists.`,
      );
    }

    generator._validateSharedScaffold('UI library', generator.installedFeatures);
  },
  write(generator) {
    generator._writeDependencies(UI_LIBRARY_DEPENDENCIES);
    generator._writeSharedScaffold({
      ...generator.installedFeatures,
      uiLibrary: true,
    });
    generator._writeManagedFiles(UI_LIBRARY_NEW_FILES);
  },
  end(generator) {
    generator.log(
      'UI library feature with theme wiring scaffolded in "./src/widgets/ui-library-showcase".',
    );
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  npm run dev');
  },
};

export default uiLibraryFeature;

import fs from 'node:fs';

import {
  buildPwaManagedFiles,
  PWA_MANAGED_PATHS,
} from '../lib/pwa-scaffold';
import type { FeatureDefinition } from '../lib/types';

const pwaFeature: FeatureDefinition = {
  name: 'pwa',
  label: 'PWA',
  isInstalled(generator) {
    return PWA_MANAGED_PATHS.some((managedPath) =>
      fs.existsSync(generator.destinationPath(managedPath)),
    );
  },
  validate(generator) {
    const existingPaths = PWA_MANAGED_PATHS.filter((managedPath) =>
      fs.existsSync(generator.destinationPath(managedPath)),
    );

    if (existingPaths.length > 0) {
      throw new Error(
        `PWA generation aborted because these managed paths already exist: ${existingPaths.join(', ')}.`,
      );
    }

    generator._validateSharedScaffold('PWA', generator.installedFeatures);
  },
  write(generator) {
    generator._writeSharedScaffold({
      ...generator.installedFeatures,
      pwa: true,
    });
    generator._writeManagedFiles(buildPwaManagedFiles());
  },
  end(generator) {
    generator.log('PWA feature scaffolded in "./src/pages/pwa".');
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  npm run dev');
    generator.log('  Open /pwa');
  },
};

export = pwaFeature;

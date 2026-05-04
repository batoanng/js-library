import fs from 'node:fs';

import { NODEJS_CACHE_DEPENDENCIES } from '../../nodejs-app/lib/shared-scaffold';
import {
  buildCacheFeatureFiles,
  getCacheManagedPaths,
} from '../lib/feature-scaffolds';
import type { NodeServerFeatureDefinition } from '../lib/types';

const cacheFeature: NodeServerFeatureDefinition = {
  name: 'cache',
  label: 'Cache',
  isInstalled(generator) {
    return getCacheManagedPaths(generator.architecture).some((managedPath) =>
      fs.existsSync(generator.destinationPath(managedPath)),
    );
  },
  validate(generator) {
    const existingPaths = getCacheManagedPaths(generator.architecture).filter(
      (managedPath) => fs.existsSync(generator.destinationPath(managedPath)),
    );

    if (existingPaths.length > 0) {
      throw new Error(
        `Cache generation aborted because these managed paths already exist: ${existingPaths.join(', ')}.`,
      );
    }

    generator._validateSharedScaffold('Cache', generator.installedFeatures);
    generator._validateArchitectureScaffold('Cache', generator.installedFeatures);
  },
  write(generator) {
    const nextFeatures = {
      ...generator.installedFeatures,
      cache: true,
    };

    generator._writeDependencies(NODEJS_CACHE_DEPENDENCIES);
    generator._writeSharedScaffold(nextFeatures);
    generator._writeArchitectureScaffold(nextFeatures);
    generator._writeFiles(buildCacheFeatureFiles(generator.templateContext));
  },
  end(generator) {
    generator.log('Cache feature scaffolded at "./src".');
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  npm run dev');
    generator.log('  POST /api/cache/demo');
  },
};

export default cacheFeature;

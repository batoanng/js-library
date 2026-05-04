import fs from 'node:fs';

import { NODEJS_QUEUE_DEPENDENCIES } from '../../nodejs-app/lib/shared-scaffold';
import {
  buildQueueFeatureFiles,
  getQueueManagedPaths,
  QUEUE_GUARD_DEPENDENCIES,
} from '../lib/feature-scaffolds';
import { hasPackageDependency } from '../lib/helpers';
import type { NodeServerFeatureDefinition } from '../lib/types';

const queueFeature: NodeServerFeatureDefinition = {
  name: 'queue',
  label: 'Queue',
  isInstalled(generator) {
    return (
      QUEUE_GUARD_DEPENDENCIES.some((dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
      ) ||
      getQueueManagedPaths(generator.architecture).some((managedPath) =>
        fs.existsSync(generator.destinationPath(managedPath)),
      )
    );
  },
  validate(generator) {
    const existingDependencies = QUEUE_GUARD_DEPENDENCIES.filter(
      (dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
    );

    if (existingDependencies.length > 0) {
      throw new Error(
        `Queue generation aborted because package.json already defines: ${existingDependencies.join(', ')}.`,
      );
    }

    const existingPaths = getQueueManagedPaths(generator.architecture).filter(
      (managedPath) => fs.existsSync(generator.destinationPath(managedPath)),
    );

    if (existingPaths.length > 0) {
      throw new Error(
        `Queue generation aborted because these managed paths already exist: ${existingPaths.join(', ')}.`,
      );
    }

    generator._validateSharedScaffold('Queue', generator.installedFeatures);
    generator._validateArchitectureScaffold('Queue', generator.installedFeatures);
  },
  write(generator) {
    const nextFeatures = {
      ...generator.installedFeatures,
      queue: true,
    };

    generator._writeDependencies(NODEJS_QUEUE_DEPENDENCIES);
    generator._writeSharedScaffold(nextFeatures);
    generator._writeArchitectureScaffold(nextFeatures);
    generator._writeFiles(buildQueueFeatureFiles(generator.templateContext));
  },
  end(generator) {
    generator.log('Queue feature scaffolded at "./src".');
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  npm run dev');
    generator.log('  POST /api/queue/demo');
  },
};

export default queueFeature;

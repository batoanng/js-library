import fs from 'node:fs';

import { NODEJS_LLM_DEPENDENCIES } from '../../nodejs-app/lib/shared-scaffold';
import {
  buildLlmFeatureFiles,
  getLlmManagedPaths,
  LLM_GUARD_DEPENDENCIES,
} from '../lib/feature-scaffolds';
import { hasPackageDependency } from '../lib/helpers';
import type { NodeServerFeatureDefinition } from '../lib/types';

const llmFeature: NodeServerFeatureDefinition = {
  name: 'llm',
  label: 'LLM',
  isInstalled(generator) {
    return (
      LLM_GUARD_DEPENDENCIES.some((dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
      ) ||
      getLlmManagedPaths(generator.architecture).some((managedPath) =>
        fs.existsSync(generator.destinationPath(managedPath)),
      )
    );
  },
  validate(generator) {
    const existingDependencies = LLM_GUARD_DEPENDENCIES.filter(
      (dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
    );

    if (existingDependencies.length > 0) {
      throw new Error(
        `LLM generation aborted because package.json already defines: ${existingDependencies.join(', ')}.`,
      );
    }

    const existingPaths = getLlmManagedPaths(generator.architecture).filter(
      (managedPath) => fs.existsSync(generator.destinationPath(managedPath)),
    );

    if (existingPaths.length > 0) {
      throw new Error(
        `LLM generation aborted because these managed paths already exist: ${existingPaths.join(', ')}.`,
      );
    }

    generator._validateSharedScaffold('LLM', generator.installedFeatures);
    generator._validateArchitectureScaffold('LLM', generator.installedFeatures);
  },
  write(generator) {
    const nextFeatures = {
      ...generator.installedFeatures,
      llm: true,
    };

    generator._writeDependencies(NODEJS_LLM_DEPENDENCIES);
    generator._writeSharedScaffold(nextFeatures);
    generator._writeArchitectureScaffold(nextFeatures);
    generator._writeFiles(buildLlmFeatureFiles(generator.templateContext));
  },
  end(generator) {
    generator.log('LLM feature scaffolded at "./src".');
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  npm run dev');
    generator.log('  POST /api/llm/demo');
  },
};

export default llmFeature;

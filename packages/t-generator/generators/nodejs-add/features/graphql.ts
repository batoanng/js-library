import fs from 'node:fs';

import { NODEJS_GRAPHQL_DEPENDENCIES } from '../../nodejs-app/lib/shared-scaffold';
import {
  buildGraphqlFeatureFiles,
  getGraphqlManagedPaths,
  GRAPHQL_GUARD_DEPENDENCIES,
} from '../lib/feature-scaffolds';
import { hasPackageDependency } from '../lib/helpers';
import type { NodeServerFeatureDefinition } from '../lib/types';

const graphqlFeature: NodeServerFeatureDefinition = {
  name: 'graphql',
  label: 'GraphQL',
  isInstalled(generator) {
    return (
      GRAPHQL_GUARD_DEPENDENCIES.some((dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
      ) ||
      getGraphqlManagedPaths(generator.architecture).some((managedPath) =>
        fs.existsSync(generator.destinationPath(managedPath)),
      )
    );
  },
  validate(generator) {
    const existingDependencies = GRAPHQL_GUARD_DEPENDENCIES.filter(
      (dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
    );

    if (existingDependencies.length > 0) {
      throw new Error(
        `GraphQL generation aborted because package.json already defines: ${existingDependencies.join(', ')}.`,
      );
    }

    const existingPaths = getGraphqlManagedPaths(generator.architecture).filter(
      (managedPath) => fs.existsSync(generator.destinationPath(managedPath)),
    );

    if (existingPaths.length > 0) {
      throw new Error(
        `GraphQL generation aborted because these managed paths already exist: ${existingPaths.join(', ')}.`,
      );
    }

    generator._validateSharedScaffold('GraphQL', generator.installedFeatures);
    generator._validateArchitectureScaffold(
      'GraphQL',
      generator.installedFeatures,
    );
  },
  write(generator) {
    const nextFeatures = {
      ...generator.installedFeatures,
      graphql: true,
    };

    generator._writeDependencies(NODEJS_GRAPHQL_DEPENDENCIES);
    generator._writeSharedScaffold(nextFeatures);
    generator._writeArchitectureScaffold(nextFeatures);
    generator._writeFiles(buildGraphqlFeatureFiles(generator.templateContext));
  },
  end(generator) {
    generator.log('GraphQL feature scaffolded at "./src".');
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  npm run dev');
    generator.log('  POST /api/graphql');
  },
};

export default graphqlFeature;

import fs from 'node:fs';
import path from 'node:path';

import GeneratorBase from 'yeoman-generator';

import type { PackageJson } from '../lib/types';
import { buildNodeServerArchitectureScaffold } from '../nodejs-app/lib/architecture-scaffold';
import {
  buildNodeServerPackageJson,
  buildNodeServerSharedScaffold,
} from '../nodejs-app/lib/shared-scaffold';
import type {
  InstalledNodeServerFeatures,
  NodeArchitecture,
  NodeServerTemplateContext,
} from '../nodejs-app/lib/types';
import cacheFeature from './features/cache';
import graphqlFeature from './features/graphql';
import llmFeature from './features/llm';
import queueFeature from './features/queue';
import { REQUIRED_BASE_FILES, REQUIRED_BASE_SCRIPTS } from './lib/constants';
import {
  hasPackageDependency,
  normalizeFeatureName,
  normalizeLineEndings,
  readJson,
  readNodeArchitecture,
  readNodeServerDisplayName,
  toDisplayName,
} from './lib/helpers';
import type {
  NodeServerAddGeneratorContext,
  NodeServerFeatureDefinition,
} from './lib/types';

interface NodeAddGeneratorOptions extends GeneratorBase.GeneratorOptions {
  featureName?: string;
}

interface FeaturePromptAnswers extends GeneratorBase.Answers {
  featureName: string;
}

const FEATURES = [graphqlFeature, queueFeature, cacheFeature, llmFeature];
const FEATURE_BY_NAME = new Map<string, NodeServerFeatureDefinition>(
  FEATURES.map((featureDefinition) => [
    featureDefinition.name,
    featureDefinition,
  ]),
);
const FEATURE_PROMPT_CHOICES = [
  {
    name: 'GraphQL',
    value: 'graphql',
    hint: 'Adds a GraphQL endpoint at /api/graphql alongside the REST server.',
  },
  {
    name: 'Queue (BullMQ)',
    value: 'queue',
    hint: 'Adds Redis-backed BullMQ infrastructure and a demo enqueue endpoint.',
  },
  {
    name: 'Cache (Redis)',
    value: 'cache',
    hint: 'Adds Redis cache helpers plus demo set/get REST endpoints.',
  },
  {
    name: 'LLM (OpenAI)',
    value: 'llm',
    hint: 'Adds OpenAI client wiring and a demo REST endpoint.',
  },
] as const;
const SUPPORTED_FEATURES = FEATURE_PROMPT_CHOICES.map(
  (choice) => choice.value,
);

function getFeatureLabel(featureName: string): string {
  return FEATURE_BY_NAME.get(featureName)?.label || `Feature "${featureName}"`;
}

class NodeAddGenerator
  extends GeneratorBase
  implements NodeServerAddGeneratorContext
{
  declare options: GeneratorBase['options'] & NodeAddGeneratorOptions;

  featureName!: string;

  featureDefinition!: NodeServerFeatureDefinition;

  projectRoot!: string;

  packageJsonPath!: string;

  rootPackageJson!: PackageJson;

  appName!: string;

  appDisplayName!: string;

  architecture!: NodeArchitecture;

  templateContext!: NodeServerTemplateContext;

  installedFeatures!: InstalledNodeServerFeatures;

  constructor(args: string | string[], opts: NodeAddGeneratorOptions) {
    super(args, opts);

    this.argument('featureName', {
      type: String,
      required: false,
      description: 'Node.js server feature name to add to an existing generated project.',
    });
  }

  async prompting(): Promise<void> {
    if (this.options.featureName) {
      return;
    }

    const answers = await this.prompt<FeaturePromptAnswers>([
      {
        type: 'list',
        name: 'featureName',
        message: 'Node.js server feature to add',
        choices: FEATURE_PROMPT_CHOICES,
      },
    ]);

    this.options.featureName = answers.featureName;
  }

  configuring(): void {
    this.featureName = normalizeFeatureName(this.options.featureName);
    const featureDefinition = FEATURE_BY_NAME.get(this.featureName);

    if (!featureDefinition) {
      throw new Error(
        `Unknown feature "${this.featureName}". Supported features: ${SUPPORTED_FEATURES.join(', ')}.`,
      );
    }

    this.featureDefinition = featureDefinition;
    this.projectRoot = this.destinationRoot();
    this.packageJsonPath = this.destinationPath('package.json');
    this.rootPackageJson = this._validateBaseApp();
    this.appName = String(
      this.rootPackageJson.name || path.basename(this.projectRoot) || 'server',
    );
    this.appDisplayName = readNodeServerDisplayName(
      this.rootPackageJson,
      toDisplayName(this.appName),
    );
    const architecture = readNodeArchitecture(
      this.rootPackageJson,
      this.projectRoot,
    );

    if (!architecture) {
      throw new Error(
        `${getFeatureLabel(this.featureName)} can only be generated inside a supported t-generator Node.js server project. Unable to determine the generated architecture.`,
      );
    }

    this.architecture = architecture;
    this.templateContext = {
      appName: this.appName,
      appDisplayName: this.appDisplayName,
      architecture: this.architecture,
      architectureLabel:
        this.architecture === 'clean' ? 'Clean Architecture' : 'MVP',
    };
    this.installedFeatures = this._detectInstalledFeatures();

    this.featureDefinition.validate(this);
  }

  _validateBaseApp(): PackageJson {
    const featureLabel = getFeatureLabel(this.featureName);

    if (!fs.existsSync(this.packageJsonPath)) {
      throw new Error(
        `${featureLabel} can only be generated inside a t-generator Node.js server project. Missing package.json at the project root.`,
      );
    }

    let packageJson: PackageJson;

    try {
      packageJson = readJson<PackageJson>(this.packageJsonPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(
        `${featureLabel} can only be generated inside a t-generator Node.js server project. Unable to read package.json: ${message}`,
      );
    }

    const missingScripts = REQUIRED_BASE_SCRIPTS.filter(
      (scriptName) => typeof packageJson.scripts?.[scriptName] !== 'string',
    );
    const missingFiles = REQUIRED_BASE_FILES.filter(
      (relativePath) => !fs.existsSync(this.destinationPath(relativePath)),
    );
    const hasBaseMarker = packageJson.tGenerator?.stack === 'nodejs';
    const hasNodeBaseDependencies =
      hasPackageDependency(packageJson, 'express') &&
      hasPackageDependency(packageJson, '@prisma/client');

    if (
      missingScripts.length > 0 ||
      missingFiles.length > 0 ||
      (!hasBaseMarker && !hasNodeBaseDependencies)
    ) {
      const details: string[] = [];

      if (!hasBaseMarker && !hasNodeBaseDependencies) {
        details.push(
          'missing t-generator Node.js metadata or required Node.js base dependencies',
        );
      }

      if (missingScripts.length > 0) {
        details.push(`missing scripts: ${missingScripts.join(', ')}`);
      }

      if (missingFiles.length > 0) {
        details.push(`missing files: ${missingFiles.join(', ')}`);
      }

      throw new Error(
        `${featureLabel} can only be generated inside a t-generator Node.js server project. ${details.join('; ')}.`,
      );
    }

    return packageJson;
  }

  _detectInstalledFeatures(): InstalledNodeServerFeatures {
    return {
      graphql: graphqlFeature.isInstalled(this),
      queue: queueFeature.isInstalled(this),
      cache: cacheFeature.isInstalled(this),
      llm: llmFeature.isInstalled(this),
    };
  }

  _validateSharedScaffold(
    featureLabel: string,
    features: InstalledNodeServerFeatures,
  ): void {
    const expectedFiles = buildNodeServerSharedScaffold(
      this.templateContext,
      features,
    );
    const missingManagedFiles = Object.keys(expectedFiles).filter(
      (filePath) => !fs.existsSync(this.destinationPath(filePath)),
    );

    if (missingManagedFiles.length > 0) {
      throw new Error(
        `${featureLabel} generation aborted because required scaffold files are missing: ${missingManagedFiles.join(', ')}.`,
      );
    }

    const modifiedManagedFiles = Object.entries(expectedFiles)
      .filter(([filePath, expectedContent]) => {
        const absolutePath = this.destinationPath(filePath);
        const currentContent = normalizeLineEndings(
          fs.readFileSync(absolutePath, 'utf8'),
        );

        return currentContent !== normalizeLineEndings(expectedContent);
      })
      .map(([filePath]) => filePath);

    if (modifiedManagedFiles.length > 0) {
      throw new Error(
        `${featureLabel} generation aborted because these managed files do not match the expected scaffold: ${modifiedManagedFiles.join(', ')}.`,
      );
    }
  }

  _validateArchitectureScaffold(
    featureLabel: string,
    features: InstalledNodeServerFeatures,
  ): void {
    const expectedFiles = buildNodeServerArchitectureScaffold(
      this.templateContext,
      features,
    );
    const missingManagedFiles = Object.keys(expectedFiles).filter(
      (filePath) => !fs.existsSync(this.destinationPath(filePath)),
    );

    if (missingManagedFiles.length > 0) {
      throw new Error(
        `${featureLabel} generation aborted because required architecture files are missing: ${missingManagedFiles.join(', ')}.`,
      );
    }

    const modifiedManagedFiles = Object.entries(expectedFiles)
      .filter(([filePath, expectedContent]) => {
        const absolutePath = this.destinationPath(filePath);
        const currentContent = normalizeLineEndings(
          fs.readFileSync(absolutePath, 'utf8'),
        );

        return currentContent !== normalizeLineEndings(expectedContent);
      })
      .map(([filePath]) => filePath);

    if (modifiedManagedFiles.length > 0) {
      throw new Error(
        `${featureLabel} generation aborted because these architecture-managed files do not match the expected scaffold: ${modifiedManagedFiles.join(', ')}.`,
      );
    }
  }

  _writePackageCollection(
    fieldName: 'dependencies' | 'devDependencies',
    dependencyMap: Record<string, string>,
  ): void {
    const packageCollection = { ...(this.rootPackageJson[fieldName] || {}) };

    Object.entries(dependencyMap).forEach(([name, version]) => {
      if (typeof packageCollection[name] !== 'string') {
        packageCollection[name] = version;
      }
    });

    const updatedPackageJson = {
      ...this.rootPackageJson,
      [fieldName]: packageCollection,
    };

    this.rootPackageJson = updatedPackageJson;
    this.fs.write(
      this.packageJsonPath,
      `${JSON.stringify(updatedPackageJson, null, 2)}\n`,
    );
  }

  _writeDependencies(dependencyMap: Record<string, string>): void {
    this._writePackageCollection('dependencies', dependencyMap);
  }

  _writeDevDependencies(dependencyMap: Record<string, string>): void {
    this._writePackageCollection('devDependencies', dependencyMap);
  }

  _writeFiles(files: Record<string, string>): void {
    Object.entries(files).forEach(([filePath, contents]) => {
      this.fs.write(this.destinationPath(filePath), contents);
    });
  }

  _writeSharedScaffold(features: InstalledNodeServerFeatures): void {
    const scaffoldFiles = buildNodeServerSharedScaffold(
      this.templateContext,
      features,
    );

    Object.entries(scaffoldFiles).forEach(([filePath, contents]) => {
      this.fs.write(this.destinationPath(filePath), contents);
    });
  }

  _writeArchitectureScaffold(features: InstalledNodeServerFeatures): void {
    const scaffoldFiles = buildNodeServerArchitectureScaffold(
      this.templateContext,
      features,
    );

    Object.entries(scaffoldFiles).forEach(([filePath, contents]) => {
      this.fs.write(this.destinationPath(filePath), contents);
    });
  }

  _syncPackageMetadata(features: InstalledNodeServerFeatures): void {
    const expectedPackageJson = buildNodeServerPackageJson(
      this.templateContext,
      features,
    );

    const updatedPackageJson: PackageJson = {
      ...this.rootPackageJson,
      tGenerator: expectedPackageJson.tGenerator,
      dependencies: {
        ...(this.rootPackageJson.dependencies || {}),
      },
      devDependencies: {
        ...(this.rootPackageJson.devDependencies || {}),
      },
    };

    this.rootPackageJson = updatedPackageJson;
    this.fs.write(
      this.packageJsonPath,
      `${JSON.stringify(updatedPackageJson, null, 2)}\n`,
    );
  }

  writing(): void {
    this.featureDefinition.write(this);
  }

  end(): void {
    this.log('');
    this.featureDefinition.end(this);
  }
}

export = NodeAddGenerator;

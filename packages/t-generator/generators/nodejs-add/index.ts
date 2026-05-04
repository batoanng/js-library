import fs from 'node:fs';
import path from 'node:path';

import GeneratorBase, { type BaseOptions, type PromptAnswers } from 'yeoman-generator';

import {
  getTrackedFeature,
  readGeneratorMetadata,
} from '../lib/feature-metadata';
import type { GeneratorMetadata, PackageJson } from '../lib/types';
import { buildNodeServerArchitectureScaffold } from '../nodejs-app/lib/architecture-scaffold';
import {
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
import {
  hasPackageDependency,
  normalizeFeatureName,
  readJson,
  readNodeArchitecture,
  readNodeServerDisplayName,
  toDisplayName,
} from './lib/helpers';
import type {
  NodeServerAddGeneratorContext,
  NodeServerFeatureDefinition,
} from './lib/types';

type NodeAddGeneratorOptions = BaseOptions & {
  featureName?: string;
};

interface FeaturePromptAnswers extends PromptAnswers {
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

  generatorMetadata: GeneratorMetadata | null = null;

  appName!: string;

  appDisplayName!: string;

  architecture!: NodeArchitecture;

  templateContext!: NodeServerTemplateContext;

  installedFeatures!: InstalledNodeServerFeatures;

  constructor(args: string | string[], opts: NodeAddGeneratorOptions) {
    super(Array.isArray(args) ? args : [args], opts);

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
        type: 'select',
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
    this.generatorMetadata = readGeneratorMetadata(this.projectRoot);
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
      this.generatorMetadata,
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
        { cause: error },
      );
    }

    const hasNodeBaseDependencies =
      hasPackageDependency(packageJson, 'express') &&
      hasPackageDependency(packageJson, '@prisma/client');

    if (!hasNodeBaseDependencies) {
      throw new Error(
        `${featureLabel} can only be generated inside a t-generator Node.js server project or a compatible Node.js server project. package.json must declare "express" and "@prisma/client".`,
      );
    }

    return packageJson;
  }

  _detectInstalledFeatures(): InstalledNodeServerFeatures {
    return {
      graphql:
        getTrackedFeature(this.generatorMetadata, 'graphql') ??
        graphqlFeature.isInstalled(this),
      queue:
        getTrackedFeature(this.generatorMetadata, 'queue') ??
        queueFeature.isInstalled(this),
      cache:
        getTrackedFeature(this.generatorMetadata, 'cache') ??
        cacheFeature.isInstalled(this),
      llm:
        getTrackedFeature(this.generatorMetadata, 'llm') ??
        llmFeature.isInstalled(this),
    };
  }

  _validateSharedScaffold(
    featureLabel: string,
    features: InstalledNodeServerFeatures,
  ): void {
    void featureLabel;
    void features;
  }

  _validateArchitectureScaffold(
    featureLabel: string,
    features: InstalledNodeServerFeatures,
  ): void {
    void featureLabel;
    void features;
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

  writing(): void {
    this.featureDefinition.write(this);
  }

  end(): void {
    this.log('');
    this.featureDefinition.end(this);
  }
}

export default NodeAddGenerator;

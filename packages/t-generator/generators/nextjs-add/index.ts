import fs from 'node:fs';
import path from 'node:path';

import GeneratorBase from 'yeoman-generator';

import type { PackageJson } from '../lib/types';
import apolloFeature from './features/apollo';
import authFeature from './features/auth';
import pwaFeature from './features/pwa';
import reactQueryFeature from './features/react-query';
import reduxFeature from './features/redux';
import tailwindFeature from './features/tailwind';
import uiLibraryFeature from './features/ui-library';
import {
  hasPackageDependency,
  normalizeFeatureName,
  readAppDisplayName,
  readJson,
  renderTemplateFile,
  resolveTemplateAbsolutePath,
  toDisplayName,
} from './lib/helpers';
import { buildSharedScaffold } from './lib/shared-scaffold';
import type {
  FeatureDefinition,
  InstalledFeatures,
} from './lib/types';

interface AddGeneratorOptions extends GeneratorBase.GeneratorOptions {
  featureName?: string;
}

interface FeaturePromptAnswers extends GeneratorBase.Answers {
  featureName: string;
}

const FEATURES = [
  tailwindFeature,
  uiLibraryFeature,
  authFeature,
  reduxFeature,
  reactQueryFeature,
  apolloFeature,
  pwaFeature,
];
const FEATURE_BY_NAME = new Map(
  FEATURES.map((featureDefinition) => [
    featureDefinition.name,
    featureDefinition,
  ]),
);
const SUPPORTED_FEATURES = FEATURES.map(
  (featureDefinition) => featureDefinition.name,
);
const FEATURE_PROMPT_CHOICES = [
  {
    name: 'Tailwind CSS v4',
    value: 'tailwind',
    hint: 'Adds the Tailwind v4 stylesheet pipeline and shared design tokens.',
  },
  {
    name: 'UI library and theme wiring',
    value: 'ui-library',
    hint: 'Installs MUI and shared UI components, then wires the app theme.',
  },
  {
    name: 'Authentication (Auth0)',
    value: 'auth',
    hint: 'Adds Auth0 route handling and a generated auth example page.',
  },
  {
    name: 'Redux state management',
    value: 'redux',
    hint: 'Adds a Redux Toolkit store, persistence, and a demo route.',
  },
  {
    name: 'React Query data fetching',
    value: 'react-query',
    hint: 'Adds TanStack Query helpers and a generated example page.',
  },
  {
    name: 'Apollo GraphQL client',
    value: 'apollo',
    hint: 'Adds Apollo client/provider wiring and a GraphQL demo route.',
  },
  {
    name: 'Progressive Web App (PWA)',
    value: 'pwa',
    hint: 'Adds a manifest, service worker registration, and install guidance.',
  },
] as const;

function getFeatureLabel(featureName: string): string {
  return FEATURE_BY_NAME.get(featureName)?.label || `Feature "${featureName}"`;
}

class AddGenerator extends GeneratorBase {
  declare options: GeneratorBase['options'] & AddGeneratorOptions;

  featureName!: string;

  featureDefinition!: FeatureDefinition;

  projectRoot!: string;

  packageJsonPath!: string;

  envExamplePath!: string;

  rootPackageJson!: PackageJson;

  appName!: string;

  appDisplayName!: string;

  templateContext!: {
    appName: string;
    appDisplayName: string;
  };

  installedFeatures!: InstalledFeatures;

  constructor(args: string | string[], opts: AddGeneratorOptions) {
    super(args, opts);
    this.sourceRoot(path.join(__dirname, 'templates'));

    this.argument('featureName', {
      type: String,
      required: false,
      description: 'Feature name to add to an existing generated Next.js project.',
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
        message: 'Feature to add',
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
    this.envExamplePath = this.destinationPath('.env.example');
    this.rootPackageJson = this._validateBaseApp();
    this.appName = String(
      this.rootPackageJson.name || path.basename(this.projectRoot) || 'app',
    );
    this.appDisplayName = readAppDisplayName(
      this.envExamplePath,
      toDisplayName(this.appName),
    );
    this.templateContext = {
      appName: this.appName,
      appDisplayName: this.appDisplayName,
    };
    this.installedFeatures = this._detectInstalledFeatures();

    this.featureDefinition.validate(this);
  }

  _validateBaseApp(): PackageJson {
    const featureLabel = getFeatureLabel(this.featureName);

    if (!fs.existsSync(this.packageJsonPath)) {
      throw new Error(
        `${featureLabel} can only be generated inside a t-generator Next.js app. Missing package.json at the project root.`,
      );
    }

    let packageJson: PackageJson;

    try {
      packageJson = readJson<PackageJson>(this.packageJsonPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(
        `${featureLabel} can only be generated inside a t-generator Next.js app. Unable to read package.json: ${message}`,
      );
    }

    if (!hasPackageDependency(packageJson, 'next')) {
      throw new Error(
        `${featureLabel} can only be generated inside a t-generator Next.js app or a compatible Next.js app. package.json must declare "next".`,
      );
    }

    return packageJson;
  }

  _detectInstalledFeatures(): InstalledFeatures {
    return {
      tailwind: tailwindFeature.isInstalled?.(this) ?? false,
      auth: authFeature.isInstalled?.(this) ?? false,
      uiLibrary: uiLibraryFeature.isInstalled?.(this) ?? false,
      redux: reduxFeature.isInstalled?.(this) ?? false,
      reactQuery: reactQueryFeature.isInstalled?.(this) ?? false,
      apollo: apolloFeature.isInstalled?.(this) ?? false,
      pwa: pwaFeature.isInstalled?.(this) ?? false,
    };
  }

  _validateManagedFiles(
    featureLabel: string,
    managedFiles: {
      path: string;
      templatePath: string;
      templateSource: 'app' | 'add';
    }[],
    stateLabel: string,
  ): void {
    void stateLabel;

    const missingManagedFiles = managedFiles
      .map(({ path: filePath }) => filePath)
      .filter((filePath) => !fs.existsSync(this.destinationPath(filePath)));

    if (missingManagedFiles.length > 0) {
      throw new Error(
        `${featureLabel} generation aborted because required scaffold files are missing: ${missingManagedFiles.join(', ')}.`,
      );
    }
  }

  _validateSharedScaffold(
    featureLabel: string,
    features: InstalledFeatures,
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

  _writeManagedFiles(
    templateDefinitions: {
      path: string;
      templatePath: string;
      templateSource: 'app' | 'add';
    }[],
  ): void {
    templateDefinitions.forEach((templateDefinition) => {
      this.fs.write(
        this.destinationPath(templateDefinition.path),
        renderTemplateFile(
          resolveTemplateAbsolutePath(templateDefinition),
          this.templateContext,
        ),
      );
    });
  }

  _writeSharedScaffold(features: InstalledFeatures): void {
    const scaffoldFiles = buildSharedScaffold(this.templateContext, features);

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

export = AddGenerator;

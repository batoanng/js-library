import type { PackageJson } from '../../lib/types';
import type {
  InstalledNodeServerFeatures,
  NodeArchitecture,
  NodeServerTemplateContext,
} from '../../nodejs-app/lib/types';

export interface NodeServerAddGeneratorContext {
  featureName: string;
  projectRoot: string;
  packageJsonPath: string;
  rootPackageJson: PackageJson;
  appName: string;
  appDisplayName: string;
  architecture: NodeArchitecture;
  templateContext: NodeServerTemplateContext;
  installedFeatures: InstalledNodeServerFeatures;
  fs: {
    write(filePath: string, contents: string): void;
  };
  destinationRoot(rootPath?: string): string;
  destinationPath(...paths: string[]): string;
  log(message?: string): void;
  _validateSharedScaffold(
    featureLabel: string,
    features: InstalledNodeServerFeatures,
  ): void;
  _validateArchitectureScaffold(
    featureLabel: string,
    features: InstalledNodeServerFeatures,
  ): void;
  _writeDependencies(dependencyMap: Record<string, string>): void;
  _writeDevDependencies(dependencyMap: Record<string, string>): void;
  _writeFiles(files: Record<string, string>): void;
  _writeSharedScaffold(features: InstalledNodeServerFeatures): void;
  _writeArchitectureScaffold(features: InstalledNodeServerFeatures): void;
  _syncPackageMetadata(features: InstalledNodeServerFeatures): void;
}

export interface NodeServerFeatureDefinition {
  name: keyof InstalledNodeServerFeatures;
  label: string;
  isInstalled(generator: NodeServerAddGeneratorContext): boolean;
  validate(generator: NodeServerAddGeneratorContext): void;
  write(generator: NodeServerAddGeneratorContext): void;
  end(generator: NodeServerAddGeneratorContext): void;
}

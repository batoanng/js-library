import fs from 'node:fs';
import path from 'node:path';

import type { GeneratorMetadata, PackageJson } from '../../lib/types';
import type { NodeArchitecture } from '../../nodejs-app/lib/types';

export function readJson<T = unknown>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

export function normalizeFeatureName(input: unknown): string {
  return (typeof input === 'string' ? input : '').trim().toLowerCase();
}

export function toDisplayName(appName: unknown): string {
  return (typeof appName === 'string' ? appName : '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function readNodeServerDisplayName(
  packageJson: PackageJson,
  fallback: string,
): string {
  const description = typeof packageJson.description === 'string'
    ? packageJson.description.trim()
    : '';

  if (description.endsWith(' Node.js server')) {
    const label = description.slice(0, -' Node.js server'.length).trim();

    if (label) {
      return label;
    }
  }

  return fallback;
}

export function readNodeArchitecture(
  packageJson: PackageJson,
  projectRoot: string,
  generatorMetadata: GeneratorMetadata | null = null,
): NodeArchitecture | null {
  void packageJson;

  const metadataArchitecture = generatorMetadata?.architecture;

  if (metadataArchitecture === 'clean' || metadataArchitecture === 'mvp') {
    return metadataArchitecture;
  }

  if (fs.existsSync(path.join(projectRoot, 'src/interfaces/index.ts'))) {
    return 'clean';
  }

  if (fs.existsSync(path.join(projectRoot, 'src/modules/index.ts'))) {
    return 'mvp';
  }

  return null;
}

export function normalizeLineEndings(value: string | undefined): string {
  return String(value || '').replace(/\r\n/g, '\n');
}

export function hasPackageDependency(
  packageJson: PackageJson,
  dependencyName: string,
): boolean {
  return (
    typeof packageJson.dependencies?.[dependencyName] === 'string' ||
    typeof packageJson.devDependencies?.[dependencyName] === 'string'
  );
}

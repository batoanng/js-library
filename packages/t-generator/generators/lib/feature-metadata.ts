import type { PackageJson } from './types';

function normalizeTrackedFeatureName(featureName: string): string {
  return featureName.trim().toLowerCase();
}

function sortTrackedFeatures(featureNames: Iterable<string>): string[] {
  return Array.from(
    new Set(
      Array.from(featureNames)
        .map(normalizeTrackedFeatureName)
        .filter(Boolean),
    ),
  ).sort((left, right) => left.localeCompare(right));
}

export function createTrackedFeatureList(
  featureStates: Record<string, boolean>,
): string[] {
  return sortTrackedFeatures(
    Object.entries(featureStates)
      .filter(([, isInstalled]) => isInstalled)
      .map(([featureName]) => featureName),
  );
}

export function getTrackedFeature(
  packageJson: PackageJson,
  featureName: string,
): boolean | null {
  const trackedFeatures = packageJson.tGenerator?.features;

  if (!Array.isArray(trackedFeatures)) {
    return null;
  }

  return sortTrackedFeatures(trackedFeatures).includes(
    normalizeTrackedFeatureName(featureName),
  );
}

export function updateTrackedFeatures(
  packageJson: PackageJson,
  featureStates: Record<string, boolean>,
): PackageJson {
  const nextTrackedFeatures = createTrackedFeatureList(featureStates);

  return {
    ...packageJson,
    tGenerator: {
      ...packageJson.tGenerator,
      features: nextTrackedFeatures,
    },
  };
}

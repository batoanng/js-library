import fs from 'node:fs';
import path from 'node:path';

import type { GeneratorMetadata } from './types';

export const GENERATOR_METADATA_FILE = 't-generator.js';

const GENERATOR_METADATA_COMMENT = [
  '// This file is used by t-generator to track the generated stack and installed features.',
  '// Removing or editing it can prevent t-generator add commands from composing features correctly.',
].join('\n');

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
  featureStates: object,
): string[] {
  return sortTrackedFeatures(
    Object.entries(featureStates)
      .filter(([, isInstalled]) => isInstalled === true)
      .map(([featureName]) => featureName),
  );
}

export function buildGeneratorMetadata(
  metadata: GeneratorMetadata,
): GeneratorMetadata {
  return {
    ...metadata,
    features: sortTrackedFeatures(metadata.features || []),
  };
}

export function getTrackedFeature(
  metadataSource: GeneratorMetadata | null | undefined,
  featureName: string,
): boolean | null {
  const trackedFeatures = metadataSource?.features;

  if (!Array.isArray(trackedFeatures)) {
    return null;
  }

  return sortTrackedFeatures(trackedFeatures).includes(
    normalizeTrackedFeatureName(featureName),
  );
}

export function renderGeneratorMetadata(
  metadata: GeneratorMetadata,
  moduleFormat: 'commonjs' | 'esm',
): string {
  const assignment = moduleFormat === 'esm' ? 'export default' : 'module.exports =';
  const renderedMetadata = JSON.stringify(buildGeneratorMetadata(metadata), null, 2);

  return `${GENERATOR_METADATA_COMMENT}\n${assignment} ${renderedMetadata};\n`;
}

export function readGeneratorMetadata(projectRoot: string): GeneratorMetadata | null {
  const metadataPath = path.join(projectRoot, GENERATOR_METADATA_FILE);

  if (!fs.existsSync(metadataPath)) {
    return null;
  }

  const contents = fs.readFileSync(metadataPath, 'utf8');
  const moduleMatch = contents.match(
    /(?:module\.exports\s*=\s*|export\s+default\s*)(\{[\s\S]*\})\s*;?\s*$/,
  );

  if (!moduleMatch) {
    throw new Error(
      `Unable to parse ${GENERATOR_METADATA_FILE}. Expected a module export object.`,
    );
  }

  return buildGeneratorMetadata(JSON.parse(moduleMatch[1]) as GeneratorMetadata);
}

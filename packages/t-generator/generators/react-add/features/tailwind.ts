import fs from 'node:fs';

import { hasPackageDependency } from '../lib/helpers';
import type { FeatureDefinition } from '../lib/types';

const TAILWIND_DEV_DEPENDENCIES = {
  '@batoanng/tailwind-config': '^1.2.0',
  '@tailwindcss/vite': '^4.1.13',
  tailwindcss: '^4.1.13',
};

const TAILWIND_GUARD_DEPENDENCIES = [
  '@batoanng/tailwind-config',
  '@tailwindcss/vite',
  'tailwindcss',
] as const;

function hasTailwindMarkers(
  generator: Parameters<FeatureDefinition['validate']>[0],
): boolean {
  const viteConfigPath = generator.destinationPath('vite.config.ts');
  const globalStylesPath = generator.destinationPath('src/app/styles/global.css');

  if (!fs.existsSync(viteConfigPath) || !fs.existsSync(globalStylesPath)) {
    return false;
  }

  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  const globalStyles = fs.readFileSync(globalStylesPath, 'utf8');

  return (
    viteConfig.includes("@tailwindcss/vite") ||
    globalStyles.includes('@import "tailwindcss";')
  );
}

const tailwindFeature: FeatureDefinition = {
  name: 'tailwind',
  label: 'Tailwind',
  isInstalled(generator) {
    return (
      TAILWIND_GUARD_DEPENDENCIES.some((dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
      ) || hasTailwindMarkers(generator)
    );
  },
  validate(generator) {
    const existingDependencies = TAILWIND_GUARD_DEPENDENCIES.filter(
      (dependencyName) =>
        hasPackageDependency(generator.rootPackageJson, dependencyName),
    );

    if (existingDependencies.length > 0) {
      throw new Error(
        `Tailwind generation aborted because package.json already defines: ${existingDependencies.join(', ')}.`,
      );
    }

    generator._validateSharedScaffold('Tailwind', generator.installedFeatures);
  },
  write(generator) {
    generator._writeDevDependencies(TAILWIND_DEV_DEPENDENCIES);
    generator._writeSharedScaffold({
      ...generator.installedFeatures,
      tailwind: true,
    });
  },
  end(generator) {
    generator.log('Tailwind feature scaffolded in "./src/app/styles/global.css".');
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  npm run dev');
  },
};

export = tailwindFeature;

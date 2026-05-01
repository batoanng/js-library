import fs from 'node:fs';

import { hasPackageDependency } from '../lib/helpers';
import type { FeatureDefinition } from '../lib/types';

const TAILWIND_DEV_DEPENDENCIES = {
  '@batoanng/tailwind-config': '^1.4.1',
  '@tailwindcss/postcss': '^4.2.4',
  tailwindcss: '^4.2.4',
};

const TAILWIND_GUARD_DEPENDENCIES = [
  '@batoanng/tailwind-config',
  '@tailwindcss/postcss',
  'tailwindcss',
] as const;

function hasTailwindMarkers(
  generator: Parameters<FeatureDefinition['validate']>[0],
): boolean {
  const globalsPath = generator.destinationPath('src/app/globals.css');
  const postcssPath = generator.destinationPath('postcss.config.js');

  if (!fs.existsSync(globalsPath)) {
    return false;
  }

  const globals = fs.readFileSync(globalsPath, 'utf8');

  return (
    fs.existsSync(postcssPath) ||
    globals.includes('@import "tailwindcss";')
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

    if (fs.existsSync(generator.destinationPath('postcss.config.js'))) {
      throw new Error(
        'Tailwind generation aborted because "postcss.config.js" already exists.',
      );
    }

    generator._validateSharedScaffold('Tailwind', generator.installedFeatures);
  },
  write(generator) {
    generator._writeDevDependencies(TAILWIND_DEV_DEPENDENCIES);
    generator.fs.write(
      generator.destinationPath('postcss.config.js'),
      "/** @type {import('postcss-load-config').Config} */\nmodule.exports = {\n  plugins: {\n    '@tailwindcss/postcss': {},\n  },\n};\n",
    );
    generator._writeSharedScaffold({
      ...generator.installedFeatures,
      tailwind: true,
    });
  },
  end(generator) {
    generator.log('Tailwind feature scaffolded in "./src/app/globals.css".');
    generator.log('Next steps:');
    generator.log('  npm install');
    generator.log('  npm run dev');
  },
};

export default tailwindFeature;

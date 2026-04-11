import { existsSync } from 'node:fs';
import path from 'node:path';

import tailwindcss from 'eslint-plugin-tailwindcss';

const tailwindConfigFiles = [
  'tailwind.config.js',
  'tailwind.config.mjs',
  'tailwind.config.cjs',
  'tailwind.config.ts',
  'tailwind.config.mts',
  'tailwind.config.cts',
];

function resolveTailwindConfig() {
  for (const file of tailwindConfigFiles) {
    const filePath = path.join(process.cwd(), file);

    if (existsSync(filePath)) {
      return filePath;
    }
  }

  // Tailwind CSS v4 projects often rely on CSS-first defaults and skip a config file entirely.
  return {};
}

export default [
  ...tailwindcss.configs['flat/recommended'].map((config, index) => ({
    ...config,
    name: `@batoanng/eslint-config/tailwind/${index + 1}`,
  })),
  {
    name: '@batoanng/eslint-config/tailwind/settings',
    settings: {
      tailwindcss: {
        config: resolveTailwindConfig(),
      },
    },
  },
];

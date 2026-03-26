import globals from 'globals';

export const sourceExtensions = [
  '.js',
  '.mjs',
  '.cjs',
  '.jsx',
  '.ts',
  '.mts',
  '.cts',
  '.tsx',
];

export const sourceFiles = ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'];

export const tsFiles = ['**/*.{ts,tsx,mts,cts}'];

export const typedFiles = [
  'src/**/*.{ts,tsx,mts,cts}',
  'test/**/*.{ts,tsx,mts,cts}',
  'tests/**/*.{ts,tsx,mts,cts}',
  '**/*.{spec,test}.{ts,tsx,mts,cts}',
];

export const reactFiles = ['**/*.{jsx,tsx}'];

export const testFiles = [
  '**/test/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
  '**/tests/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
  '**/*.{spec,test}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
];

export const toolingFiles = [
  '**/.storybook/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}',
  '**/eslint.config.{js,mjs,cjs,ts,mts,cts}',
  '**/jest.config.{js,mjs,cjs,ts,mts,cts}',
  '**/next.config.{js,mjs,cjs,ts,mts,cts}',
  '**/postcss.config.{js,mjs,cjs,ts,mts,cts}',
  '**/prettier.config.{js,mjs,cjs,ts,mts,cts}',
  '**/tailwind.config.{js,mjs,cjs,ts,mts,cts}',
  '**/vite.config.{js,mjs,cjs,ts,mts,cts}',
  '**/vitest.config.{js,mjs,cjs,ts,mts,cts}',
  '**/vitest.setup.{js,mjs,cjs,ts,mts,cts}',
];

export const ignores = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.next/**',
  '**/.turbo/**',
  '**/coverage/**',
  '**/storybook-static/**',
  '**/.storybook-out/**',
  '**/.cache/**',
  '**/build/**',
];

export const browserAndNodeGlobals = {
  ...globals.browser,
  ...globals.node,
};

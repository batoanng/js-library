import path from 'node:path';
import { fileURLToPath } from 'node:url';

import config from '@batoanng/eslint-config';
import next from '@batoanng/eslint-config/next';
import tailwind from '@batoanng/eslint-config/tailwind';
import test from '@batoanng/eslint-config/test';
import typed from '@batoanng/eslint-config/typed';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...config,
  ...typed,
  ...next,
  ...tailwind,
  ...test,
  {
    name: '@batoanng/docs/tailwind',
    rules: {
      'tailwindcss/no-custom-classname': ['warn', { config: path.join(__dirname, 'tailwind.config.js') }],
    },
  },
];

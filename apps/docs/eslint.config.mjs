import config from '@batoanng/eslint-config';
import next from '@batoanng/eslint-config/next';
import tailwind from '@batoanng/eslint-config/tailwind';
import test from '@batoanng/eslint-config/test';
import typed from '@batoanng/eslint-config/typed';

export default [
  ...config,
  ...typed,
  ...next,
  ...tailwind,
  ...test,
];

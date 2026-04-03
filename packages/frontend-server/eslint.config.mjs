import base from '@batoanng/eslint-config/base';
import test from '@batoanng/eslint-config/test';
import typed from '@batoanng/eslint-config/typed';

export default [
  ...base,
  ...typed,
  ...test,
  {
    name: '@batoanng/frontend-server/ignores',
    ignores: ['public/**'],
  },
];

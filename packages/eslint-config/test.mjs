import globals from 'globals';
import jestPlugin from 'eslint-plugin-jest';
import testingLibraryPlugin from 'eslint-plugin-testing-library';

import { reactTestFiles, testFiles } from './shared.mjs';

export default [
  {
    ...jestPlugin.configs['flat/recommended'],
    name: '@batoanng/eslint-config/test/jest',
    files: testFiles,
    languageOptions: {
      ...(jestPlugin.configs['flat/recommended'].languageOptions ?? {}),
      globals: {
        ...globals.jest,
        ...globals.vitest,
      },
    },
    settings: {
      jest: {
        version: 29,
      },
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
    },
  },
  {
    ...testingLibraryPlugin.configs['flat/react'],
    name: '@batoanng/eslint-config/test/testing-library',
    files: reactTestFiles,
    rules: {
      ...testingLibraryPlugin.configs['flat/react'].rules,
      'testing-library/prefer-screen-queries': 'off',
    },
  },
];

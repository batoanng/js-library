import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

import {
  browserAndNodeGlobals,
  ignores,
  sourceExtensions,
  sourceFiles,
  toolingFiles,
} from './shared.mjs';

export default tseslint.config(
  {
    name: '@batoanng/eslint-config/ignores',
    ignores,
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...tseslint.configs.recommended,
  {
    name: '@batoanng/eslint-config/base',
    files: sourceFiles,
    languageOptions: {
      ecmaVersion: 'latest',
      globals: browserAndNodeGlobals,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      'import/extensions': sourceExtensions,
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.mts', '.cts'],
      },
      'import/resolver': {
        node: {
          extensions: sourceExtensions,
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      'import/extensions': 'off',
      'import/no-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-relative-packages': 'off',
      'import/prefer-default-export': 'off',
      'import/export': 'off',
      'no-extra-boolean-cast': 'off',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state', 'req', 'axiosClient', 'error'],
        },
      ],
      'no-underscore-dangle': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    name: '@batoanng/eslint-config/tooling',
    files: toolingFiles,
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  eslintConfigPrettier,
);

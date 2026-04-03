import base from '@batoanng/eslint-config/base';
import test from '@batoanng/eslint-config/test';

const commonJsGlobals = {
  __dirname: 'readonly',
  __filename: 'readonly',
  exports: 'writable',
  module: 'readonly',
  require: 'readonly',
};

export default [
  ...base,
  ...test,
  {
    name: '@batoanng/t-generator/ignores',
    ignores: ['generators/**/*.js', 'test-app/**', '**/*.ejs'],
  },
  {
    name: '@batoanng/t-generator/commonjs',
    files: ['generators/**/*.ts', 'test/**/*.ts', 'scripts/**/*.ts'],
    languageOptions: {
      globals: commonJsGlobals,
    },
    rules: {
      'no-console': 'off',
      'testing-library/prefer-screen-queries': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state', 'req', 'axiosClient', 'error', 'generator'],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
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
    name: '@batoanng/t-generator/build-scripts',
    files: ['scripts/**/*.cjs'],
    languageOptions: {
      globals: commonJsGlobals,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

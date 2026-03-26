import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

import { reactFiles } from './shared.mjs';

export default [
  {
    ...reactPlugin.configs.flat.recommended,
    name: '@batoanng/eslint-config/react/recommended',
    files: reactFiles,
  },
  {
    ...reactPlugin.configs.flat['jsx-runtime'],
    name: '@batoanng/eslint-config/react/jsx-runtime',
    files: reactFiles,
  },
  {
    name: '@batoanng/eslint-config/react',
    files: reactFiles,
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/display-name': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/static-components': 'off',
    },
  },
];

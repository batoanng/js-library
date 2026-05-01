import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

import { reactFiles } from './shared.mjs';

export default [
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
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/static-components': 'off',
    },
  },
];

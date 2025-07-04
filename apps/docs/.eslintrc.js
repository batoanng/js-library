const path = require('path');

/** @type{import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  extends: ['@batoanng/eslint-config'],
  rules: {
    'tailwindcss/no-custom-classname': [1, { config: path.join(__dirname, 'tailwind.config.js') }],
  },
};

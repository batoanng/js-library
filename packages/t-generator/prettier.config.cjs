module.exports = {
  ...require('@batoanng/prettier-config'),
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  trailingComma: 'all',
  importOrder: ['^node:(.*)$', '<THIRD_PARTY_MODULES>', '^[./]'],
};

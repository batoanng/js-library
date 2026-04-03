module.exports = {
  ...require('@batoanng/prettier-config'),
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  trailingComma: 'all',
  importOrder: ['^node:(.*)$', '<THIRD_PARTY_MODULES>', '^[./]'],
};

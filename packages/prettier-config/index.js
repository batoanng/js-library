const sortImportsPlugin = require.resolve('@trivago/prettier-plugin-sort-imports');

/** @type {import('prettier').Config} */
module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 120,
  quoteProps: 'consistent',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'auto',
  plugins: [sortImportsPlugin],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrder: ['^@/(.*)$', '^[./]'],
};

const { defineConfig } = require('vite');

const vitestConfig = defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
});

module.exports = { vitestConfig };

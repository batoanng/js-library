const { fileURLToPath } = require('url');
const { defineConfig } = require('vite');

const vitestConfig = defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

module.exports = { vitestConfig };

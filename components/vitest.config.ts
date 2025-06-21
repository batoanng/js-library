/// <reference types="vitest" />
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      // for TypeScript path alias import like : @/x/y/z
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

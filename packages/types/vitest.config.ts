// @ts-expect-error shared vitest config is published without local type metadata
import { vitestConfig } from '@batoanng/vite-config/vitest.config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  ...vitestConfig,
  test: {
    ...vitestConfig.test,
    environment: 'node',
    setupFiles: [],
  },
});

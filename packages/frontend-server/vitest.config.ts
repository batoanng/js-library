// @ts-expect-error shared vitest config is published without local type metadata
import { vitestConfig } from '@batoanng/vite-config';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

export default mergeConfig(vitestConfig, {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    setupFiles: [],
  },
});

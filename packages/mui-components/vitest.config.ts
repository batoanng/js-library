// @ts-expect-error shared vitest config is published without local type metadata
import { vitestConfig } from '@batoanng/vite-config';
import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const workspaceAliases = {
  plugins: [svgr()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@batoanng/utils': fileURLToPath(new URL('../utils/src/index.tsx', import.meta.url)),
      '@batoanng/types': fileURLToPath(new URL('../types/src/index.tsx', import.meta.url)),
    },
  },
};

export default mergeConfig(vitestConfig, workspaceAliases);

// @ts-ignore
import { viteConfig, vitestConfig } from '@batoanng/vite-config';
import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';

const workspaceAliases = {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@batoanng/utils': fileURLToPath(new URL('../utils/src/index.tsx', import.meta.url)),
      '@batoanng/types': fileURLToPath(new URL('../types/src/index.tsx', import.meta.url)),
    },
  },
};

export default mergeConfig(mergeConfig(viteConfig, workspaceAliases), vitestConfig);

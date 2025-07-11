// @ts-ignore
import { viteConfig } from '@batoanng/vite-config';
import path from 'path';
import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';

export default mergeConfig(viteConfig, {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'oidc',
      fileName: 'oidc',
    },
    sourcemap: true,
  },
});

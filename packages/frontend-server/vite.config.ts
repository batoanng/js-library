// @ts-expect-error shared vite config is published without local type metadata
import { createViteConfig } from '@batoanng/vite-config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const buildTsconfigPath = fileURLToPath(new URL('./tsconfig.build.json', import.meta.url));

export default mergeConfig(createViteConfig({ dts: { tsconfigPath: buildTsconfigPath } }), {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'frontend-server',
      formats: ['es', 'cjs'],
      fileName: (format: 'es' | 'cjs') => `frontend-server.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['node:crypto', 'node:fs', 'node:fs/promises', 'node:path', 'node:url', 'crypto', 'fs', 'fs/promises', 'path', 'url'],
    },
    sourcemap: false,
    minify: true,
  },
});

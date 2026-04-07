// @ts-ignore shared vite config is published without local type metadata
import { createViteConfig } from '@batoanng/vite-config';
import path from 'path';
import { fileURLToPath } from 'url';
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
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'oidc',
      fileName: 'oidc',
    },
    sourcemap: false,
  },
});

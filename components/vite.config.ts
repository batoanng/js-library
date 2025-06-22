// All the ignores! '@chrisneedham/rollup-plugin-peer-deps-external' is a fork of
// the original plugin which fixes the issue for Rollup 3. But, there are no types
// for the plugin.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import peerDepsExternal from '@chrisneedham/rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [peerDepsExternal(), nodeResolve(), react(), dts(), svgr()],
  build: {
    target: 'es2022',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      name: 'mui-components',
      fileName: 'mui-components',
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      // for TypeScript path alias import like : @/x/y/z
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

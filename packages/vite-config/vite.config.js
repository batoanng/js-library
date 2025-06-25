const peerDepsExternal = require('@chrisneedham/rollup-plugin-peer-deps-external');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const react = require('@vitejs/plugin-react');
const path = require('path');
const { fileURLToPath } = require('url');
const { defineConfig } = require('vite');
const dts = require('vite-plugin-dts').default;
const svgr = require('vite-plugin-svgr').default;

const viteConfig = defineConfig({
  plugins: [peerDepsExternal(), nodeResolve(), react(), dts(), svgr()],
  build: {
    target: 'es2022',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      name: 'mui-components',
      fileName: 'mui-components',
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

module.exports = { viteConfig };

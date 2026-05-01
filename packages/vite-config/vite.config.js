const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const react = require('@vitejs/plugin-react');
const { defineConfig } = require('vite');
const dts = require('vite-plugin-dts').default;
const svgr = require('vite-plugin-svgr');

const createViteConfig = ({ dts: dtsOptions = {} } = {}) =>
  defineConfig({
    plugins: [
      peerDepsExternal(),
      nodeResolve(),
      react(),
      dts({
        skipDiagnostics: true,
        ...dtsOptions,
      }),
      svgr(),
    ],
  });

const viteConfig = createViteConfig();

module.exports = { createViteConfig, viteConfig };

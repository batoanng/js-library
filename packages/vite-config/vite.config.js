const peerDepsExternal = require('@chrisneedham/rollup-plugin-peer-deps-external');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const react = require('@vitejs/plugin-react');
const { defineConfig } = require('vite');
const dts = require('vite-plugin-dts').default;
const svgr = require('vite-plugin-svgr').default;

const viteConfig = defineConfig({
  plugins: [peerDepsExternal(), nodeResolve(), react(), dts(), svgr()],
});

module.exports = { viteConfig };

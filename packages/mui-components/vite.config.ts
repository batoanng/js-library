// @ts-ignore
import { createViteConfig } from '@batoanng/vite-config';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';

const buildTsconfigPath = fileURLToPath(new URL('./tsconfig.build.json', import.meta.url));
const require = createRequire(import.meta.url);
const packageJson = require('./package.json');
const externalDependencies = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
  '@testing-library/react',
]);
const isExternalDependency = (id: string) =>
  [...externalDependencies].some((dependencyName) => id === dependencyName || id.startsWith(`${dependencyName}/`));

export default mergeConfig(createViteConfig({ dts: { tsconfigPath: buildTsconfigPath } }), {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
    lib: {
      entry: {
        'components': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'test-utils': fileURLToPath(new URL('./src/test-utils.tsx', import.meta.url)),
      },
      name: 'components',
      formats: ['es'],
      fileName: (_format: string, entryName: string) => `${entryName}.js`,
    },
    rollupOptions: {
      external: isExternalDependency,
    },
    sourcemap: false,
  },
});

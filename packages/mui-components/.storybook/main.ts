import { StorybookConfig } from '@storybook/react-vite';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const storybookDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],

  addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@chromatic-com/storybook', '@storybook/addon-docs'],

  core: {
    builder: '@storybook/builder-vite',
  },

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  typescript: {
    reactDocgen: false,
  },

  async viteFinal(config) {
    const workingDir = path.relative(config.root ?? '', path.resolve(storybookDir, '../src'));
    const aliases = Array.isArray(config.resolve?.alias)
      ? [
          ...config.resolve.alias,
          { find: '@batoanng/types', replacement: path.resolve(storybookDir, '../../types/src/index.tsx') },
          { find: '@batoanng/utils', replacement: path.resolve(storybookDir, '../../utils/src/index.tsx') },
        ]
      : {
          ...(config.resolve?.alias ?? {}),
          '@batoanng/types': path.resolve(storybookDir, '../../types/src/index.tsx'),
          '@batoanng/utils': path.resolve(storybookDir, '../../utils/src/index.tsx'),
        };
    const filteredPlugins =
      config.plugins?.filter((plugin: any) => !['peer-deps-external', 'vite:dts'].includes(plugin.name)) ?? [];

    return {
      ...config,
      define: {
        ...config.define,
        'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
      },
      resolve: {
        ...config.resolve,
        alias: aliases,
      },
      plugins: filteredPlugins,
      build: {
        ...config.build,
        sourcemap: false,
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        entries: [`${workingDir}/**/*.mdx`, `${workingDir}/**/*.stories.tsx`],
      },
    };
  },
};

export default config;

import { StorybookConfig } from '@storybook/react-vite';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/stories/*.mdx', '../src/**/*.stories.tsx'],

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
    const workingDir = path.relative(config.root ?? '', path.resolve(__dirname, '../src'));
    return {
      ...config,
      define: {
        ...config.define,
        'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
      },
      plugins: [...(config.plugins?.filter((p: any) => p.name !== 'peer-deps-external') ?? [])],
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

import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  ...tailwindcss.configs['flat/recommended'].map((config, index) => ({
    ...config,
    name: `@batoanng/eslint-config/tailwind/${index + 1}`,
  })),
];

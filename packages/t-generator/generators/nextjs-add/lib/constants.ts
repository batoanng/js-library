import path from 'node:path';

export const APP_TEMPLATE_ROOT = path.join(
  __dirname,
  '../../nextjs-app/templates',
);
export const ADD_TEMPLATE_ROOT = path.join(__dirname, '../templates');
export const REQUIRED_BASE_SCRIPTS = [
  'dev',
  'build',
  'start',
  'analyze',
  'lint',
  'test',
  'type-check',
] as const;
export const REQUIRED_BASE_FILES = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/providers/AppProviders.tsx',
  'src/app/globals.css',
  'src/pages/home/ui/HomePage.tsx',
  'src/shared/config/env.ts',
] as const;

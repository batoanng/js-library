import { addManagedFile } from './helpers';

export function buildPwaManagedFiles() {
  return [
    addManagedFile(
      'src/features/pwa/index.ts',
      'pwa/src/features/pwa/index.ts.ejs',
    ),
    addManagedFile(
      'src/features/pwa/PwaClient.tsx',
      'pwa/src/features/pwa/PwaClient.tsx.ejs',
    ),
    addManagedFile(
      'src/pages/pwa/index.ts',
      'pwa/src/pages/pwa/index.ts.ejs',
    ),
    addManagedFile(
      'src/pages/pwa/ui/PwaPage.tsx',
      'pwa/src/pages/pwa/ui/PwaPage.tsx.ejs',
    ),
    addManagedFile(
      'src/pages/pwa/ui/PwaPage.test.tsx',
      'pwa/src/pages/pwa/ui/PwaPage.test.tsx.ejs',
    ),
    addManagedFile(
      'src/app/pwa/page.tsx',
      'pwa/src/app/pwa/page.tsx.ejs',
    ),
    addManagedFile(
      'src/app/manifest.ts',
      'pwa/src/app/manifest.ts.ejs',
    ),
    addManagedFile(
      'public/sw.js',
      'pwa/public/sw.js.ejs',
    ),
    addManagedFile(
      'public/pwa-icon.svg',
      'pwa/public/pwa-icon.svg.ejs',
    ),
  ];
}

export const PWA_MANAGED_PATHS = [
  'src/features/pwa',
  'src/pages/pwa',
  'src/app/pwa',
  'src/app/manifest.ts',
  'public/sw.js',
  'public/pwa-icon.svg',
] as const;

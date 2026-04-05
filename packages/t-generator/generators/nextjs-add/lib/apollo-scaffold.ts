import { addManagedFile } from './helpers';

export function buildApolloManagedFiles() {
  return [
    addManagedFile(
      'src/shared/apollo/ApolloAppProvider.tsx',
      'apollo/src/shared/apollo/ApolloAppProvider.tsx.ejs',
    ),
    addManagedFile(
      'src/shared/apollo/index.ts',
      'apollo/src/shared/apollo/index.ts.ejs',
    ),
    addManagedFile(
      'src/features/apollo-demo/index.ts',
      'apollo/src/features/apollo-demo/index.ts.ejs',
    ),
    addManagedFile(
      'src/features/apollo-demo/api/index.ts',
      'apollo/src/features/apollo-demo/api/index.ts.ejs',
    ),
    addManagedFile(
      'src/features/apollo-demo/api/useApolloSampleQuery.ts',
      'apollo/src/features/apollo-demo/api/useApolloSampleQuery.ts.ejs',
    ),
    addManagedFile(
      'src/features/apollo-demo/model/index.ts',
      'apollo/src/features/apollo-demo/model/index.ts.ejs',
    ),
    addManagedFile(
      'src/features/apollo-demo/model/queries.ts',
      'apollo/src/features/apollo-demo/model/queries.ts.ejs',
    ),
    addManagedFile(
      'src/features/apollo-demo/model/types.ts',
      'apollo/src/features/apollo-demo/model/types.ts.ejs',
    ),
    addManagedFile(
      'src/pages/apollo/index.ts',
      'apollo/src/pages/apollo/index.ts.ejs',
    ),
    addManagedFile(
      'src/pages/apollo/ui/ApolloPage.tsx',
      'apollo/src/pages/apollo/ui/ApolloPage.tsx.ejs',
    ),
    addManagedFile(
      'src/pages/apollo/ui/ApolloPage.test.tsx',
      'apollo/src/pages/apollo/ui/ApolloPage.test.tsx.ejs',
    ),
    addManagedFile(
      'src/app/apollo/page.tsx',
      'apollo/src/app/apollo/page.tsx.ejs',
    ),
  ];
}

export const APOLLO_GUARD_DEPENDENCIES = [
  '@apollo/client',
  'graphql',
] as const;

export const APOLLO_MANAGED_PATHS = [
  'src/shared/apollo',
  'src/features/apollo-demo',
  'src/pages/apollo',
  'src/app/apollo',
] as const;

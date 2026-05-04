import type { TemplateContext } from '../../lib/types';

export type NodeArchitecture = 'clean' | 'mvp';

export interface InstalledNodeServerFeatures {
  graphql: boolean;
  queue: boolean;
  cache: boolean;
  llm: boolean;
}

export interface NodeServerTemplateContext extends TemplateContext {
  architecture: NodeArchitecture;
  architectureLabel: string;
}

export const NODE_SHARED_SCAFFOLD_PATHS = [
  't-generator.js',
  '.env.example',
  'prisma/schema.prisma',
  'src/config/env.ts',
  'src/config/logger.ts',
  'src/infrastructure/prisma/prisma.ts',
  'src/shared/auth/access-auth.ts',
  'src/shared/auth/contracts.ts',
  'src/shared/auth/errors.ts',
  'src/shared/auth/index.ts',
  'src/shared/auth/tokens.ts',
  'src/shared/error-middleware.ts',
  'src/shared/graceful-shutdown.ts',
  'src/app.ts',
  'src/server.ts',
  'tests/auth.test.ts',
  'tests/health.test.ts',
] as const;

export const NODE_ARCHITECTURE_SCAFFOLD_PATHS = {
  clean: [
    'src/domain/auth.ts',
    'src/domain/health.ts',
    'src/infrastructure/repositories/health.repository.ts',
    'src/usecases/auth.ts',
    'src/usecases/check-health.ts',
    'src/interfaces/controllers/auth.controller.ts',
    'src/interfaces/controllers/health.controller.ts',
    'src/interfaces/routes/auth.route.ts',
    'src/interfaces/routes/health.route.ts',
    'src/interfaces/index.ts',
  ],
  mvp: [
    'src/modules/auth/auth.controller.ts',
    'src/modules/auth/auth.route.ts',
    'src/modules/auth/auth.service.ts',
    'src/modules/health/health.repository.ts',
    'src/modules/health/health.service.ts',
    'src/modules/health/health.controller.ts',
    'src/modules/health/health.route.ts',
    'src/modules/index.ts',
  ],
} as const;

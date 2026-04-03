import type {
  InstalledNodeServerFeatures,
  NodeServerTemplateContext,
} from './types';

function lines(...content: string[]): string {
  return `${content.join('\n')}\n`;
}

function renderCleanDomainFile(): string {
  return lines(
    "export interface HealthReport {",
    "  status: 'UP' | 'DOWN';",
    '  service: string;',
    "  database: 'connected' | 'error';",
    '  timestamp: string;',
    '  uptime: number;',
    '}',
  );
}

function renderCleanHealthRepository(): string {
  return lines(
    "import prisma from '@/infrastructure/prisma/prisma';",
    '',
    'export async function getDatabaseStatus(): Promise<',
    "  'connected' | 'error'",
    '> {',
    '  try {',
    "    await prisma.$queryRawUnsafe('SELECT 1');",
    "    return 'connected';",
    '  } catch {',
    "    return 'error';",
    '  }',
    '}',
  );
}

function renderCleanHealthUseCase(context: NodeServerTemplateContext): string {
  return lines(
    "import type { HealthReport } from '@/domain/health';",
    "import { getDatabaseStatus } from '@/infrastructure/repositories/health.repository';",
    '',
    'export async function checkHealth(): Promise<{',
    '  statusCode: number;',
    '  body: HealthReport;',
    '}> {',
    '  const database = await getDatabaseStatus();',
    "  const status = database === 'connected' ? 'UP' : 'DOWN';",
    '',
    '  return {',
    "    statusCode: status === 'UP' ? 200 : 503,",
    '    body: {',
    '      status,',
    `      service: ${JSON.stringify(context.appName)},`,
    '      database,',
    '      timestamp: new Date().toISOString(),',
    '      uptime: process.uptime(),',
    '    },',
    '  };',
    '}',
  );
}

function renderCleanHealthController(): string {
  return lines(
    "import type { NextFunction, Request, Response } from 'express';",
    '',
    "import { checkHealth } from '@/usecases/check-health';",
    '',
    'export async function getHealth(',
    '  _request: Request,',
    '  response: Response,',
    '  next: NextFunction,',
    '): Promise<void> {',
    '  try {',
    '    const result = await checkHealth();',
    '    response.status(result.statusCode).json(result.body);',
    '  } catch (error) {',
    '    next(error);',
    '  }',
    '}',
  );
}

function renderCleanHealthRoute(): string {
  return lines(
    "import { Router } from 'express';",
    '',
    "import { getHealth } from '@/interfaces/controllers/health.controller';",
    '',
    'export const healthRouter = Router();',
    '',
    "healthRouter.get('/', getHealth);",
  );
}

function renderCleanIndex(
  features: InstalledNodeServerFeatures,
): string {
  return lines(
    "export { healthRouter } from './routes/health.route';",
    ...(features.queue ? ["export { queueRouter } from './routes/queue.route';"] : []),
    ...(features.cache ? ["export { cacheRouter } from './routes/cache.route';"] : []),
    ...(features.llm ? ["export { llmRouter } from './routes/llm.route';"] : []),
    ...(features.graphql
      ? ["export { registerGraphql } from './graphql/register-graphql';"]
      : []),
  );
}

function renderMvpHealthRepository(): string {
  return lines(
    "import prisma from '@/infrastructure/prisma/prisma';",
    '',
    'export class HealthRepository {',
    "  async getDatabaseStatus(): Promise<'connected' | 'error'> {",
    '    try {',
    "      await prisma.$queryRawUnsafe('SELECT 1');",
    "      return 'connected';",
    '    } catch {',
    "      return 'error';",
    '    }',
    '  }',
    '}',
  );
}

function renderMvpHealthService(context: NodeServerTemplateContext): string {
  return lines(
    "import { HealthRepository } from '@/modules/health/health.repository';",
    '',
    'const healthRepository = new HealthRepository();',
    '',
    'export class HealthService {',
    '  async getHealth() {',
    '    const database = await healthRepository.getDatabaseStatus();',
    "    const status = database === 'connected' ? 'UP' : 'DOWN';",
    '',
    '    return {',
    "      statusCode: status === 'UP' ? 200 : 503,",
    '      body: {',
    '        status,',
    `        service: ${JSON.stringify(context.appName)},`,
    '        database,',
    '        timestamp: new Date().toISOString(),',
    '        uptime: process.uptime(),',
    '      },',
    '    };',
    '  }',
    '}',
  );
}

function renderMvpHealthController(): string {
  return lines(
    "import type { NextFunction, Request, Response } from 'express';",
    '',
    "import { HealthService } from '@/modules/health/health.service';",
    '',
    'const healthService = new HealthService();',
    '',
    'export class HealthController {',
    '  async getHealth(',
    '    _request: Request,',
    '    response: Response,',
    '    next: NextFunction,',
    '  ): Promise<void> {',
    '    try {',
    '      const result = await healthService.getHealth();',
    '      response.status(result.statusCode).json(result.body);',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  }',
    '}',
  );
}

function renderMvpHealthRoute(): string {
  return lines(
    "import { Router } from 'express';",
    '',
    "import { HealthController } from '@/modules/health/health.controller';",
    '',
    'const healthController = new HealthController();',
    '',
    'export const healthRouter = Router();',
    '',
    "healthRouter.get('/', (request, response, next) =>",
    '  healthController.getHealth(request, response, next),',
    ');',
  );
}

function renderMvpIndex(
  features: InstalledNodeServerFeatures,
): string {
  return lines(
    "export { healthRouter } from './health/health.route';",
    ...(features.queue ? ["export { queueRouter } from './queue/queue.route';"] : []),
    ...(features.cache ? ["export { cacheRouter } from './cache/cache.route';"] : []),
    ...(features.llm ? ["export { llmRouter } from './llm/llm.route';"] : []),
    ...(features.graphql
      ? ["export { registerGraphql } from './graphql/register-graphql';"]
      : []),
  );
}

export function buildNodeServerArchitectureScaffold(
  context: NodeServerTemplateContext,
  features: InstalledNodeServerFeatures,
): Record<string, string> {
  if (context.architecture === 'clean') {
    return {
      'src/domain/health.ts': renderCleanDomainFile(),
      'src/infrastructure/repositories/health.repository.ts':
        renderCleanHealthRepository(),
      'src/usecases/check-health.ts': renderCleanHealthUseCase(context),
      'src/interfaces/controllers/health.controller.ts':
        renderCleanHealthController(),
      'src/interfaces/routes/health.route.ts': renderCleanHealthRoute(),
      'src/interfaces/index.ts': renderCleanIndex(features),
    };
  }

  return {
    'src/modules/health/health.repository.ts': renderMvpHealthRepository(),
    'src/modules/health/health.service.ts': renderMvpHealthService(context),
    'src/modules/health/health.controller.ts': renderMvpHealthController(),
    'src/modules/health/health.route.ts': renderMvpHealthRoute(),
    'src/modules/index.ts': renderMvpIndex(features),
  };
}

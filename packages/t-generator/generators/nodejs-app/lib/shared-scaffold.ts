import type { PackageJson } from '../../lib/types';
import type {
  InstalledNodeServerFeatures,
  NodeServerTemplateContext,
} from './types';
import { normalizeNodeServerImports } from './normalize-imports';

interface ConfigField {
  name: string;
  schema: string;
  sample: string;
}

function lines(...content: string[]): string {
  return `${content.join('\n')}\n`;
}

const BASE_DEPENDENCIES: Record<string, string> = {
  '@prisma/client': '^6.16.2',
  cors: '^2.8.5',
  dotenv: '^16.3.1',
  express: '^4.21.2',
  'express-rate-limit': '^7.1.5',
  helmet: '^7.1.0',
  hpp: '^0.2.3',
  morgan: '^1.10.0',
  winston: '^3.11.0',
  zod: '^4.3.6',
};

const BASE_DEV_DEPENDENCIES: Record<string, string> = {
  '@eslint/js': '^9.20.0',
  '@types/cors': '^2.8.17',
  '@types/express': '^4.17.21',
  '@types/hpp': '^0.2.3',
  '@types/jest': '^29.5.14',
  '@types/morgan': '^1.9.9',
  '@types/node': '^24.9.0',
  '@types/supertest': '^6.0.2',
  eslint: '^9.20.0',
  'eslint-config-prettier': '^10.0.1',
  globals: '^15.14.0',
  jest: '^29.7.0',
  nodemon: '^3.0.2',
  prettier: '^3.5.1',
  prisma: '^6.15.0',
  supertest: '^7.1.3',
  'ts-jest': '^29.2.5',
  'ts-node': '^10.9.2',
  typescript: '^5.9.3',
  'typescript-eslint': '^8.24.1',
};

export const NODEJS_GRAPHQL_DEPENDENCIES: Record<string, string> = {
  graphql: '^16.13.2',
  'graphql-http': '^1.22.4',
};

export const NODEJS_QUEUE_DEPENDENCIES: Record<string, string> = {
  bullmq: '^5.72.1',
  ioredis: '^5.3.2',
};

export const NODEJS_CACHE_DEPENDENCIES: Record<string, string> = {
  ioredis: '^5.3.2',
};

export const NODEJS_LLM_DEPENDENCIES: Record<string, string> = {
  openai: '^6.33.0',
};

const BASE_CONFIG_FIELDS: ConfigField[] = [
  {
    name: 'NODE_ENV',
    schema: "z.enum(['development', 'test', 'production']).default('development')",
    sample: 'development',
  },
  {
    name: 'PORT',
    schema: 'z.coerce.number().int().positive().default(3000)',
    sample: '3000',
  },
  {
    name: 'DATABASE_URL',
    schema: 'z.string().min(1)',
    sample: 'mysql://root:root@localhost:3306/app_db',
  },
  {
    name: 'CORS_ORIGIN',
    schema: "z.string().trim().min(1).default('*')",
    sample: '*',
  },
];

const REDIS_CONFIG_FIELDS: ConfigField[] = [
  {
    name: 'REDIS_URL',
    schema: "z.string().trim().min(1).default('redis://localhost:6379')",
    sample: 'redis://localhost:6379',
  },
];

const LLM_CONFIG_FIELDS: ConfigField[] = [
  {
    name: 'OPENAI_API_KEY',
    schema: 'z.string().trim().min(1)',
    sample: 'sk-proj-...',
  },
  {
    name: 'OPENAI_MODEL',
    schema: "z.string().trim().min(1).default('gpt-5')",
    sample: 'gpt-5',
  },
];

function sortRecord(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => left.localeCompare(right)),
  );
}

function mergeRecords(
  ...records: Array<Record<string, string>>
): Record<string, string> {
  const mergedRecord: Record<string, string> = {};

  records.forEach((record) => {
    Object.entries(record).forEach(([key, value]) => {
      mergedRecord[key] = value;
    });
  });

  return sortRecord(mergedRecord);
}

function getConfigFields(
  features: InstalledNodeServerFeatures,
): ConfigField[] {
  const fields = [...BASE_CONFIG_FIELDS];

  if (features.queue || features.cache) {
    fields.push(...REDIS_CONFIG_FIELDS);
  }

  if (features.llm) {
    fields.push(...LLM_CONFIG_FIELDS);
  }

  return fields;
}

function buildInterfaceImportNames(
  features: InstalledNodeServerFeatures,
): string[] {
  return [
    'healthRouter',
    ...(features.queue ? ['queueRouter'] : []),
    ...(features.cache ? ['cacheRouter'] : []),
    ...(features.llm ? ['llmRouter'] : []),
    ...(features.graphql ? ['registerGraphql'] : []),
  ];
}

function renderEnvExample(
  context: NodeServerTemplateContext,
  features: InstalledNodeServerFeatures,
): string {
  const databaseName = context.appName.replace(/-/g, '_');

  return lines(
    ...getConfigFields(features).map((field) =>
      field.name === 'DATABASE_URL'
        ? `${field.name}=mysql://root:root@localhost:3306/${databaseName}`
        : `${field.name}=${field.sample}`,
    ),
  );
}

function renderEnvFile(
  features: InstalledNodeServerFeatures,
): string {
  return lines(
    "import dotenv from 'dotenv';",
    "import { z } from 'zod';",
    '',
    'dotenv.config();',
    '',
    'const envSchema = z.object({',
    ...getConfigFields(features).map(
      (field) => `  ${field.name}: ${field.schema},`,
    ),
    '});',
    '',
    'const parsedEnv = envSchema.safeParse(process.env);',
    '',
    'if (!parsedEnv.success) {',
    "  console.error('Invalid environment variables', parsedEnv.error.flatten().fieldErrors);",
    "  throw new Error('Invalid environment configuration.');",
    '}',
    '',
    'export const env = parsedEnv.data;',
    'export type Env = typeof env;',
  );
}

function renderLoggerFile(context: NodeServerTemplateContext): string {
  return lines(
    "import winston from 'winston';",
    '',
    'const logger = winston.createLogger({',
    "  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',",
    '  defaultMeta: {',
    `    service: ${JSON.stringify(context.appName)},`,
    '  },',
    '  transports: [',
    '    new winston.transports.Console({',
    '      format:',
    "        process.env.NODE_ENV === 'production'",
    '          ? winston.format.combine(',
    '              winston.format.timestamp(),',
    '              winston.format.json(),',
    '            )',
    '          : winston.format.combine(',
    '              winston.format.colorize(),',
    '              winston.format.simple(),',
    '            ),',
    '    }),',
    '  ],',
    '});',
    '',
    'export default logger;',
  );
}

function renderPrismaClientFile(): string {
  return lines(
    "import { PrismaClient } from '@prisma/client';",
    '',
    'const prisma = new PrismaClient();',
    '',
    'export default prisma;',
  );
}

function renderRedisClientFile(): string {
  return lines(
    "import IORedis from 'ioredis';",
    '',
    "import { env } from '@/config/env';",
    '',
    'const redis = new IORedis(env.REDIS_URL, {',
    '  maxRetriesPerRequest: null,',
    '});',
    '',
    'export async function disconnectRedis(): Promise<void> {',
    "  if (redis.status === 'end') {",
    '    return;',
    '  }',
    '',
    '  await redis.quit();',
    '}',
    '',
    'export default redis;',
  );
}

function renderOpenAiClientFile(): string {
  return lines(
    "import OpenAI from 'openai';",
    '',
    "import { env } from '@/config/env';",
    '',
    'const openai = new OpenAI({',
    '  apiKey: env.OPENAI_API_KEY,',
    '});',
    '',
    'export default openai;',
  );
}

function renderErrorMiddlewareFile(): string {
  return lines(
    "import type { NextFunction, Request, Response } from 'express';",
    "import { ZodError } from 'zod';",
    '',
    "import logger from '@/config/logger';",
    '',
    'export function errorMiddleware(',
    '  error: unknown,',
    '  _request: Request,',
    '  response: Response,',
    '  _next: NextFunction,',
    '): void {',
    '  if (error instanceof ZodError) {',
    '    response.status(400).json({',
    "      message: 'Validation failed',",
    '      issues: error.flatten(),',
    '    });',
    '    return;',
    '  }',
    '',
    "  logger.error('Unhandled request error', { error });",
    '  response.status(500).json({',
    "    message: 'Internal server error',",
    '  });',
    '}',
  );
}

function renderGracefulShutdownFile(): string {
  return lines(
    "import type { Server } from 'node:http';",
    '',
    "import logger from '@/config/logger';",
    '',
    'export type CleanupTask = () => Promise<void>;',
    '',
    'export function setupGracefulShutdown(',
    '  server: Server,',
    '  cleanupTasks: CleanupTask[],',
    '): void {',
    '  let isShuttingDown = false;',
    '',
    '  const shutdown = (signal: string) => {',
    '    if (isShuttingDown) {',
    '      return;',
    '    }',
    '',
    '    isShuttingDown = true;',
    "    logger.info(`Received ${signal}. Shutting down gracefully...`);",
    '',
    '    server.close(async (closeError) => {',
    '      if (closeError) {',
    "        logger.error('Failed to close the HTTP server', { closeError });",
    '        process.exit(1);',
    '      }',
    '',
    '      const cleanupResults = await Promise.allSettled(',
    '        cleanupTasks.map((cleanupTask) => cleanupTask()),',
    '      );',
    '      const failedCleanup = cleanupResults.find(',
    "        (cleanupResult) => cleanupResult.status === 'rejected',",
    '      );',
    '',
    '      if (failedCleanup) {',
    "        logger.error('Shutdown finished with cleanup errors', { cleanupResults });",
    '        process.exit(1);',
    '      }',
    '',
    "      logger.info('Graceful shutdown fully completed.');",
    '      process.exit(0);',
    '    });',
    '  };',
    '',
    "  process.once('SIGINT', () => shutdown('SIGINT'));",
    "  process.once('SIGTERM', () => shutdown('SIGTERM'));",
    '}',
  );
}

function renderAppFile(
  context: NodeServerTemplateContext,
  features: InstalledNodeServerFeatures,
): string {
  const interfaceImportPath = context.architecture === 'clean'
    ? '@/interfaces'
    : '@/modules';
  const importedBindings = buildInterfaceImportNames(features).join(', ');
  const featureRoutes = [
    ...(features.queue
      ? ["  app.use('/api/queue', queueRouter);"]
      : []),
    ...(features.cache
      ? ["  app.use('/api/cache', cacheRouter);"]
      : []),
    ...(features.llm
      ? ["  app.use('/api/llm', llmRouter);"]
      : []),
    ...(features.graphql ? ['  await registerGraphql(app);'] : []),
  ];

  return lines(
    "import cors from 'cors';",
    "import express from 'express';",
    "import rateLimit from 'express-rate-limit';",
    "import helmet from 'helmet';",
    "import hpp from 'hpp';",
    "import morgan from 'morgan';",
    '',
    "import { env } from '@/config/env';",
    "import logger from '@/config/logger';",
    `import { ${importedBindings} } from '${interfaceImportPath}';`,
    "import { errorMiddleware } from '@/shared/error-middleware';",
    '',
    'export async function createApp() {',
    '  const app = express();',
    '',
    '  app.use(helmet());',
    '  app.use(hpp());',
    '  app.use(',
    '    cors({',
    "      origin: env.CORS_ORIGIN === '*'",
    '        ? true',
    "        : env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),",
    '      credentials: true,',
    '    }),',
    '  );',
    '  app.use(',
    '    rateLimit({',
    '      windowMs: 10 * 60 * 1000,',
    '      max: 100,',
    '    }),',
    '  );',
    '  app.use(express.json());',
    '  app.use(',
    "    morgan('combined', {",
    '      stream: {',
    '        write: (message) => logger.info(message.trim()),',
    '      },',
    '    }),',
    '  );',
    '',
    "  app.use('/health', healthRouter);",
    ...featureRoutes,
    '',
    '  app.use(errorMiddleware);',
    '',
    '  return app;',
    '}',
  );
}

function renderServerFile(
  features: InstalledNodeServerFeatures,
): string {
  const imports = [
    "import { createApp } from '@/app';",
    "import { env } from '@/config/env';",
    "import logger from '@/config/logger';",
    "import prisma from '@/infrastructure/prisma/prisma';",
    "import { setupGracefulShutdown, type CleanupTask } from '@/shared/graceful-shutdown';",
    ...(features.queue
      ? ["import { closeQueueFeature } from '@/infrastructure/queue/demo-queue';"]
      : []),
    ...(features.queue || features.cache
      ? ["import { disconnectRedis } from '@/infrastructure/redis/redis.client';"]
      : []),
  ];
  const cleanupTasks = [
    '    async () => prisma.$disconnect(),',
    ...(features.queue ? ['    closeQueueFeature,'] : []),
    ...(features.queue || features.cache ? ['    disconnectRedis,'] : []),
  ];

  return lines(
    ...imports,
    '',
    'async function bootstrap(): Promise<void> {',
    '  const app = await createApp();',
    '  const server = app.listen(env.PORT, () => {',
    "    logger.info(`Node.js server listening on port ${env.PORT}`);",
    '  });',
    '  const cleanupTasks: CleanupTask[] = [',
    ...cleanupTasks,
    '  ];',
    '',
    '  setupGracefulShutdown(server, cleanupTasks);',
    '}',
    '',
    'void bootstrap();',
  );
}

function renderPrismaSchema(): string {
  return lines(
    'generator client {',
    "  provider = 'prisma-client-js'",
    '}',
    '',
    'datasource db {',
    "  provider = 'mysql'",
    "  url      = env('DATABASE_URL')",
    '}',
    '',
    'model HealthCheckEvent {',
    '  id        Int      @id @default(autoincrement())',
    '  createdAt DateTime @default(now())',
    '}',
  );
}

function renderHealthTest(context: NodeServerTemplateContext): string {
  return lines(
    "import request from 'supertest';",
    '',
    "import { createApp } from '@/app';",
    "import prisma from '@/infrastructure/prisma/prisma';",
    '',
    "jest.mock('@/infrastructure/prisma/prisma', () => ({",
    '  __esModule: true,',
    '  default: {',
    '    $disconnect: jest.fn(),',
    '    $queryRawUnsafe: jest.fn(),',
    '  },',
    '}));',
    '',
    "describe('GET /health', () => {",
    "  it('returns the generated service name when the database is reachable', async () => {",
    '    const app = await createApp();',
    '    const prismaMock = prisma as {',
    '      $queryRawUnsafe: jest.Mock;',
    '    };',
    '',
    '    prismaMock.$queryRawUnsafe.mockResolvedValue([{ ok: 1 }]);',
    '',
    "    const response = await request(app).get('/health');",
    '',
    '    expect(response.status).toBe(200);',
    '    expect(response.body).toMatchObject({',
    "      status: 'UP',",
    `      service: ${JSON.stringify(context.appName)},`,
    "      database: 'connected',",
    '    });',
    '  });',
    '});',
  );
}

export function buildNodeServerPackageJson(
  context: NodeServerTemplateContext,
  features: InstalledNodeServerFeatures,
): PackageJson {
  const dependencies = [BASE_DEPENDENCIES];

  if (features.graphql) {
    dependencies.push(NODEJS_GRAPHQL_DEPENDENCIES);
  }

  if (features.queue) {
    dependencies.push(NODEJS_QUEUE_DEPENDENCIES);
  }

  if (features.cache) {
    dependencies.push(NODEJS_CACHE_DEPENDENCIES);
  }

  if (features.llm) {
    dependencies.push(NODEJS_LLM_DEPENDENCIES);
  }

  return {
    name: context.appName,
    version: '0.1.0',
    private: true,
    type: 'commonjs',
    main: 'dist/server.js',
    description: `${context.appDisplayName} Node.js server`,
    scripts: {
      postinstall: 'prisma generate',
      start: 'node dist/server.js',
      dev: 'nodemon --config nodemon.json',
      build: 'tsc -p tsconfig.json',
      lint: 'eslint .',
      test: 'jest --runInBand',
      'prisma:generate': 'prisma generate',
      'prisma:migrate:dev': 'prisma migrate dev',
    },
    dependencies: mergeRecords(...dependencies),
    devDependencies: mergeRecords(BASE_DEV_DEPENDENCIES),
    tGenerator: {
      stack: 'nodejs',
      architecture: context.architecture,
    },
  };
}

export function buildNodeServerSharedScaffold(
  context: NodeServerTemplateContext,
  features: InstalledNodeServerFeatures,
): Record<string, string> {
  const scaffold: Record<string, string> = {
    '.env.example': renderEnvExample(context, features),
    'prisma/schema.prisma': renderPrismaSchema(),
    'src/config/env.ts': renderEnvFile(features),
    'src/config/logger.ts': renderLoggerFile(context),
    'src/infrastructure/prisma/prisma.ts': renderPrismaClientFile(),
    'src/shared/error-middleware.ts': renderErrorMiddlewareFile(),
    'src/shared/graceful-shutdown.ts': renderGracefulShutdownFile(),
    'src/app.ts': renderAppFile(context, features),
    'src/server.ts': renderServerFile(features),
    'tests/health.test.ts': renderHealthTest(context),
  };

  if (features.queue || features.cache) {
    scaffold['src/infrastructure/redis/redis.client.ts'] =
      renderRedisClientFile();
  }

  if (features.llm) {
    scaffold['src/infrastructure/llm/openai.client.ts'] =
      renderOpenAiClientFile();
  }

  return normalizeNodeServerImports(scaffold);
}

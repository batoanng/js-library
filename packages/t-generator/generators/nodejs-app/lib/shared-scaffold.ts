import type { PackageJson } from '../../lib/types';
import { BATOANNG_TYPES_VERSION } from '../../lib/defaults';
import { createTrackedFeatureList } from '../../lib/feature-metadata';
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
  '@batoanng/types': BATOANNG_TYPES_VERSION,
  '@prisma/adapter-mariadb': '^7.8.0',
  '@prisma/client': '^7.8.0',
  cors: '^2.8.6',
  dotenv: '^17.4.2',
  express: '^5.2.1',
  'express-rate-limit': '^8.4.1',
  helmet: '^8.1.0',
  hpp: '^0.2.3',
  jsonwebtoken: '^9.0.2',
  morgan: '^1.10.1',
  winston: '^3.19.0',
  zod: '^4.4.1',
};

const BASE_DEV_DEPENDENCIES: Record<string, string> = {
  '@eslint/js': '^10.0.1',
  '@types/cors': '^2.8.19',
  '@types/express': '5.0.6',
  '@types/hpp': '^0.2.3',
  '@types/jest': '^30.0.0',
  '@types/jsonwebtoken': '^9.0.10',
  '@types/morgan': '^1.9.10',
  '@types/node': '^25.6.0',
  '@types/supertest': '^7.2.0',
  eslint: '^10.2.1',
  'eslint-config-prettier': '^10.1.8',
  globals: '^17.5.0',
  jest: '^30.3.0',
  husky: '^9.1.7',
  nodemon: '^3.1.14',
  prettier: '^3.8.3',
  prisma: '^7.8.0',
  supertest: '^7.2.2',
  'ts-jest': '^29.4.9',
  'ts-node': '^10.9.2',
  typescript: '^6.0.3',
  'typescript-eslint': '^8.59.1',
};

export const NODEJS_GRAPHQL_DEPENDENCIES: Record<string, string> = {
  graphql: '^16.13.2',
  'graphql-http': '^1.22.4',
};

export const NODEJS_QUEUE_DEPENDENCIES: Record<string, string> = {
  bullmq: '^5.76.4',
  ioredis: '^5.10.1',
};

export const NODEJS_CACHE_DEPENDENCIES: Record<string, string> = {
  ioredis: '^5.10.1',
};

export const NODEJS_LLM_DEPENDENCIES: Record<string, string> = {
  openai: '^6.35.0',
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
  {
    name: 'ACCESS_SECRET',
    schema: 'z.string().trim().min(1)',
    sample: 'change-me-access-secret',
  },
  {
    name: 'REFRESH_SECRET',
    schema: 'z.string().trim().min(1)',
    sample: 'change-me-refresh-secret',
  },
  {
    name: 'ACCESS_EXPIRES_IN',
    schema: "durationSchema.default('15m')",
    sample: '15m',
  },
  {
    name: 'REFRESH_EXPIRES_IN',
    schema: "durationSchema.default('7d')",
    sample: '7d',
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
    'authRouter',
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
    'const durationPattern = /^\\d+[smhd]$/;',
    "const durationSchema = z.string().trim().regex(",
    '  durationPattern,',
    "  'Use a duration like 15m, 1h, or 7d.',",
    ');',
    '',
    'function parseDurationToSeconds(fieldName: string, value: string): number {',
    '  const match = /^(\\d+)([smhd])$/.exec(value);',
    '',
    '  if (!match) {',
    '    throw new Error(`Invalid ${fieldName} duration: ${value}`);',
    '  }',
    '',
    '  const amount = Number(match[1]);',
    '  const unit = match[2];',
    '',
    "  const unitToSeconds = { s: 1, m: 60, h: 60 * 60, d: 60 * 60 * 24 } as const;",
    '',
    '  return amount * unitToSeconds[unit as keyof typeof unitToSeconds];',
    '}',
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
    'const accessTokenExpiresInSeconds = parseDurationToSeconds(',
    "  'ACCESS_EXPIRES_IN',",
    '  parsedEnv.data.ACCESS_EXPIRES_IN,',
    ');',
    'const refreshTokenExpiresInSeconds = parseDurationToSeconds(',
    "  'REFRESH_EXPIRES_IN',",
    '  parsedEnv.data.REFRESH_EXPIRES_IN,',
    ');',
    '',
    'export const env = Object.freeze({',
    '  ...parsedEnv.data,',
    '  ACCESS_EXPIRES_IN_SECONDS: accessTokenExpiresInSeconds,',
    '  REFRESH_EXPIRES_IN_SECONDS: refreshTokenExpiresInSeconds,',
    '});',
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
    "import { PrismaMariaDb } from '@prisma/adapter-mariadb';",
    "import { PrismaClient } from '../../generated/prisma/client.js';",
    "import { env } from '@/config/env';",
    '',
    'function createPrismaAdapter(): PrismaMariaDb {',
    '  const databaseUrl = new URL(env.DATABASE_URL);',
    '',
    '  return new PrismaMariaDb({',
    '    host: databaseUrl.hostname,',
    '    port: databaseUrl.port ? Number(databaseUrl.port) : 3306,',
    '    user: decodeURIComponent(databaseUrl.username),',
    '    password: decodeURIComponent(databaseUrl.password),',
    "    database: databaseUrl.pathname.replace(/^\\//, ''),",
    '    connectionLimit: 5,',
    '  });',
    '}',
    '',
    'const prisma = new PrismaClient({ adapter: createPrismaAdapter() });',
    '',
    'export default prisma;',
  );
}

function renderPrismaConfig(): string {
  return lines(
    "import 'dotenv/config';",
    "import { defineConfig, env } from 'prisma/config';",
    '',
    'export default defineConfig({',
    "  schema: 'prisma/schema.prisma',",
    '  datasource: {',
    "    url: env('DATABASE_URL'),",
    '  },',
    '});',
  );
}

function renderSharedAuthContracts(): string {
  return lines(
    "import { z } from 'zod';",
    '',
    'export const loginRequestSchema = z.object({',
    '  email: z.string().trim().email(),',
    '  password: z.string().min(1),',
    '});',
    '',
    'export const refreshTokenRequestSchema = z.object({',
    '  refreshToken: z.string().trim().min(1),',
    '});',
    '',
    "export type TokenType = 'access' | 'refresh';",
    '',
    'export interface AuthUser {',
    '  id: string;',
    '  email: string;',
    '}',
    '',
    'export interface AuthTokenPayload {',
    '  sub: string;',
    '  email: string;',
    '  type: TokenType;',
    '  iat?: number;',
    '  exp?: number;',
    '}',
    '',
    'export interface AuthResponse {',
    '  accessToken: string;',
    '  refreshToken: string;',
    "  tokenType: 'Bearer';",
    '  accessTokenExpiresIn: number;',
    '  refreshTokenExpiresIn: number;',
    '  user: AuthUser;',
    '}',
    '',
    'export type LoginRequest = z.infer<typeof loginRequestSchema>;',
    'export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;',
  );
}

function renderSharedAuthErrors(): string {
  return lines(
    'export class AuthenticationError extends Error {',
    '  constructor(message = "Unauthorized") {',
    '    super(message);',
    "    this.name = 'AuthenticationError';",
    '  }',
    '}',
  );
}

function renderSharedAuthTokens(): string {
  return lines(
    "import { createHash } from 'node:crypto';",
    '',
    "import jwt, { type SignOptions } from 'jsonwebtoken';",
    "import { z } from 'zod';",
    '',
    "import { env } from '@/config/env';",
    'import type {',
    '  AuthResponse,',
    '  AuthTokenPayload,',
    '  AuthUser,',
    '  TokenType,',
    "} from '@/shared/auth/contracts';",
    "import { AuthenticationError } from '@/shared/auth/errors';",
    '',
    'const authTokenPayloadSchema = z',
    '  .object({',
    '    sub: z.string().min(1),',
    '    email: z.string().email(),',
    "    type: z.enum(['access', 'refresh']),",
    '  })',
    '  .passthrough();',
    '',
    "function toExpiresIn(value: string): SignOptions['expiresIn'] {",
    "  return value as SignOptions['expiresIn'];",
    '}',
    '',
    'export function buildDemoUser(email: string): AuthUser {',
    '  const normalizedEmail = email.trim().toLowerCase();',
    '',
    '  return {',
    "    id: `user_${createHash('sha256').update(normalizedEmail).digest('hex').slice(0, 24)}`,",
    '    email: normalizedEmail,',
    '  };',
    '}',
    '',
    'function signToken(user: AuthUser, type: TokenType): string {',
    "  const secret = type === 'access' ? env.ACCESS_SECRET : env.REFRESH_SECRET;",
    "  const expiresIn = type === 'access' ? env.ACCESS_EXPIRES_IN : env.REFRESH_EXPIRES_IN;",
    '',
    '  return jwt.sign(',
    '    {',
    '      sub: user.id,',
    '      email: user.email,',
    '      type,',
    '    },',
    '    secret,',
    '    { expiresIn: toExpiresIn(expiresIn) },',
    '  );',
    '}',
    '',
    'function verifyToken(',
    '  token: string,',
    '  secret: string,',
    '  expectedType: TokenType,',
    '): AuthTokenPayload {',
    '  try {',
    '    const payload = authTokenPayloadSchema.parse(jwt.verify(token, secret));',
    '',
    '    if (payload.type !== expectedType) {',
    "      throw new AuthenticationError('Unauthorized');",
    '    }',
    '',
    '    return payload as AuthTokenPayload;',
    '  } catch (error) {',
    '    if (error instanceof AuthenticationError) {',
    '      throw error;',
    '    }',
    '',
    "    throw new AuthenticationError('Unauthorized');",
    '  }',
    '}',
    '',
    'export function issueAuthTokens(email: string): AuthResponse {',
    '  const user = buildDemoUser(email);',
    '',
    '  return {',
    "    accessToken: signToken(user, 'access'),",
    "    refreshToken: signToken(user, 'refresh'),",
    "    tokenType: 'Bearer',",
    '    accessTokenExpiresIn: env.ACCESS_EXPIRES_IN_SECONDS,',
    '    refreshTokenExpiresIn: env.REFRESH_EXPIRES_IN_SECONDS,',
    '    user,',
    '  };',
    '}',
    '',
    'export function verifyAccessToken(token: string): AuthUser {',
    "  const payload = verifyToken(token, env.ACCESS_SECRET, 'access');",
    '',
    '  return {',
    '    id: payload.sub,',
    '    email: payload.email,',
    '  };',
    '}',
    '',
    'export function verifyRefreshToken(token: string): AuthUser {',
    "  const payload = verifyToken(token, env.REFRESH_SECRET, 'refresh');",
    '',
    '  return {',
    '    id: payload.sub,',
    '    email: payload.email,',
    '  };',
    '}',
    '',
    'export function readBearerToken(authorizationHeader: unknown): string {',
    '  const authorization = Array.isArray(authorizationHeader)',
    '    ? authorizationHeader[0]',
    '    : authorizationHeader;',
    '',
    "  if (typeof authorization !== 'string') {",
    "    throw new AuthenticationError('Unauthorized');",
    '  }',
    '',
    '  const match = /^Bearer\\s+(.+)$/.exec(authorization.trim());',
    '',
    '  if (!match) {',
    "    throw new AuthenticationError('Unauthorized');",
    '  }',
    '',
    '  return match[1];',
    '}',
  );
}

function renderSharedAccessMiddleware(): string {
  return lines(
    "import type { NextFunction, Request, Response } from 'express';",
    '',
    "import type { AuthUser } from '@/shared/auth/contracts';",
    "import { readBearerToken, verifyAccessToken } from '@/shared/auth/tokens';",
    '',
    'export interface AuthenticatedRequest extends Request {',
    '  user?: AuthUser;',
    '}',
    '',
    'export function requireAccessToken(',
    '  request: AuthenticatedRequest,',
    '  _response: Response,',
    '  next: NextFunction,',
    '): void {',
    '  try {',
    '    const token = readBearerToken(request.headers.authorization);',
    '    request.user = verifyAccessToken(token);',
    '    next();',
    '  } catch (error) {',
    '    next(error);',
    '  }',
    '}',
  );
}

function renderSharedAuthIndex(): string {
  return lines(
    "export * from './access-auth.js';",
    "export * from './contracts.js';",
    "export * from './errors.js';",
    "export * from './tokens.js';",
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
    "import { AuthenticationError } from '@/shared/auth';",
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
    '  if (error instanceof AuthenticationError) {',
    '    response.status(401).json({',
    '      message: error.message,',
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
    "  app.use('/api/auth', authRouter);",
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
    "  provider     = 'prisma-client'",
    "  output       = '../src/generated/prisma'",
    "  moduleFormat = 'cjs'",
    '}',
    '',
    'datasource db {',
    "  provider = 'mysql'",
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
    "describe('GET /health', () => {",
    '  beforeEach(() => {',
    '    jest.resetModules();',
    "    process.env.NODE_ENV = 'test';",
    "    process.env.PORT = '3000';",
    `    process.env.DATABASE_URL = ${JSON.stringify(`mysql://root:root@localhost:3306/${context.appName.replace(/-/g, '_')}`)};`,
    "    process.env.ACCESS_SECRET = 'access-secret';",
    "    process.env.REFRESH_SECRET = 'refresh-secret';",
    "    process.env.ACCESS_EXPIRES_IN = '15m';",
    "    process.env.REFRESH_EXPIRES_IN = '7d';",
    '  });',
    '',
    '  afterEach(() => {',
    '    jest.restoreAllMocks();',
    '  });',
    '',
    "  it('returns the generated service name when the database is reachable', async () => {",
    "    const prismaModule = await import('@/infrastructure/prisma/prisma');",
    '    jest',
    "      .spyOn(prismaModule.default, '$queryRawUnsafe')",
    '      .mockResolvedValue([{ ok: 1 }] as never);',
    '',
    "    const { createApp } = await import('@/app');",
    '    const app = await createApp();',
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

function renderAuthTest(): string {
  return lines(
    "import request from 'supertest';",
    '',
    "describe('generated auth routes', () => {",
    '  beforeEach(() => {',
    '    jest.resetModules();',
    "    process.env.NODE_ENV = 'test';",
    "    process.env.PORT = '3000';",
    "    process.env.DATABASE_URL = 'mysql://root:root@localhost:3306/test_db';",
    "    process.env.ACCESS_SECRET = 'access-secret';",
    "    process.env.REFRESH_SECRET = 'refresh-secret';",
    "    process.env.ACCESS_EXPIRES_IN = '15m';",
    "    process.env.REFRESH_EXPIRES_IN = '7d';",
    '  });',
    '',
    "  it('supports login, me, refresh, and logout', async () => {",
    "    const { createApp } = await import('@/app');",
    '    const app = await createApp();',
    '',
    "    const loginResponse = await request(app).post('/api/auth/login').send({",
    "      email: 'demo@example.com',",
    "      password: 'password123',",
    '    });',
    '',
    '    expect(loginResponse.status).toBe(200);',
    "    expect(loginResponse.body.tokenType).toBe('Bearer');",
    '    expect(loginResponse.body.accessTokenExpiresIn).toBe(900);',
    '    expect(loginResponse.body.refreshTokenExpiresIn).toBe(604800);',
    '',
    '    const meResponse = await request(app)',
    "      .get('/api/auth/me')",
    "      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);",
    '',
    '    expect(meResponse.status).toBe(200);',
    '    expect(meResponse.body).toEqual(loginResponse.body.user);',
    '',
    '    const rejectedRefreshToken = await request(app)',
    "      .get('/api/auth/me')",
    "      .set('Authorization', `Bearer ${loginResponse.body.refreshToken}`);",
    '',
    '    expect(rejectedRefreshToken.status).toBe(401);',
    '',
    "    const refreshResponse = await request(app).post('/api/auth/refresh').send({",
    '      refreshToken: loginResponse.body.refreshToken,',
    '    });',
    '',
    '    expect(refreshResponse.status).toBe(200);',
    "    expect(refreshResponse.body.tokenType).toBe('Bearer');",
    '',
    "    const logoutResponse = await request(app).post('/api/auth/logout').send({",
    '      refreshToken: refreshResponse.body.refreshToken,',
    '    });',
    '',
    '    expect(logoutResponse.status).toBe(200);',
    '    expect(logoutResponse.body).toEqual({ success: true });',
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
      prepush: 'pnpm run lint',
      prepare: 'husky',
      'prisma:generate': 'prisma generate',
      'prisma:migrate:dev': 'prisma migrate dev',
    },
    dependencies: mergeRecords(...dependencies),
    devDependencies: mergeRecords(BASE_DEV_DEPENDENCIES),
    tGenerator: {
      stack: 'nodejs',
      architecture: context.architecture,
      features: createTrackedFeatureList({
        graphql: features.graphql,
        queue: features.queue,
        cache: features.cache,
        llm: features.llm,
      }),
    },
  };
}

export function buildNodeServerSharedScaffold(
  context: NodeServerTemplateContext,
  features: InstalledNodeServerFeatures,
): Record<string, string> {
  const scaffold: Record<string, string> = {
    '.env.example': renderEnvExample(context, features),
    'prisma.config.ts': renderPrismaConfig(),
    'prisma/schema.prisma': renderPrismaSchema(),
    'src/config/env.ts': renderEnvFile(features),
    'src/config/logger.ts': renderLoggerFile(context),
    'src/infrastructure/prisma/prisma.ts': renderPrismaClientFile(),
    'src/shared/auth/access-auth.ts': renderSharedAccessMiddleware(),
    'src/shared/auth/contracts.ts': renderSharedAuthContracts(),
    'src/shared/auth/errors.ts': renderSharedAuthErrors(),
    'src/shared/auth/index.ts': renderSharedAuthIndex(),
    'src/shared/auth/tokens.ts': renderSharedAuthTokens(),
    'src/shared/error-middleware.ts': renderErrorMiddlewareFile(),
    'src/shared/graceful-shutdown.ts': renderGracefulShutdownFile(),
    'src/app.ts': renderAppFile(context, features),
    'src/server.ts': renderServerFile(features),
    'tests/auth.test.ts': renderAuthTest(),
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

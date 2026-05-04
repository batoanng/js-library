import type { PackageJson } from '../../lib/types';
import { BATOANNG_TYPES_VERSION } from '../../lib/defaults';
import {
  createTrackedFeatureList,
  renderGeneratorMetadata,
} from '../../lib/feature-metadata';
import type {
  InstalledServerFeatures,
  ServerTemplateContext,
} from './types';

interface ConfigField {
  name: string;
  type: string;
  schema: string;
  sample: string;
  optional?: boolean;
}

const BASE_DEPENDENCIES: Record<string, string> = {
  '@batoanng/types': BATOANNG_TYPES_VERSION,
  '@fastify/cors': '^11.2.0',
  '@fastify/multipart': '^10.0.0',
  '@fastify/static': '^9.1.3',
  '@nestjs/common': '^11.1.19',
  '@nestjs/core': '^11.1.19',
  '@nestjs/jwt': '^11.0.1',
  '@nestjs/passport': '^11.0.5',
  '@nestjs/platform-fastify': '^11.1.19',
  '@nestjs/swagger': '^11.4.2',
  '@nestjs/terminus': '^11.1.1',
  '@prisma/adapter-pg': '^7.8.0',
  '@prisma/client': '^7.8.0',
  'class-transformer': '^0.5.2',
  'class-validator': '^0.15.1',
  fastify: '^5.8.5',
  passport: '^0.7.0',
  'passport-jwt': '^4.0.1',
  'reflect-metadata': '^0.2.2',
  rxjs: '^7.8.2',
  zod: '^4.4.1',
};

const BASE_DEV_DEPENDENCIES: Record<string, string> = {
  '@batoanng/eslint-config': '^3.4.0',
  '@batoanng/prettier-config': '^1.7.1',
  '@batoanng/tsconfig': '^1.6.1',
  '@batoanng/vite-config': '^1.4.0',
  '@nestjs/testing': '^11.1.19',
  '@types/node': '^24.12.2',
  '@types/passport-jwt': '^4.0.1',
  'env-cmd': '^11.0.0',
  eslint: '^10.2.1',
  husky: '^9.1.7',
  nodemon: '^3.1.10',
  prettier: '^3.8.3',
  prisma: '^7.8.0',
  'ts-node': '^10.9.2',
  typescript: '^6.0.3',
  vite: '^8.0.10',
  vitest: '^4.1.5',
};

const GRAPHQL_DEPENDENCIES: Record<string, string> = {
  '@apollo/server': '^5.5.0',
  '@as-integrations/fastify': '^3.1.0',
  '@nestjs/apollo': '^13.2.4',
  '@nestjs/graphql': '^13.4.0',
  graphql: '^16.13.2',
};

const QUEUE_DEPENDENCIES: Record<string, string> = {
  '@nestjs/bullmq': '^11.0.4',
  bullmq: '^5.76.4',
};

const CACHE_DEPENDENCIES: Record<string, string> = {
  '@keyv/redis': '^5.1.6',
  '@nestjs/cache-manager': '^3.1.2',
  'cache-manager': '^7.2.8',
};

const LLM_DEPENDENCIES: Record<string, string> = {
  openai: '^6.35.0',
};

const BASE_CONFIG_FIELDS: ConfigField[] = [
  {
    name: 'API_PORT',
    type: 'number',
    schema: 'z.coerce.number().int().positive()',
    sample: '3001',
  },
  {
    name: 'API_VERSION',
    type: 'number',
    schema: 'z.coerce.number().int().positive()',
    sample: '1',
  },
  {
    name: 'SWAGGER_ENABLE',
    type: 'boolean',
    schema: 'booleanFlagSchema',
    sample: '1',
  },
  {
    name: 'DATABASE_URL',
    type: 'string',
    schema: 'z.string().min(1)',
    sample: 'postgresql://postgres:postgres@localhost:5432/app_db?schema=public',
  },
  {
    name: 'HEALTH_TOKEN',
    type: 'string',
    schema: 'z.string().min(1)',
    sample: 'replace-me',
  },
  {
    name: 'ACCESS_SECRET',
    type: 'string',
    schema: 'z.string().min(1)',
    sample: 'change-me-access-secret',
  },
  {
    name: 'REFRESH_SECRET',
    type: 'string',
    schema: 'z.string().min(1)',
    sample: 'change-me-refresh-secret',
  },
  {
    name: 'ACCESS_EXPIRES_IN',
    type: 'string',
    schema: "durationSchema.default('15m')",
    sample: '15m',
  },
  {
    name: 'REFRESH_EXPIRES_IN',
    type: 'string',
    schema: "durationSchema.default('7d')",
    sample: '7d',
  },
  {
    name: 'CORS_ORIGIN',
    type: 'string[]',
    schema: 'corsOriginSchema',
    sample: 'http://localhost:5173',
    optional: true,
  },
];

const REDIS_CONFIG_FIELDS: ConfigField[] = [
  {
    name: 'REDIS_HOST',
    type: 'string',
    schema: 'z.string().min(1)',
    sample: 'localhost',
  },
  {
    name: 'REDIS_PORT',
    type: 'number',
    schema: 'z.coerce.number().int().positive()',
    sample: '6379',
  },
  {
    name: 'REDIS_USERNAME',
    type: 'string',
    schema: 'optionalStringSchema',
    sample: 'default',
    optional: true,
  },
  {
    name: 'REDIS_PASSWORD',
    type: 'string',
    schema: 'optionalStringSchema',
    sample: 'change-me',
    optional: true,
  },
];

const LLM_CONFIG_FIELDS: ConfigField[] = [
  {
    name: 'OPENAI_API_KEY',
    type: 'string',
    schema: 'z.string().min(1)',
    sample: 'sk-proj-...',
  },
  {
    name: 'OPENAI_MODEL',
    type: 'string',
    schema: 'z.string().min(1)',
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
  features: InstalledServerFeatures,
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

export function buildServerPackageJson(
  context: ServerTemplateContext,
  features: InstalledServerFeatures,
): PackageJson {
  const dependencies = [BASE_DEPENDENCIES];
  const devDependencies = [BASE_DEV_DEPENDENCIES];

  if (features.graphql) {
    dependencies.push(GRAPHQL_DEPENDENCIES);
  }

  if (features.queue) {
    dependencies.push(QUEUE_DEPENDENCIES);
  }

  if (features.cache) {
    dependencies.push(CACHE_DEPENDENCIES);
  }

  if (features.llm) {
    dependencies.push(LLM_DEPENDENCIES);
  }

  return {
    name: context.appName,
    version: '0.1.0',
    private: true,
    description: `${context.appDisplayName} NestJS server`,
    type: 'commonjs',
    main: 'dist/server.js',
    scripts: {
      postinstall: 'prisma generate',
      start: 'node dist/server.js',
      dev: 'env-cmd -f .env nodemon',
      build: 'tsc -p tsconfig.json',
      test: 'vitest run',
      lint: 'eslint src/**/*.ts',
      prepush: 'pnpm run lint',
      prepare: 'husky',
      'prisma:generate': 'prisma generate',
      'prisma:push': 'prisma db push',
    },
    dependencies: mergeRecords(...dependencies),
    devDependencies: mergeRecords(...devDependencies),
  };
}

export function renderServerPackageJson(
  context: ServerTemplateContext,
  features: InstalledServerFeatures,
): string {
  return `${JSON.stringify(buildServerPackageJson(context, features), null, 2)}\n`;
}

function renderServerReadme(context: ServerTemplateContext): string {
  return `# ${context.appDisplayName}

Generated by \`generator-t-generator\`.

## Stack

- NestJS + Fastify + TypeScript
- Prisma + PostgreSQL
- Vitest

## Commands

\`\`\`bash
npm install
npm run dev
npm test
npm run prisma:push
\`\`\`

## Add more features

From the project root, run:

\`\`\`bash
yo t-generator:nestjs-add
yo t-generator:nestjs-add graphql
yo t-generator:nestjs-add queue
yo t-generator:nestjs-add cache
yo t-generator:nestjs-add llm
\`\`\`

The interactive root command also routes into this stack:

\`\`\`bash
yo t-generator
\`\`\`

## Feature tracking

The root \`t-generator.js\` file records the generated stack and installed
features so add commands can compose new scaffold files with existing features.
Keep this file in place unless you are intentionally opting out of t-generator
feature composition.
`;
}

function renderEnvExample(
  context: ServerTemplateContext,
  features: InstalledServerFeatures,
): string {
  const fields = getConfigFields(features).map((field) => {
    if (field.name === 'DATABASE_URL') {
      return `${field.name}=postgresql://postgres:postgres@localhost:5432/${context.appName.replace(/-/g, '_')}?schema=public`;
    }

    return `${field.name}=${field.sample}`;
  });

  return `${fields.join('\n')}\n`;
}

function renderConfigType(features: InstalledServerFeatures): string {
  const lines = [
    "import { z } from 'zod';",
    '',
    'function trimString(value: unknown): unknown {',
    "  return typeof value === 'string' ? value.trim() : value;",
    '}',
    '',
    'function toOptionalTrimmedString(value: unknown): unknown {',
    "  if (typeof value !== 'string') {",
    '    return value;',
    '  }',
    '',
    '  const trimmed = value.trim();',
    '',
    '  return trimmed.length > 0 ? trimmed : undefined;',
    '}',
    '',
    'function toBooleanFlag(value: unknown): unknown {',
    "  if (typeof value === 'boolean') {",
    '    return value;',
    '  }',
    '',
    "  if (typeof value === 'number') {",
    '    return value !== 0;',
    '  }',
    '',
    "  if (typeof value === 'string') {",
    "    const normalized = value.trim().toLowerCase();",
    '',
    "    if (normalized === '1' || normalized === 'true') {",
    '      return true;',
    '    }',
    '',
    "    if (normalized === '0' || normalized === 'false') {",
    '      return false;',
    '    }',
    '  }',
    '',
    '  return value;',
    '}',
    '',
    'function toOriginList(value: unknown): unknown {',
    "  if (typeof value !== 'string') {",
    '    return value;',
    '  }',
    '',
    '  const origins = value',
    "    .split(',')",
    '    .map((entry) => entry.trim())',
    '    .filter(Boolean);',
    '',
    '  return origins.length > 0 ? origins : undefined;',
    '}',
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
    'const stringSchema = z.preprocess(trimString, z.string().min(1));',
    'const optionalStringSchema = z.preprocess(',
    '  toOptionalTrimmedString,',
    '  z.string().min(1).optional(),',
    ');',
    'const booleanFlagSchema = z.preprocess(toBooleanFlag, z.boolean());',
    'const corsOriginSchema = z.preprocess(',
    '  toOriginList,',
    '  z.array(z.string().min(1)).optional(),',
    ');',
    'const durationSchema = z',
    '  .string()',
    '  .trim()',
    "  .regex(/^\\d+[smhd]$/, 'Use a duration like 15m, 1h, or 7d.');",
    '',
    'export const configSchema = z.object({',
  ];

  getConfigFields(features).forEach((field) => {
    lines.push(`  ${field.name}: ${field.schema},`);
  });

  lines.push('});');
  lines.push('');
  lines.push('type BaseConfig = z.infer<typeof configSchema>;');
  lines.push('');
  lines.push('export type Config = Readonly<');
  lines.push('  BaseConfig & {');
  lines.push('    ACCESS_EXPIRES_IN_SECONDS: number;');
  lines.push('    REFRESH_EXPIRES_IN_SECONDS: number;');
  lines.push('  }');
  lines.push('>;');
  lines.push('');
  lines.push('let cachedConfig: Config | undefined;');
  lines.push('');
  lines.push('function formatConfigError(error: z.ZodError): string {');
  lines.push('  const fieldErrors = error.flatten().fieldErrors;');
  lines.push(
    "  return `Configuration not valid:\\n${JSON.stringify(fieldErrors, null, 2)}`;",
  );
  lines.push('}');
  lines.push('');
  lines.push('export function getConfig(): Config {');
  lines.push('  if (cachedConfig) {');
  lines.push('    return cachedConfig;');
  lines.push('  }');
  lines.push('');
  lines.push('  const result = configSchema.safeParse(process.env);');
  lines.push('');
  lines.push('  if (!result.success) {');
  lines.push('    throw new Error(formatConfigError(result.error));');
  lines.push('  }');
  lines.push('');
  lines.push('  cachedConfig = Object.freeze({');
  lines.push('    ...result.data,');
  lines.push('    ACCESS_EXPIRES_IN_SECONDS: parseDurationToSeconds(');
  lines.push("      'ACCESS_EXPIRES_IN',");
  lines.push('      result.data.ACCESS_EXPIRES_IN,');
  lines.push('    ),');
  lines.push('    REFRESH_EXPIRES_IN_SECONDS: parseDurationToSeconds(');
  lines.push("      'REFRESH_EXPIRES_IN',");
  lines.push('      result.data.REFRESH_EXPIRES_IN,');
  lines.push('    ),');
  lines.push('  });');
  lines.push('');
  lines.push('  return cachedConfig;');
  lines.push('}');
  lines.push('');
  lines.push('export const config = getConfig();');

  return `${lines.join('\n')}\n`;
}

function renderConfigProvider(_features: InstalledServerFeatures): string {
  const lines = [
    "import { getConfig } from '../../../types/config';",
    "import { Service } from '../../tokens';",
    '',
    'export const configProvider = {',
    '  provide: Service.CONFIG,',
    '  useFactory: getConfig,',
  ];

  lines.push('};');

  return `${lines.join('\n')}\n`;
}

function renderGraphqlImportBlock(): string[] {
  return [
    "import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';",
    "import { GraphQLModule } from '@nestjs/graphql';",
  ];
}

function renderQueueImportBlock(): string[] {
  return ["import { BullModule } from '@nestjs/bullmq';"];
}

function renderCacheImportBlock(): string[] {
  return [
    "import { createKeyv } from '@keyv/redis';",
    "import { CacheModule } from '@nestjs/cache-manager';",
  ];
}

function renderAppModule(features: InstalledServerFeatures): string {
  const imports = ["import { Module } from '@nestjs/common';"];

  if (features.graphql) {
    imports.push(...renderGraphqlImportBlock());
  }

  if (features.queue) {
    imports.push(...renderQueueImportBlock());
  }

  if (features.cache) {
    imports.push(...renderCacheImportBlock());
  }

  imports.push(
    "import { AuthModule } from './auth/auth.module';",
    "import { CommonModule } from './common';",
  );

  if (features.graphql) {
    imports.push("import { GraphqlFeatureModule } from './graphql';");
  }

  if (features.queue) {
    imports.push("import { QueueFeatureModule } from './queue';");
  }

  if (features.cache) {
    imports.push("import { CacheFeatureModule } from './cache';");
  }

  if (features.llm) {
    imports.push("import { LlmFeatureModule } from './llm';");
  }

  if (features.queue || features.cache) {
    imports.push("import { config } from '../types/config';");
  }

  const lines = [...imports, ''];

  if (features.cache) {
    lines.push('function toRedisUrl(): string {');
    lines.push('  const username = config.REDIS_USERNAME;');
    lines.push('  const password = config.REDIS_PASSWORD;');
    lines.push(
      '  const auth = username && password ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : \'\';',
    );
    lines.push('');
    lines.push(
      '  return `redis://${auth}${config.REDIS_HOST}:${config.REDIS_PORT}`;',
    );
    lines.push('}');
    lines.push('');
  }

  lines.push('@Module({');
  lines.push('  imports: [');
  lines.push('    CommonModule,');
  lines.push('    AuthModule,');

  if (features.graphql) {
    lines.push('    GraphQLModule.forRoot<ApolloDriverConfig>({');
    lines.push('      driver: ApolloDriver,');
    lines.push('      autoSchemaFile: true,');
    lines.push("      path: '/api/graphql',");
    lines.push('      context: (requestContext: {');
    lines.push('        req?: {');
    lines.push('          raw?: { headers?: Record<string, unknown>; user?: unknown };');
    lines.push('          headers?: Record<string, unknown>;');
    lines.push('          user?: unknown;');
    lines.push('        };');
    lines.push('        raw?: { headers?: Record<string, unknown>; user?: unknown };');
    lines.push('        headers?: Record<string, unknown>;');
    lines.push('        user?: unknown;');
    lines.push('      }) => {');
    lines.push(
      '        const raw = requestContext.req?.raw ?? requestContext.req ?? requestContext.raw ?? requestContext;',
    );
    lines.push('        const headers = raw?.headers ?? {};');
    lines.push('        return {');
    lines.push('          req: raw,');
    lines.push('          headers,');
    lines.push(
      "          guestUserId: typeof headers['x-guest-user-id'] === 'string' ? headers['x-guest-user-id'] : null,",
    );
    lines.push('        };');
    lines.push('      },');
    lines.push('    }),');
  }

  if (features.queue) {
    lines.push('    BullModule.forRoot({');
    lines.push('      connection: {');
    lines.push('        host: config.REDIS_HOST,');
    lines.push('        port: config.REDIS_PORT,');
    lines.push('        username: config.REDIS_USERNAME,');
    lines.push('        password: config.REDIS_PASSWORD,');
    lines.push('      },');
    lines.push('    }),');
  }

  if (features.cache) {
    lines.push('    CacheModule.registerAsync({');
    lines.push('      isGlobal: true,');
    lines.push('      useFactory: async () => {');
    lines.push('        const keyv = createKeyv(toRedisUrl());');
    lines.push('');
    lines.push('        return {');
    lines.push('          stores: [keyv],');
    lines.push('        };');
    lines.push('      },');
    lines.push('    }),');
  }

  if (features.graphql) {
    lines.push('    GraphqlFeatureModule,');
  }

  if (features.queue) {
    lines.push('    QueueFeatureModule,');
  }

  if (features.cache) {
    lines.push('    CacheFeatureModule,');
  }

  if (features.llm) {
    lines.push('    LlmFeatureModule,');
  }

  lines.push('  ],');
  lines.push('})');
  lines.push('export class ApplicationModule {}');

  return `${lines.join('\n')}\n`;
}

function renderServerFile(
  context: ServerTemplateContext,
  features: InstalledServerFeatures,
): string {
  const swaggerDescription = features.graphql
    ? `REST API for ${context.appDisplayName}.\n\nAuthentication modes:\n- Local JWT access tokens for authenticated REST endpoints.\n- Refresh tokens are exchanged through /auth/refresh and invalidated client-side through /auth/logout.\n- Dedicated health bearer token for /health.\n- Optional JWT or \`x-guest-user-id\` for guest-capable GraphQL endpoints.\n\nMultipart upload endpoints expect a \`file\` field in \`multipart/form-data\`.\nGraphQL is available separately at \`/api/graphql\` and is not included in this Swagger document.`
    : `REST API for ${context.appDisplayName}.\n\nAuthentication modes:\n- Local JWT access tokens for authenticated REST endpoints.\n- Refresh tokens are exchanged through /auth/refresh and invalidated client-side through /auth/logout.\n- Dedicated health bearer token for /health.\n\nMultipart upload endpoints expect a \`file\` field in \`multipart/form-data\`.`;

  const allowedHeaders = ["'Content-Type'", "'Authorization'"];

  if (features.graphql) {
    allowedHeaders.push("'x-guest-user-id'");
  }

  const lines = [
    "import 'reflect-metadata';",
    '',
    "import multipart from '@fastify/multipart';",
    "import { INestApplication, ValidationPipe } from '@nestjs/common';",
    "import { NestFactory } from '@nestjs/core';",
    'import {',
    '  FastifyAdapter,',
    '  NestFastifyApplication,',
    "} from '@nestjs/platform-fastify';",
    "import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';",
    "import type { IncomingMessage, ServerResponse } from 'node:http';",
    '',
    "import { ApplicationModule } from './modules/app.module';",
    "import { CommonModule, LogInterceptor } from './modules/common';",
    "import { config } from './types/config';",
    '',
    `const API_DEFAULT_PORT = ${String(BASE_CONFIG_FIELDS.find((field) => field.name === 'API_PORT')?.sample || '3001')};`,
    `const API_DEFAULT_VERSION = ${String(BASE_CONFIG_FIELDS.find((field) => field.name === 'API_VERSION')?.sample || '1')};`,
    "const SWAGGER_PREFIX = '/docs';",
    `const SWAGGER_TITLE = ${JSON.stringify(`${context.appDisplayName} API`)};`,
    `const SWAGGER_DESCRIPTION = ${JSON.stringify(swaggerDescription)};`,
    '',
    'let appPromise: Promise<NestFastifyApplication> | undefined;',
    '',
    'function createSwagger(app: INestApplication): void {',
    '  const apiVersion = String(config.API_VERSION || API_DEFAULT_VERSION);',
    "  const apiBasePath = `/api/v${apiVersion}`;",
    '  const options = new DocumentBuilder()',
    '    .setTitle(SWAGGER_TITLE)',
    '    .setDescription(SWAGGER_DESCRIPTION)',
    '    .setVersion(apiVersion)',
    "    .setOpenAPIVersion('3.0.0')",
    "    .addServer(apiBasePath, 'Versioned REST API base path')",
    '    .addBearerAuth(',
    '      {',
    "        type: 'http',",
    "        scheme: 'bearer',",
    "        bearerFormat: 'JWT',",
    "        description: 'JWT access token for authenticated REST endpoints.',",
    '      },',
    "      'jwt',",
    '    )',
    '    .addBearerAuth(',
    '      {',
    "        type: 'http',",
    "        scheme: 'bearer',",
    "        bearerFormat: 'token',",
    "        description: 'Health check bearer token.',",
    '      },',
    "      'health-token',",
    '    )',
    '    .build();',
    '',
    '  const document = SwaggerModule.createDocument(app, options);',
    '  SwaggerModule.setup(SWAGGER_PREFIX, app, document);',
    '}',
    '',
    'export async function createApp(): Promise<NestFastifyApplication> {',
    '  const adapter = new FastifyAdapter();',
    '  const origins = (config.CORS_ORIGIN ?? [])',
    '    .map((entry) => entry.trim())',
    '    .filter(Boolean);',
    '',
    '  adapter.enableCors({',
    '    origin: origins.length > 0 ? origins : true,',
    '    credentials: true,',
    "    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],",
    `    allowedHeaders: [${allowedHeaders.join(', ')}],`,
    '  });',
    '',
    '  const app = await NestFactory.create<NestFastifyApplication>(',
    '    ApplicationModule,',
    '    adapter,',
    '  );',
    '',
    '  app.setGlobalPrefix(`api/v${config.API_VERSION || API_DEFAULT_VERSION}`);',
    '',
    '  if (config.SWAGGER_ENABLE) {',
    '    createSwagger(app);',
    '  }',
    '',
    '  app.useGlobalPipes(',
    '    new ValidationPipe({',
    '      transform: true,',
    '      whitelist: true,',
    '      transformOptions: {',
    '        enableImplicitConversion: true,',
    '      },',
    '    }),',
    '  );',
    '',
    '  const logInterceptor = app.select(CommonModule).get(LogInterceptor);',
    '  app.useGlobalInterceptors(logInterceptor);',
    '',
    '  await app.register(multipart as never, {',
    '    limits: {',
    '      fileSize: 1024 * 1024 * 1024,',
    '      fields: 20,',
    '      headerPairs: 2000,',
    '    },',
    '  });',
    '',
    '  await app.init();',
    '  await app.getHttpAdapter().getInstance().ready();',
    '',
    '  return app;',
    '}',
    '',
    'async function getApp(): Promise<NestFastifyApplication> {',
    '  if (!appPromise) {',
    '    appPromise = createApp().catch((error: unknown) => {',
    '      appPromise = undefined;',
    '      throw error;',
    '    });',
    '  }',
    '',
    '  return appPromise;',
    '}',
    '',
    'export default async function handler(',
    '  request: IncomingMessage,',
    '  response: ServerResponse,',
    '): Promise<void> {',
    '  const app = await getApp();',
    '  const fastify = app.getHttpAdapter().getInstance();',
    '',
    "  fastify.server.emit('request', request, response);",
    '}',
    '',
    'async function bootstrap(): Promise<void> {',
    '  const app = await getApp();',
    '  const port = Number(config.API_PORT || API_DEFAULT_PORT);',
    "  await app.listen(port, '0.0.0.0');",
    '',
    '  console.info(`Server is running on port ${port}`);',
    '}',
    '',
    'if (!process.env.VERCEL) {',
    '  bootstrap().catch((error: unknown) => {',
    '    console.error(error);',
    '    process.exit(1);',
    '  });',
    '}',
  ];

  return `${lines.join('\n')}\n`;
}

export function buildServerSharedScaffold(
  context: ServerTemplateContext,
  features: InstalledServerFeatures,
): Record<string, string> {
  return {
    't-generator.js': renderGeneratorMetadata(
      {
        stack: 'nestjs',
        features: createTrackedFeatureList(features),
      },
      'commonjs',
    ),
    'README.md': renderServerReadme(context),
    '.env.example': renderEnvExample(context, features),
    'src/types/config.ts': renderConfigType(features),
    'src/modules/common/provider/config.provider.ts': renderConfigProvider(
      features,
    ),
    'src/modules/app.module.ts': renderAppModule(features),
    'src/server.ts': renderServerFile(context, features),
  };
}

import type {
  NodeServerTemplateContext,
  NodeArchitecture,
} from '../../nodejs-app/lib/types';
import { normalizeNodeServerImports } from '../../nodejs-app/lib/normalize-imports';

function lines(...content: string[]): string {
  return `${content.join('\n')}\n`;
}

export const GRAPHQL_GUARD_DEPENDENCIES = ['graphql', 'graphql-http'] as const;

export function getGraphqlManagedPaths(
  architecture: NodeArchitecture,
): string[] {
  return architecture === 'clean'
    ? [
        'src/interfaces/graphql/register-graphql.ts',
        'src/usecases/get-graphql-demo.ts',
      ]
    : [
        'src/modules/graphql/register-graphql.ts',
        'src/modules/graphql/graphql.service.ts',
      ];
}

export function buildGraphqlFeatureFiles(
  context: NodeServerTemplateContext,
): Record<string, string> {
  const graphqlRegistrationFile = lines(
    "import type { Express } from 'express';",
    "import { buildSchema } from 'graphql';",
    "import { createHandler } from 'graphql-http/lib/use/express';",
    '',
    context.architecture === 'clean'
      ? "import { getGraphqlDemo } from '@/usecases/get-graphql-demo';"
      : "import { GraphqlService } from '@/modules/graphql/graphql.service';",
    '',
    'const schema = buildSchema(`',
    '  type GraphqlDemo {',
    '    service: String!',
    '    architecture: String!',
    '    timestamp: String!',
    '  }',
    '',
    '  type Query {',
    '    graphqlDemo: GraphqlDemo!',
    '  }',
    '`);',
    '',
    ...(context.architecture === 'mvp'
      ? ['const graphqlService = new GraphqlService();', '']
      : []),
    'export async function registerGraphql(app: Express): Promise<void> {',
    '  app.use(',
    "    '/api/graphql',",
    '    createHandler({',
    '      schema,',
    '      rootValue: {',
    context.architecture === 'clean'
      ? '        graphqlDemo: () => getGraphqlDemo(),'
      : '        graphqlDemo: () => graphqlService.getGraphqlDemo(),',
    '      },',
    '    }),',
    '  );',
    '}',
  );

  if (context.architecture === 'clean') {
    return normalizeNodeServerImports({
      'src/interfaces/graphql/register-graphql.ts': graphqlRegistrationFile,
      'src/usecases/get-graphql-demo.ts': lines(
        'export function getGraphqlDemo() {',
        '  return {',
        `    service: ${JSON.stringify(context.appName)},`,
        `    architecture: ${JSON.stringify(context.architectureLabel)},`,
        '    timestamp: new Date().toISOString(),',
        '  };',
        '}',
      ),
    });
  }

  return normalizeNodeServerImports({
    'src/modules/graphql/register-graphql.ts': graphqlRegistrationFile,
    'src/modules/graphql/graphql.service.ts': lines(
      'export class GraphqlService {',
      '  getGraphqlDemo() {',
      '    return {',
      `      service: ${JSON.stringify(context.appName)},`,
      `      architecture: ${JSON.stringify(context.architectureLabel)},`,
      '      timestamp: new Date().toISOString(),',
      '    };',
      '  }',
      '}',
    ),
  });
}

export const QUEUE_GUARD_DEPENDENCIES = ['bullmq'] as const;

export function getQueueManagedPaths(
  architecture: NodeArchitecture,
): string[] {
  return architecture === 'clean'
    ? [
        'src/infrastructure/queue/demo-queue.ts',
        'src/usecases/enqueue-demo-job.ts',
        'src/interfaces/controllers/queue.controller.ts',
        'src/interfaces/routes/queue.route.ts',
      ]
    : [
        'src/infrastructure/queue/demo-queue.ts',
        'src/modules/queue/queue.service.ts',
        'src/modules/queue/queue.controller.ts',
        'src/modules/queue/queue.route.ts',
      ];
}

export function buildQueueFeatureFiles(
  context: NodeServerTemplateContext,
): Record<string, string> {
  const files: Record<string, string> = {
    'src/infrastructure/queue/demo-queue.ts': lines(
      "import { Queue } from 'bullmq';",
      '',
      "import redis from '@/infrastructure/redis/redis.client';",
      '',
      "export const demoQueue = new Queue('demo-queue', {",
      '  connection: redis,',
      '  defaultJobOptions: {',
      '    attempts: 3,',
      '    removeOnComplete: true,',
      '    removeOnFail: 20,',
      '  },',
      '});',
      '',
      'export async function closeQueueFeature(): Promise<void> {',
      '  await demoQueue.close();',
      '}',
    ),
  };

  if (context.architecture === 'clean') {
    files['src/usecases/enqueue-demo-job.ts'] = lines(
      "import { demoQueue } from '@/infrastructure/queue/demo-queue';",
      '',
      'export async function enqueueDemoJob(message: string) {',
      "  const job = await demoQueue.add('queue.demo', { message });",
      '',
      '  return {',
      "    jobId: job.id ? String(job.id) : null,",
      "    queue: 'demo-queue',",
      '    message,',
      '  };',
      '}',
    );
    files['src/interfaces/controllers/queue.controller.ts'] = lines(
      "import type { NextFunction, Request, Response } from 'express';",
      "import { z } from 'zod';",
      '',
      "import { enqueueDemoJob } from '@/usecases/enqueue-demo-job';",
      '',
      'const queueDemoSchema = z.object({',
      '  message: z.string().trim().min(1),',
      '});',
      '',
      'export async function enqueueQueueDemo(',
      '  request: Request,',
      '  response: Response,',
      '  next: NextFunction,',
      '): Promise<void> {',
      '  try {',
      '    const payload = queueDemoSchema.parse(request.body);',
      '    const result = await enqueueDemoJob(payload.message);',
      '    response.status(201).json(result);',
      '  } catch (error) {',
      '    next(error);',
      '  }',
      '}',
    );
    files['src/interfaces/routes/queue.route.ts'] = lines(
      "import { Router } from 'express';",
      '',
      "import { enqueueQueueDemo } from '@/interfaces/controllers/queue.controller';",
      '',
      'export const queueRouter = Router();',
      '',
      "queueRouter.post('/demo', enqueueQueueDemo);",
    );
    return normalizeNodeServerImports(files);
  }

  files['src/modules/queue/queue.service.ts'] = lines(
    "import { demoQueue } from '@/infrastructure/queue/demo-queue';",
    '',
    'export class QueueService {',
    '  async enqueueDemoJob(message: string) {',
    "    const job = await demoQueue.add('queue.demo', { message });",
    '',
    '    return {',
    "      jobId: job.id ? String(job.id) : null,",
    "      queue: 'demo-queue',",
    '      message,',
    '    };',
    '  }',
    '}',
  );
  files['src/modules/queue/queue.controller.ts'] = lines(
    "import type { NextFunction, Request, Response } from 'express';",
    "import { z } from 'zod';",
    '',
    "import { QueueService } from '@/modules/queue/queue.service';",
    '',
    'const queueDemoSchema = z.object({',
    '  message: z.string().trim().min(1),',
    '});',
    'const queueService = new QueueService();',
    '',
    'export class QueueController {',
    '  async enqueueDemo(',
    '    request: Request,',
    '    response: Response,',
    '    next: NextFunction,',
    '  ): Promise<void> {',
    '    try {',
    '      const payload = queueDemoSchema.parse(request.body);',
    '      const result = await queueService.enqueueDemoJob(payload.message);',
    '      response.status(201).json(result);',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  }',
    '}',
  );
  files['src/modules/queue/queue.route.ts'] = lines(
    "import { Router } from 'express';",
    '',
    "import { QueueController } from '@/modules/queue/queue.controller';",
    '',
    'const queueController = new QueueController();',
    '',
    'export const queueRouter = Router();',
    '',
    "queueRouter.post('/demo', (request, response, next) =>",
    '  queueController.enqueueDemo(request, response, next),',
    ');',
  );

  return normalizeNodeServerImports(files);
}

export function getCacheManagedPaths(
  architecture: NodeArchitecture,
): string[] {
  return architecture === 'clean'
    ? [
        'src/usecases/cache-demo.ts',
        'src/interfaces/controllers/cache.controller.ts',
        'src/interfaces/routes/cache.route.ts',
      ]
    : [
        'src/modules/cache/cache.service.ts',
        'src/modules/cache/cache.controller.ts',
        'src/modules/cache/cache.route.ts',
      ];
}

export function buildCacheFeatureFiles(
  context: NodeServerTemplateContext,
): Record<string, string> {
  if (context.architecture === 'clean') {
    return normalizeNodeServerImports({
      'src/usecases/cache-demo.ts': lines(
        "import redis from '@/infrastructure/redis/redis.client';",
        '',
        'export async function writeCacheValue(',
        '  key: string,',
        '  value: string,',
        '  ttlSeconds = 60,',
        ') {',
        '  await redis.set(key, value, "EX", ttlSeconds);',
        '',
        '  return { key, value, ttlSeconds };',
        '}',
        '',
        'export async function readCacheValue(key: string) {',
        '  return {',
        '    key,',
        '    value: (await redis.get(key)) ?? null,',
        '  };',
        '}',
      ),
      'src/interfaces/controllers/cache.controller.ts': lines(
        "import type { NextFunction, Request, Response } from 'express';",
        "import { z } from 'zod';",
        '',
        "import { readCacheValue, writeCacheValue } from '@/usecases/cache-demo';",
        '',
        'const cacheDemoSchema = z.object({',
        '  key: z.string().trim().min(1),',
        '  value: z.string().trim().min(1),',
        '  ttlSeconds: z.coerce.number().int().positive().max(86_400).optional(),',
        '});',
        '',
        'export async function setCacheDemo(',
        '  request: Request,',
        '  response: Response,',
        '  next: NextFunction,',
        '): Promise<void> {',
        '  try {',
        '    const payload = cacheDemoSchema.parse(request.body);',
        '    const result = await writeCacheValue(',
        '      payload.key,',
        '      payload.value,',
        '      payload.ttlSeconds,',
        '    );',
        '    response.status(201).json(result);',
        '  } catch (error) {',
        '    next(error);',
        '  }',
        '}',
        '',
        'export async function getCacheDemo(',
        '  request: Request,',
        '  response: Response,',
        '  next: NextFunction,',
        '): Promise<void> {',
        '  try {',
        '    const result = await readCacheValue(request.params.key);',
        '    response.status(200).json(result);',
        '  } catch (error) {',
        '    next(error);',
        '  }',
        '}',
      ),
      'src/interfaces/routes/cache.route.ts': lines(
        "import { Router } from 'express';",
        '',
        "import { getCacheDemo, setCacheDemo } from '@/interfaces/controllers/cache.controller';",
        '',
        'export const cacheRouter = Router();',
        '',
        "cacheRouter.post('/demo', setCacheDemo);",
        "cacheRouter.get('/demo/:key', getCacheDemo);",
      ),
    });
  }

  return normalizeNodeServerImports({
    'src/modules/cache/cache.service.ts': lines(
      "import redis from '@/infrastructure/redis/redis.client';",
      '',
      'export class CacheService {',
      '  async setDemoValue(key: string, value: string, ttlSeconds = 60) {',
      '    await redis.set(key, value, "EX", ttlSeconds);',
      '',
      '    return { key, value, ttlSeconds };',
      '  }',
      '',
      '  async getDemoValue(key: string) {',
      '    return {',
      '      key,',
      '      value: (await redis.get(key)) ?? null,',
      '    };',
      '  }',
      '}',
    ),
    'src/modules/cache/cache.controller.ts': lines(
      "import type { NextFunction, Request, Response } from 'express';",
      "import { z } from 'zod';",
      '',
      "import { CacheService } from '@/modules/cache/cache.service';",
      '',
      'const cacheDemoSchema = z.object({',
      '  key: z.string().trim().min(1),',
      '  value: z.string().trim().min(1),',
      '  ttlSeconds: z.coerce.number().int().positive().max(86_400).optional(),',
      '});',
      'const cacheService = new CacheService();',
      '',
      'export class CacheController {',
      '  async setDemo(',
      '    request: Request,',
      '    response: Response,',
      '    next: NextFunction,',
      '  ): Promise<void> {',
      '    try {',
      '      const payload = cacheDemoSchema.parse(request.body);',
      '      const result = await cacheService.setDemoValue(',
      '        payload.key,',
      '        payload.value,',
      '        payload.ttlSeconds,',
      '      );',
      '      response.status(201).json(result);',
      '    } catch (error) {',
      '      next(error);',
      '    }',
      '  }',
      '',
      '  async getDemo(',
      '    request: Request,',
      '    response: Response,',
      '    next: NextFunction,',
      '  ): Promise<void> {',
      '    try {',
      '      const result = await cacheService.getDemoValue(request.params.key);',
      '      response.status(200).json(result);',
      '    } catch (error) {',
      '      next(error);',
      '    }',
      '  }',
      '}',
    ),
    'src/modules/cache/cache.route.ts': lines(
      "import { Router } from 'express';",
      '',
      "import { CacheController } from '@/modules/cache/cache.controller';",
      '',
      'const cacheController = new CacheController();',
      '',
      'export const cacheRouter = Router();',
      '',
      "cacheRouter.post('/demo', (request, response, next) =>",
      '  cacheController.setDemo(request, response, next),',
      ');',
      "cacheRouter.get('/demo/:key', (request, response, next) =>",
      '  cacheController.getDemo(request, response, next),',
      ');',
    ),
  });
}

export const LLM_GUARD_DEPENDENCIES = ['openai'] as const;

export function getLlmManagedPaths(
  architecture: NodeArchitecture,
): string[] {
  return architecture === 'clean'
    ? [
        'src/usecases/run-llm-demo.ts',
        'src/interfaces/controllers/llm.controller.ts',
        'src/interfaces/routes/llm.route.ts',
      ]
    : [
        'src/modules/llm/llm.service.ts',
        'src/modules/llm/llm.controller.ts',
        'src/modules/llm/llm.route.ts',
      ];
}

export function buildLlmFeatureFiles(
  context: NodeServerTemplateContext,
): Record<string, string> {
  if (context.architecture === 'clean') {
    return normalizeNodeServerImports({
      'src/usecases/run-llm-demo.ts': lines(
        "import { env } from '@/config/env';",
        "import openai from '@/infrastructure/llm/openai.client';",
        '',
        'export async function runLlmDemo(prompt: string) {',
        '  const response = await openai.responses.create({',
        '    model: env.OPENAI_MODEL,',
        '    input: prompt,',
        '  });',
        '',
        '  return {',
        `    service: ${JSON.stringify(context.appName)},`,
        '    model: env.OPENAI_MODEL,',
        "    output: response.output_text || 'No output returned.',",
        '  };',
        '}',
      ),
      'src/interfaces/controllers/llm.controller.ts': lines(
        "import type { NextFunction, Request, Response } from 'express';",
        "import { z } from 'zod';",
        '',
        "import { runLlmDemo } from '@/usecases/run-llm-demo';",
        '',
        'const llmDemoSchema = z.object({',
        '  prompt: z.string().trim().min(1),',
        '});',
        '',
        'export async function runLlmDemoController(',
        '  request: Request,',
        '  response: Response,',
        '  next: NextFunction,',
        '): Promise<void> {',
        '  try {',
        '    const payload = llmDemoSchema.parse(request.body);',
        '    const result = await runLlmDemo(payload.prompt);',
        '    response.status(200).json(result);',
        '  } catch (error) {',
        '    next(error);',
        '  }',
        '}',
      ),
      'src/interfaces/routes/llm.route.ts': lines(
        "import { Router } from 'express';",
        '',
        "import { runLlmDemoController } from '@/interfaces/controllers/llm.controller';",
        '',
        'export const llmRouter = Router();',
        '',
        "llmRouter.post('/demo', runLlmDemoController);",
      ),
    });
  }

  return normalizeNodeServerImports({
    'src/modules/llm/llm.service.ts': lines(
      "import { env } from '@/config/env';",
      "import openai from '@/infrastructure/llm/openai.client';",
      '',
      'export class LlmService {',
      '  async runDemo(prompt: string) {',
      '    const response = await openai.responses.create({',
      '      model: env.OPENAI_MODEL,',
      '      input: prompt,',
      '    });',
      '',
      '    return {',
      `      service: ${JSON.stringify(context.appName)},`,
      '      model: env.OPENAI_MODEL,',
      "      output: response.output_text || 'No output returned.',",
      '    };',
      '  }',
      '}',
    ),
    'src/modules/llm/llm.controller.ts': lines(
      "import type { NextFunction, Request, Response } from 'express';",
      "import { z } from 'zod';",
      '',
      "import { LlmService } from '@/modules/llm/llm.service';",
      '',
      'const llmDemoSchema = z.object({',
      '  prompt: z.string().trim().min(1),',
      '});',
      'const llmService = new LlmService();',
      '',
      'export class LlmController {',
      '  async runDemo(',
      '    request: Request,',
      '    response: Response,',
      '    next: NextFunction,',
      '  ): Promise<void> {',
      '    try {',
      '      const payload = llmDemoSchema.parse(request.body);',
      '      const result = await llmService.runDemo(payload.prompt);',
      '      response.status(200).json(result);',
      '    } catch (error) {',
      '      next(error);',
      '    }',
      '  }',
      '}',
    ),
    'src/modules/llm/llm.route.ts': lines(
      "import { Router } from 'express';",
      '',
      "import { LlmController } from '@/modules/llm/llm.controller';",
      '',
      'const llmController = new LlmController();',
      '',
      'export const llmRouter = Router();',
      '',
      "llmRouter.post('/demo', (request, response, next) =>",
      '  llmController.runDemo(request, response, next),',
      ');',
    ),
  });
}

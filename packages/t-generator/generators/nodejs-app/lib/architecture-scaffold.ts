import type {
  InstalledNodeServerFeatures,
  NodeServerTemplateContext,
} from './types';
import { normalizeNodeServerImports } from './normalize-imports';

function lines(...content: string[]): string {
  return `${content.join('\n')}\n`;
}

function renderCleanAuthDomainFile(): string {
  return lines(
    "export interface AuthUser {",
    '  id: string;',
    '  email: string;',
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
  );
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

function renderCleanAuthUseCase(): string {
  return lines(
    "import type { AuthResponse, AuthUser } from '@/domain/auth';",
    "import type { LoginRequest, RefreshTokenRequest } from '@/shared/auth';",
    'import {',
    '  issueAuthTokens,',
    '  verifyRefreshToken,',
    "} from '@/shared/auth';",
    '',
    'export function login(request: LoginRequest): AuthResponse {',
    '  return issueAuthTokens(request.email);',
    '}',
    '',
    'export function refreshAuth(request: RefreshTokenRequest): AuthResponse {',
    '  const user = verifyRefreshToken(request.refreshToken);',
    '',
    '  return issueAuthTokens(user.email);',
    '}',
    '',
    'export function logoutAuth(',
    '  request: RefreshTokenRequest,',
    '): { success: true } {',
    '  verifyRefreshToken(request.refreshToken);',
    '',
    '  return { success: true };',
    '}',
    '',
    'export function getCurrentUser(user: AuthUser): AuthUser {',
    '  return user;',
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

function renderCleanAuthController(): string {
  return lines(
    "import type { NextFunction, Request, Response } from 'express';",
    '',
    "import type { AuthUser } from '@/domain/auth';",
    'import {',
    '  type AuthenticatedRequest,',
    '  loginRequestSchema,',
    '  refreshTokenRequestSchema,',
    "} from '@/shared/auth';",
    'import {',
    '  getCurrentUser,',
    '  login,',
    '  logoutAuth,',
    '  refreshAuth,',
    "} from '@/usecases/auth';",
    '',
    'export async function loginHandler(',
    '  request: Request,',
    '  response: Response,',
    '  next: NextFunction,',
    '): Promise<void> {',
    '  try {',
    '    const authRequest = loginRequestSchema.parse(request.body);',
    '    response.status(200).json(login(authRequest));',
    '  } catch (error) {',
    '    next(error);',
    '  }',
    '}',
    '',
    'export async function refreshHandler(',
    '  request: Request,',
    '  response: Response,',
    '  next: NextFunction,',
    '): Promise<void> {',
    '  try {',
    '    const authRequest = refreshTokenRequestSchema.parse(request.body);',
    '    response.status(200).json(refreshAuth(authRequest));',
    '  } catch (error) {',
    '    next(error);',
    '  }',
    '}',
    '',
    'export async function logoutHandler(',
    '  request: Request,',
    '  response: Response,',
    '  next: NextFunction,',
    '): Promise<void> {',
    '  try {',
    '    const authRequest = refreshTokenRequestSchema.parse(request.body);',
    '    response.status(200).json(logoutAuth(authRequest));',
    '  } catch (error) {',
    '    next(error);',
    '  }',
    '}',
    '',
    'export async function meHandler(',
    '  request: AuthenticatedRequest,',
    '  response: Response,',
    '  next: NextFunction,',
    '): Promise<void> {',
    '  try {',
    '    response.status(200).json(getCurrentUser(request.user as AuthUser));',
    '  } catch (error) {',
    '    next(error);',
    '  }',
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

function renderCleanAuthRoute(): string {
  return lines(
    "import { Router } from 'express';",
    '',
    'import {',
    '  loginHandler,',
    '  logoutHandler,',
    '  meHandler,',
    '  refreshHandler,',
    "} from '@/interfaces/controllers/auth.controller';",
    "import { requireAccessToken } from '@/shared/auth';",
    '',
    'export const authRouter = Router();',
    '',
    "authRouter.post('/login', loginHandler);",
    "authRouter.post('/refresh', refreshHandler);",
    "authRouter.post('/logout', logoutHandler);",
    "authRouter.get('/me', requireAccessToken, meHandler);",
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
    "export { authRouter } from './routes/auth.route';",
    "export { healthRouter } from './routes/health.route';",
    ...(features.queue ? ["export { queueRouter } from './routes/queue.route';"] : []),
    ...(features.cache ? ["export { cacheRouter } from './routes/cache.route';"] : []),
    ...(features.llm ? ["export { llmRouter } from './routes/llm.route';"] : []),
    ...(features.graphql
      ? ["export { registerGraphql } from './graphql/register-graphql.js';"]
      : []),
  );
}

function renderMvpAuthService(): string {
  return lines(
    "import type { LoginRequest, RefreshTokenRequest } from '@/shared/auth';",
    'import {',
    '  issueAuthTokens,',
    '  verifyRefreshToken,',
    "} from '@/shared/auth';",
    '',
    'export class AuthService {',
    '  login(request: LoginRequest) {',
    '    return issueAuthTokens(request.email);',
    '  }',
    '',
    '  refresh(request: RefreshTokenRequest) {',
    '    const user = verifyRefreshToken(request.refreshToken);',
    '',
    '    return issueAuthTokens(user.email);',
    '  }',
    '',
    '  logout(request: RefreshTokenRequest) {',
    '    verifyRefreshToken(request.refreshToken);',
    '',
    '    return { success: true as const };',
    '  }',
    '',
    '  me(user: { id: string; email: string }) {',
    '    return user;',
    '  }',
    '}',
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

function renderMvpAuthController(): string {
  return lines(
    "import type { NextFunction, Request, Response } from 'express';",
    '',
    "import { type AuthenticatedRequest, loginRequestSchema, refreshTokenRequestSchema } from '@/shared/auth';",
    "import { AuthService } from '@/modules/auth/auth.service';",
    '',
    'const authService = new AuthService();',
    '',
    'export class AuthController {',
    '  async login(',
    '    request: Request,',
    '    response: Response,',
    '    next: NextFunction,',
    '  ): Promise<void> {',
    '    try {',
    '      const authRequest = loginRequestSchema.parse(request.body);',
    '      response.status(200).json(authService.login(authRequest));',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  }',
    '',
    '  async refresh(',
    '    request: Request,',
    '    response: Response,',
    '    next: NextFunction,',
    '  ): Promise<void> {',
    '    try {',
    '      const authRequest = refreshTokenRequestSchema.parse(request.body);',
    '      response.status(200).json(authService.refresh(authRequest));',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  }',
    '',
    '  async logout(',
    '    request: Request,',
    '    response: Response,',
    '    next: NextFunction,',
    '  ): Promise<void> {',
    '    try {',
    '      const authRequest = refreshTokenRequestSchema.parse(request.body);',
    '      response.status(200).json(authService.logout(authRequest));',
    '    } catch (error) {',
    '      next(error);',
    '    }',
    '  }',
    '',
    '  async me(',
    '    request: AuthenticatedRequest,',
    '    response: Response,',
    '    next: NextFunction,',
    '  ): Promise<void> {',
    '    try {',
    '      response.status(200).json(authService.me(request.user!));',
    '    } catch (error) {',
    '      next(error);',
    '    }',
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

function renderMvpAuthRoute(): string {
  return lines(
    "import { Router } from 'express';",
    '',
    "import { AuthController } from '@/modules/auth/auth.controller';",
    "import { requireAccessToken } from '@/shared/auth';",
    '',
    'const authController = new AuthController();',
    '',
    'export const authRouter = Router();',
    '',
    "authRouter.post('/login', (request, response, next) =>",
    '  authController.login(request, response, next),',
    ');',
    "authRouter.post('/refresh', (request, response, next) =>",
    '  authController.refresh(request, response, next),',
    ');',
    "authRouter.post('/logout', (request, response, next) =>",
    '  authController.logout(request, response, next),',
    ');',
    "authRouter.get('/me', requireAccessToken, (request, response, next) =>",
    '  authController.me(request, response, next),',
    ');',
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
    "export { authRouter } from './auth/auth.route';",
    "export { healthRouter } from './health/health.route';",
    ...(features.queue ? ["export { queueRouter } from './queue/queue.route';"] : []),
    ...(features.cache ? ["export { cacheRouter } from './cache/cache.route';"] : []),
    ...(features.llm ? ["export { llmRouter } from './llm/llm.route';"] : []),
    ...(features.graphql
      ? ["export { registerGraphql } from './graphql/register-graphql.js';"]
      : []),
  );
}

export function buildNodeServerArchitectureScaffold(
  context: NodeServerTemplateContext,
  features: InstalledNodeServerFeatures,
): Record<string, string> {
  if (context.architecture === 'clean') {
    return normalizeNodeServerImports({
      'src/domain/auth.ts': renderCleanAuthDomainFile(),
      'src/domain/health.ts': renderCleanDomainFile(),
      'src/infrastructure/repositories/health.repository.ts':
        renderCleanHealthRepository(),
      'src/usecases/auth.ts': renderCleanAuthUseCase(),
      'src/usecases/check-health.ts': renderCleanHealthUseCase(context),
      'src/interfaces/controllers/auth.controller.ts':
        renderCleanAuthController(),
      'src/interfaces/controllers/health.controller.ts':
        renderCleanHealthController(),
      'src/interfaces/routes/auth.route.ts': renderCleanAuthRoute(),
      'src/interfaces/routes/health.route.ts': renderCleanHealthRoute(),
      'src/interfaces/index.ts': renderCleanIndex(features),
    });
  }

  return normalizeNodeServerImports({
    'src/modules/auth/auth.controller.ts': renderMvpAuthController(),
    'src/modules/auth/auth.route.ts': renderMvpAuthRoute(),
    'src/modules/auth/auth.service.ts': renderMvpAuthService(),
    'src/modules/health/health.repository.ts': renderMvpHealthRepository(),
    'src/modules/health/health.service.ts': renderMvpHealthService(context),
    'src/modules/health/health.controller.ts': renderMvpHealthController(),
    'src/modules/health/health.route.ts': renderMvpHealthRoute(),
    'src/modules/index.ts': renderMvpIndex(features),
  });
}

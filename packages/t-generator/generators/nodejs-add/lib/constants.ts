export const REQUIRED_BASE_SCRIPTS = [
  'postinstall',
  'start',
  'dev',
  'build',
  'lint',
  'test',
  'prisma:generate',
  'prisma:migrate:dev',
];

export const REQUIRED_BASE_FILES = [
  'src/app.ts',
  'src/config/env.ts',
  'src/server.ts',
  'src/infrastructure/prisma/prisma.ts',
  'prisma/schema.prisma',
];

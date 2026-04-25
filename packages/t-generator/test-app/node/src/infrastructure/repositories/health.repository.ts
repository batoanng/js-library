import prisma from '../prisma/prisma';

export async function getDatabaseStatus(): Promise<
  'connected' | 'error'
> {
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    return 'connected';
  } catch {
    return 'error';
  }
}

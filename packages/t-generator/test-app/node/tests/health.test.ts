import request from 'supertest';

import { createApp } from '../src/app';
import prisma from '../src/infrastructure/prisma/prisma';

jest.mock('../src/infrastructure/prisma/prisma', () => ({
  __esModule: true,
  default: {
    $disconnect: jest.fn(),
    $queryRawUnsafe: jest.fn(),
  },
}));

describe('GET /health', () => {
  it('returns the generated service name when the database is reachable', async () => {
    const app = await createApp();
    const prismaMock = prisma as {
      $queryRawUnsafe: jest.Mock;
    };

    prismaMock.$queryRawUnsafe.mockResolvedValue([{ ok: 1 }]);

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'UP',
      service: "node",
      database: 'connected',
    });
  });
});

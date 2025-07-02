import { sleep } from '../sleep';

describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('waits for the specified time', async () => {
    const sleepPromise = sleep(1000);

    // Fast-forward time
    jest.advanceTimersByTime(1000);

    await expect(sleepPromise).resolves.toBeUndefined();
  });

  it('uses default delay when no argument is provided', async () => {
    const sleepPromise = sleep();

    jest.advanceTimersByTime(500);

    await expect(sleepPromise).resolves.toBeUndefined();
  });
});

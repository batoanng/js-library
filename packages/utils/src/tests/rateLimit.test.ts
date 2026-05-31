import { FixedWindowRateLimiter, LeakyBucketRateLimiter, SlidingWindowRateLimiter } from '../rateLimit';

describe('LeakyBucketRateLimiter', () => {
  test('allows up to capacity and rejects overflow', () => {
    const limiter = new LeakyBucketRateLimiter({
      capacity: 2,
      leakRatePerSecond: 2,
      now: () => 0,
    });

    expect(limiter.check()).toMatchObject({
      key: 'default',
      allowed: true,
      limit: 2,
      used: 1,
      remaining: 1,
      retryAfterMs: 0,
    });
    expect(limiter.check().allowed).toBe(true);

    const rejected = limiter.check();

    expect(rejected).toMatchObject({
      allowed: false,
      limit: 2,
      used: 2,
      remaining: 0,
      retryAfterMs: 500,
    });
  });

  test('leaks capacity over time and allows requests again', () => {
    let now = 0;
    const limiter = new LeakyBucketRateLimiter({
      capacity: 2,
      leakRatePerSecond: 2,
      now: () => now,
    });

    expect(limiter.check('client-a').allowed).toBe(true);
    expect(limiter.check('client-a').allowed).toBe(true);
    expect(limiter.check('client-a').allowed).toBe(false);

    now = 500;

    const retried = limiter.check('client-a');

    expect(retried.allowed).toBe(true);
    expect(retried.used).toBe(2);
    expect(retried.remaining).toBe(0);
  });

  test('tracks keys independently', () => {
    const limiter = new LeakyBucketRateLimiter({
      capacity: 1,
      leakRatePerSecond: 1,
      now: () => 0,
    });

    expect(limiter.check('client-a').allowed).toBe(true);
    expect(limiter.check('client-b').allowed).toBe(true);
    expect(limiter.check('client-a').allowed).toBe(false);
    expect(limiter.check('client-b').allowed).toBe(false);
    expect(limiter.getTrackedKeyCount()).toBe(2);
  });

  test('returns snapshots and supports reset and clear', () => {
    const limiter = new LeakyBucketRateLimiter({
      capacity: 1,
      leakRatePerSecond: 1,
      now: () => 0,
    });

    expect(limiter.getSnapshot()).toMatchObject({
      allowed: true,
      used: 0,
      remaining: 1,
    });

    limiter.check('client-a');
    limiter.check('client-b');
    expect(limiter.getTrackedKeyCount()).toBe(2);

    limiter.reset('client-a');
    expect(limiter.getTrackedKeyCount()).toBe(1);
    expect(limiter.getSnapshot('client-a')).toMatchObject({
      allowed: true,
      used: 0,
      remaining: 1,
    });

    limiter.clear();
    expect(limiter.getTrackedKeyCount()).toBe(0);
  });

  test('validates constructor options', () => {
    expect(() => new LeakyBucketRateLimiter({ capacity: 0, leakRatePerSecond: 1 })).toThrow(
      'capacity must be a positive finite number.'
    );
    expect(() => new LeakyBucketRateLimiter({ capacity: 1, leakRatePerSecond: Number.POSITIVE_INFINITY })).toThrow(
      'leakRatePerSecond must be a positive finite number.'
    );
  });
});

describe('FixedWindowRateLimiter', () => {
  test('allows up to the limit and rejects inside the same window', () => {
    let now = 0;
    const limiter = new FixedWindowRateLimiter({
      limit: 2,
      windowMs: 1000,
      now: () => now,
    });

    expect(limiter.check('client-a')).toMatchObject({
      allowed: true,
      used: 1,
      remaining: 1,
      retryAfterMs: 0,
    });
    expect(limiter.check('client-a').allowed).toBe(true);

    now = 999;

    expect(limiter.check('client-a')).toMatchObject({
      allowed: false,
      used: 2,
      remaining: 0,
      retryAfterMs: 1,
    });
  });

  test('resets counts after the fixed window rolls over', () => {
    let now = 999;
    const limiter = new FixedWindowRateLimiter({
      limit: 1,
      windowMs: 1000,
      now: () => now,
    });

    expect(limiter.check('client-a').allowed).toBe(true);
    expect(limiter.check('client-a').allowed).toBe(false);

    now = 1000;

    expect(limiter.check('client-a')).toMatchObject({
      allowed: true,
      used: 1,
      remaining: 0,
      retryAfterMs: 0,
    });
  });

  test('tracks keys independently', () => {
    const limiter = new FixedWindowRateLimiter({
      limit: 1,
      windowMs: 1000,
      now: () => 0,
    });

    expect(limiter.check('client-a').allowed).toBe(true);
    expect(limiter.check('client-b').allowed).toBe(true);
    expect(limiter.check('client-a').allowed).toBe(false);
    expect(limiter.check('client-b').allowed).toBe(false);
    expect(limiter.getTrackedKeyCount()).toBe(2);
  });

  test('returns snapshots and supports reset and clear', () => {
    const limiter = new FixedWindowRateLimiter({
      limit: 1,
      windowMs: 1000,
      now: () => 0,
    });

    expect(limiter.getSnapshot()).toMatchObject({
      key: 'default',
      allowed: true,
      used: 0,
      remaining: 1,
    });

    limiter.check('client-a');
    limiter.check('client-b');
    expect(limiter.getTrackedKeyCount()).toBe(2);

    limiter.reset('client-a');
    expect(limiter.getTrackedKeyCount()).toBe(1);

    limiter.clear();
    expect(limiter.getTrackedKeyCount()).toBe(0);
  });

  test('validates constructor options', () => {
    expect(() => new FixedWindowRateLimiter({ limit: Number.NaN, windowMs: 1000 })).toThrow(
      'limit must be a positive finite number.'
    );
    expect(() => new FixedWindowRateLimiter({ limit: 1, windowMs: 0 })).toThrow(
      'windowMs must be a positive finite number.'
    );
  });
});

describe('SlidingWindowRateLimiter', () => {
  test('uses an exact sliding window that rejects boundary gaming', () => {
    let now = 900;
    const limiter = new SlidingWindowRateLimiter({
      limit: 2,
      windowMs: 1000,
      now: () => now,
    });

    expect(limiter.check('client-a').allowed).toBe(true);
    expect(limiter.check('client-a').allowed).toBe(true);

    now = 1000;

    expect(limiter.check('client-a')).toMatchObject({
      allowed: false,
      used: 2,
      remaining: 0,
      retryAfterMs: 900,
    });
  });

  test('evicts expired timestamps and allows requests again', () => {
    let now = 0;
    const limiter = new SlidingWindowRateLimiter({
      limit: 1,
      windowMs: 1000,
      now: () => now,
    });

    expect(limiter.check('client-a').allowed).toBe(true);
    expect(limiter.check('client-a').allowed).toBe(false);

    now = 1000;

    expect(limiter.check('client-a')).toMatchObject({
      allowed: true,
      used: 1,
      remaining: 0,
      retryAfterMs: 0,
    });
  });

  test('tracks keys independently', () => {
    const limiter = new SlidingWindowRateLimiter({
      limit: 1,
      windowMs: 1000,
      now: () => 0,
    });

    expect(limiter.check('client-a').allowed).toBe(true);
    expect(limiter.check('client-b').allowed).toBe(true);
    expect(limiter.check('client-a').allowed).toBe(false);
    expect(limiter.check('client-b').allowed).toBe(false);
    expect(limiter.getTrackedKeyCount()).toBe(2);
  });

  test('returns snapshots and supports reset and clear', () => {
    const limiter = new SlidingWindowRateLimiter({
      limit: 1,
      windowMs: 1000,
      now: () => 0,
    });

    expect(limiter.getSnapshot()).toMatchObject({
      key: 'default',
      allowed: true,
      used: 0,
      remaining: 1,
    });

    limiter.check('client-a');
    limiter.check('client-b');
    expect(limiter.getTrackedKeyCount()).toBe(2);

    limiter.reset('client-a');
    expect(limiter.getTrackedKeyCount()).toBe(1);

    limiter.clear();
    expect(limiter.getTrackedKeyCount()).toBe(0);
  });

  test('validates constructor options', () => {
    expect(() => new SlidingWindowRateLimiter({ limit: -1, windowMs: 1000 })).toThrow(
      'limit must be a positive finite number.'
    );
    expect(() => new SlidingWindowRateLimiter({ limit: 1, windowMs: Number.POSITIVE_INFINITY })).toThrow(
      'windowMs must be a positive finite number.'
    );
  });
});

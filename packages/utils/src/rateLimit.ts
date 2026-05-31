import { Queue } from '@batoanng/types';

const DEFAULT_KEY = 'default';

export type RateLimitCheckResult = {
  key: string;
  allowed: boolean;
  limit: number;
  used: number;
  remaining: number;
  retryAfterMs: number;
};

export type LeakyBucketRateLimiterOptions = {
  capacity: number;
  leakRatePerSecond: number;
  now?: () => number;
};

export type FixedWindowRateLimiterOptions = {
  limit: number;
  windowMs: number;
  now?: () => number;
};

export type SlidingWindowRateLimiterOptions = {
  limit: number;
  windowMs: number;
  now?: () => number;
};

type LeakyBucketState = {
  level: number;
  lastUpdatedAt: number;
};

type FixedWindowState = {
  count: number;
  windowStart: number;
};

type SlidingWindowState = {
  timestamps: Queue<number>;
};

const resolveKey = (key?: string) => key ?? DEFAULT_KEY;

const validatePositiveFiniteNumber = (name: string, value: number): void => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive finite number.`);
  }
};

export class LeakyBucketRateLimiter {
  private readonly capacity: number;
  private readonly leakRatePerSecond: number;
  private readonly now: () => number;
  private readonly buckets = new Map<string, LeakyBucketState>();

  constructor({ capacity, leakRatePerSecond, now = Date.now }: LeakyBucketRateLimiterOptions) {
    validatePositiveFiniteNumber('capacity', capacity);
    validatePositiveFiniteNumber('leakRatePerSecond', leakRatePerSecond);

    this.capacity = capacity;
    this.leakRatePerSecond = leakRatePerSecond;
    this.now = now;
  }

  check(key?: string): RateLimitCheckResult {
    const resolvedKey = resolveKey(key);
    const timestamp = this.now();
    const state = this.getOrCreateState(resolvedKey, timestamp);
    state.level = this.getLeakedLevel(state, timestamp);
    state.lastUpdatedAt = timestamp;

    if (state.level + 1 > this.capacity) {
      return this.createResult(resolvedKey, state, false, timestamp);
    }

    state.level += 1;
    return this.createResult(resolvedKey, state, true, timestamp);
  }

  getSnapshot(key?: string): RateLimitCheckResult {
    const resolvedKey = resolveKey(key);
    const timestamp = this.now();
    const state = this.buckets.get(resolvedKey);

    if (!state) {
      return this.buildResult(resolvedKey, 0, true, 0);
    }

    const level = this.getLeakedLevel(state, timestamp);
    return this.buildResult(resolvedKey, level, level + 1 <= this.capacity, this.getRetryAfterMs(level));
  }

  reset(key?: string): void {
    this.buckets.delete(resolveKey(key));
  }

  clear(): void {
    this.buckets.clear();
  }

  getTrackedKeyCount(): number {
    return this.buckets.size;
  }

  private getOrCreateState(key: string, timestamp: number): LeakyBucketState {
    const existing = this.buckets.get(key);

    if (existing) {
      return existing;
    }

    const state = {
      level: 0,
      lastUpdatedAt: timestamp,
    };

    this.buckets.set(key, state);
    return state;
  }

  private getLeakedLevel(state: LeakyBucketState, timestamp: number): number {
    const elapsedMs = Math.max(0, timestamp - state.lastUpdatedAt);
    const leaked = (elapsedMs * this.leakRatePerSecond) / 1000;
    return Math.max(0, state.level - leaked);
  }

  private createResult(
    key: string,
    state: LeakyBucketState,
    allowed: boolean,
    timestamp: number
  ): RateLimitCheckResult {
    const level = this.getLeakedLevel(state, timestamp);
    return this.buildResult(key, level, allowed, allowed ? 0 : this.getRetryAfterMs(level));
  }

  private buildResult(key: string, used: number, allowed: boolean, retryAfterMs: number): RateLimitCheckResult {
    return {
      key,
      allowed,
      limit: this.capacity,
      used,
      remaining: Math.max(0, this.capacity - used),
      retryAfterMs,
    };
  }

  private getRetryAfterMs(level: number): number {
    if (level + 1 <= this.capacity) {
      return 0;
    }

    return Math.ceil(((level + 1 - this.capacity) / this.leakRatePerSecond) * 1000);
  }
}

export class FixedWindowRateLimiter {
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;
  private readonly windows = new Map<string, FixedWindowState>();

  constructor({ limit, windowMs, now = Date.now }: FixedWindowRateLimiterOptions) {
    validatePositiveFiniteNumber('limit', limit);
    validatePositiveFiniteNumber('windowMs', windowMs);

    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
  }

  check(key?: string): RateLimitCheckResult {
    const resolvedKey = resolveKey(key);
    const timestamp = this.now();
    const state = this.getOrCreateState(resolvedKey, timestamp);

    if (state.count >= this.limit) {
      return this.buildResult(resolvedKey, state.count, false, this.getRetryAfterMs(state, timestamp));
    }

    state.count += 1;
    return this.buildResult(resolvedKey, state.count, true, 0);
  }

  getSnapshot(key?: string): RateLimitCheckResult {
    const resolvedKey = resolveKey(key);
    const timestamp = this.now();
    const state = this.windows.get(resolvedKey);

    if (!state || this.isExpired(state, timestamp)) {
      return this.buildResult(resolvedKey, 0, true, 0);
    }

    const allowed = state.count < this.limit;
    return this.buildResult(resolvedKey, state.count, allowed, allowed ? 0 : this.getRetryAfterMs(state, timestamp));
  }

  reset(key?: string): void {
    this.windows.delete(resolveKey(key));
  }

  clear(): void {
    this.windows.clear();
  }

  getTrackedKeyCount(): number {
    return this.windows.size;
  }

  private getOrCreateState(key: string, timestamp: number): FixedWindowState {
    const existing = this.windows.get(key);

    if (existing && !this.isExpired(existing, timestamp)) {
      return existing;
    }

    const state = {
      count: 0,
      windowStart: this.getWindowStart(timestamp),
    };

    this.windows.set(key, state);
    return state;
  }

  private isExpired(state: FixedWindowState, timestamp: number): boolean {
    return this.getWindowStart(timestamp) !== state.windowStart;
  }

  private getWindowStart(timestamp: number): number {
    return Math.floor(timestamp / this.windowMs) * this.windowMs;
  }

  private getRetryAfterMs(state: FixedWindowState, timestamp: number): number {
    return Math.max(0, state.windowStart + this.windowMs - timestamp);
  }

  private buildResult(key: string, used: number, allowed: boolean, retryAfterMs: number): RateLimitCheckResult {
    return {
      key,
      allowed,
      limit: this.limit,
      used,
      remaining: Math.max(0, this.limit - used),
      retryAfterMs,
    };
  }
}

export class SlidingWindowRateLimiter {
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;
  private readonly windows = new Map<string, SlidingWindowState>();

  constructor({ limit, windowMs, now = Date.now }: SlidingWindowRateLimiterOptions) {
    validatePositiveFiniteNumber('limit', limit);
    validatePositiveFiniteNumber('windowMs', windowMs);

    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
  }

  check(key?: string): RateLimitCheckResult {
    const resolvedKey = resolveKey(key);
    const timestamp = this.now();
    const state = this.getOrCreateState(resolvedKey);
    this.evictExpiredTimestamps(state, timestamp);

    if (state.timestamps.size >= this.limit) {
      return this.buildResult(resolvedKey, state, false, timestamp);
    }

    state.timestamps.enqueue(timestamp);
    return this.buildResult(resolvedKey, state, true, timestamp);
  }

  getSnapshot(key?: string): RateLimitCheckResult {
    const resolvedKey = resolveKey(key);
    const timestamp = this.now();
    const state = this.windows.get(resolvedKey);

    if (!state) {
      return this.createEmptyResult(resolvedKey);
    }

    this.evictExpiredTimestamps(state, timestamp);
    return this.buildResult(resolvedKey, state, state.timestamps.size < this.limit, timestamp);
  }

  reset(key?: string): void {
    this.windows.delete(resolveKey(key));
  }

  clear(): void {
    this.windows.clear();
  }

  getTrackedKeyCount(): number {
    return this.windows.size;
  }

  private getOrCreateState(key: string): SlidingWindowState {
    const existing = this.windows.get(key);

    if (existing) {
      return existing;
    }

    const state = {
      timestamps: new Queue<number>(),
    };

    this.windows.set(key, state);
    return state;
  }

  private evictExpiredTimestamps(state: SlidingWindowState, timestamp: number): void {
    const cutoff = timestamp - this.windowMs;

    while (!state.timestamps.isEmpty()) {
      const oldest = state.timestamps.peek();

      if (oldest === undefined || oldest > cutoff) {
        return;
      }

      state.timestamps.dequeue();
    }
  }

  private buildResult(
    key: string,
    state: SlidingWindowState,
    allowed: boolean,
    timestamp: number
  ): RateLimitCheckResult {
    const retryAfterMs = allowed ? 0 : this.getRetryAfterMs(state, timestamp);

    return {
      key,
      allowed,
      limit: this.limit,
      used: state.timestamps.size,
      remaining: Math.max(0, this.limit - state.timestamps.size),
      retryAfterMs,
    };
  }

  private createEmptyResult(key: string): RateLimitCheckResult {
    return {
      key,
      allowed: true,
      limit: this.limit,
      used: 0,
      remaining: this.limit,
      retryAfterMs: 0,
    };
  }

  private getRetryAfterMs(state: SlidingWindowState, timestamp: number): number {
    const oldest = state.timestamps.peek();

    if (oldest === undefined) {
      return 0;
    }

    return Math.max(0, oldest + this.windowMs - timestamp);
  }
}

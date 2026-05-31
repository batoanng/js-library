# @batoanng/utils

[![npm version](https://img.shields.io/npm/v/@batoanng/utils)](https://www.npmjs.com/package/@batoanng/utils)
[![install size](https://packagephobia.com/badge?p=@batoanng/utils)](https://packagephobia.com/result?p=@batoanng/utils)

A collection of general-purpose utility functions and React hooks used across multiple packages and applications.

---

## ✨ Features

- ✅ Typed utility functions (e.g. sleep, slugify, short ID generator)
- ⚙️ Server + client-safe helpers
- 🚦 In-memory rate limiter classes
- 🪝 React hooks like `usePrevious` and `useIsomorphicLayoutEffect`
- 🧪 Unit tested with Jest
- 📦 Lightweight and tree-shakable

---

## 📦 Installation

```bash
npm install @batoanng/utils
```

---

## 🚀 Usage

```ts
import { sleep, generateShortId } from '@batoanng/utils';
```

```tsx
import { usePrevious } from '@batoanng/utils';
```

### Rate limiting

```ts
import { FixedWindowRateLimiter, LeakyBucketRateLimiter, SlidingWindowRateLimiter } from '@batoanng/utils';

const apiLimiter = new LeakyBucketRateLimiter({
  capacity: 100,
  leakRatePerSecond: 50,
});

const loginLimiter = new FixedWindowRateLimiter({
  limit: 20,
  windowMs: 24 * 60 * 60 * 1000,
});

const withdrawalLimiter = new SlidingWindowRateLimiter({
  limit: 5,
  windowMs: 24 * 60 * 60 * 1000,
});

const result = apiLimiter.check('client-id');

if (!result.allowed) {
  console.log(`Retry after ${result.retryAfterMs}ms`);
}
```

Choose the limiter based on the traffic shape:

- `LeakyBucketRateLimiter`: smooths bursty traffic into a steady drain rate.
- `FixedWindowRateLimiter`: enforces simple limits per fixed interval, such as requests per day.
- `SlidingWindowRateLimiter`: enforces an exact moving-window limit when boundary accuracy matters.

All limiter classes expose the same methods:

- `check(key?)`
- `getSnapshot(key?)`
- `reset(key?)`
- `clear()`
- `getTrackedKeyCount()`

`key` defaults to `"default"` for single-resource limits. Pass a user, client, or resource ID to track limits independently.

---

## 📁 Included Utilities

```
src/
├── generateShortId.ts              # Short random string generator
├── getNormalisedError.ts           # Transforms mixed errors to unified format
├── rateLimit.ts                    # In-memory rate limiter classes
├── SearchSpecBuilder.ts            # Siebel-like query builder for filters
├── sleep.ts                        # Delay function using Promise
├── toSlug.ts                       # Converts string to URL-friendly slug
├── useIsomorphicLayoutEffect.tsx  # SSR-safe useLayoutEffect
├── usePrevious.tsx                # React hook to get previous value
```

---

## 🧹 Linting

This package uses the shared flat ESLint setup via [`eslint.config.mjs`](./eslint.config.mjs):

```js
import base from '@batoanng/eslint-config/base';
import test from '@batoanng/eslint-config/test';

export default [...base, ...test];
```

# @batoanng/utils

[![npm version](https://img.shields.io/npm/v/@batoanng/utils)](https://www.npmjs.com/package/@batoanng/utils)
[![install size](https://packagephobia.com/badge?p=@batoanng/utils)](https://packagephobia.com/result?p=@batoanng/utils)

A collection of general-purpose utility functions and React hooks used across multiple packages and applications.

---

## ✨ Features

- ✅ Typed utility functions (e.g. sleep, slugify, short ID generator)
- ⚙️ Server + client-safe helpers
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

---

## 📁 Included Utilities

```
src/
├── generateShortId.ts              # Short random string generator
├── getNormalisedError.ts           # Transforms mixed errors to unified format
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

# @batoanng/types

[![npm version](https://img.shields.io/npm/v/@batoanng/types)](https://www.npmjs.com/package/@batoanng/types)
[![install size](https://packagephobia.com/badge?p=@batoanng/types)](https://packagephobia.com/result?p=@batoanng/types)

A shared type definitions package to centralize domain models and common typings across a monorepo or multiple applications.

---

## ✨ Features

- ✅ Typed error handling interfaces
- 📦 Reusable payload and validation error types
- 🧱 Centralized definitions for consistent API contracts
- 🔄 Ideal for frontend-backend type sharing in fullstack apps
- 📁 Organized under `src/errors/` for separation of concerns

---

## 📦 Installation

```bash
npm install -D @batoanng/types
```

---

## 🧰 Usage

Import shared error types anywhere in your app:

```ts
import type { ApiError, NormalisedError } from '@batoanng/types/errors';
```

Or from the main entry:

```ts
import { NormalisedError } from '@batoanng/types';
```

> 📌 These types are pure and have no runtime cost.

---

## 📁 Structure

```
src/
├── errors/
│   ├── ApiError.ts             # Structured API error shape
│   ├── ErrorWithMessage.ts     # Generic JS Error wrapper
│   ├── NormalisableError.ts    # Union of all supported error shapes
│   ├── NormalisedError.ts      # Parsed + user-presentable error
│   ├── PayloadError.ts         # Error with custom payload
│   ├── ValidationError.ts      # Validation-aware error type
│   └── index.ts                # Barrel export for all error types
├── index.tsx                   # Top-level re-exports
```

---

## 🧪 Example

```ts
function handleError(error: NormalisableError): NormalisedError {
  // normalise and present error to user
}
```

---

## ✅ Recommended With

- `@batoanng/jest-config`: for asserting and testing typed error shapes
- `@batoanng/eslint-config`: for enforcing typing best practices

---

## 🧹 Linting

This package uses the shared flat ESLint base config via [`eslint.config.mjs`](./eslint.config.mjs):

```js
import base from '@batoanng/eslint-config/base';

export default [...base];
```

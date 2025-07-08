# @batoanng/vite-config

[![npm version](https://img.shields.io/npm/v/@batoanng/vite-config)](https://www.npmjs.com/package/@batoanng/vite-config)
[![install size](https://packagephobia.com/badge?p=@batoanng/vite-config)](https://packagephobia.com/result?p=@batoanng/vite-config)

Shared Vite configuration to standardize frontend builds across projects using React, TypeScript, and Vitest.

---

## ✨ Features

- ⚡ Pre-configured Vite settings for React projects
- 🎯 Supports TypeScript, JSX, aliases, and asset handling
- 🧪 Vitest test setup with custom environment and plugins
- 📦 Ideal for libraries and applications alike
- 🧩 Easily extendable in consuming apps

---

## 📦 Installation

```bash
pnpm add -D @batoanng/vite-config
```

---

## 🚀 Usage

### `vite.config.js`

```js
import baseConfig from '@batoanng/vite-config/vite.config';
export default baseConfig;
```

### `vitest.config.js`

```js
import config from '@batoanng/vite-config/vitest.config';
export default config;
```

---

## 🔧 Customization

To override or extend Vite config:

```js
import baseConfig from '@batoanng/vite-config/vite.config';
import { defineConfig, mergeConfig } from 'vite';

export default mergeConfig(baseConfig, {
  // Add your custom overrides here
  define: {
    __DEV__: true,
  },
});
```

---

## 🧪 Test Setup

- `vitest.config.js`: Base Vitest configuration for TypeScript + JSX
- `vitest.setup.ts`: Registers testing utilities and mocks

```ts
// vite.config.ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['@batoanng/vite-config/vitest.setup.ts'],
}
```

---

## 📁 Files Overview

```
vite-config/
├── index.js              # Optional re-exports
├── vite.config.js        # Main Vite base config
├── vitest.config.js      # Shared Vitest config
├── vitest.setup.ts       # Test setup file (e.g., global mocks, DOM helpers)
```

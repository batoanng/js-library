# @batoanng/tsconfig

[![npm version](https://img.shields.io/npm/v/@batoanng/tsconfig)](https://www.npmjs.com/package/@batoanng/tsconfig)
[![install size](https://packagephobia.com/badge?p=@batoanng/tsconfig)](https://packagephobia.com/result?p=@batoanng/tsconfig)

A set of shareable TypeScript configuration presets designed for consistency across Node.js, React, Next.js, libraries, and tooling within a monorepo.

---

## ✨ Features

- Strict type-checking across all environments
- Modern module and target settings
- Multiple environment presets:
  - Node.js (v14 and v20)
  - React library development
  - Next.js projects
  - ESLint integration
- Built-in `base.json` to centralize core rules
- Easy to extend across packages and apps

---

## 📦 Installation

```bash
npm install -D @batoanng/tsconfig typescript
```

---

## 🚀 Usage

In your `tsconfig.json`, extend the desired preset:

### For a React component library

```json
{
  "extends": "@batoanng/tsconfig/react-library.json"
}
```

### For a Next.js app

```json
{
  "extends": "@batoanng/tsconfig/nextjs.json"
}
```

### For Node.js (v20)

```json
{
  "extends": "@batoanng/tsconfig/node20.json"
}
```

### For ESLint

```json
{
  "extends": "@batoanng/tsconfig/eslint.json"
}
```

---

## 🧱 Available Configs

| File                | Purpose                                 |
|---------------------|-----------------------------------------|
| `base.json`         | Core rules shared across all configs    |
| `eslint.json`       | Used by ESLint TypeScript parser        |
| `nextjs.json`       | For Next.js frontend apps               |
| `node14.json`       | For Node.js services using v14          |
| `node20.json`       | For modern Node.js apps (v20+)          |
| `react-library.json`| For React-based npm libraries           |

---

## 🛠 Example `tsconfig.json`

```json
{
  "extends": "@batoanng/tsconfig/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
```

---

## 🔒 Strictness & Quality

All presets inherit from `base.json` which includes:

```json
{
  "compilerOptions": {
    "composite": false,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": false,
    "isolatedModules": true,
    "moduleResolution": "node",
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true,
    "skipLibCheck": true,
    "strict": true
  },
  "exclude": ["node_modules"]
}
```

# @batoanng/tsconfig

[![npm version](https://img.shields.io/npm/v/@batoanng/tsconfig)](https://www.npmjs.com/package/@batoanng/tsconfig)
[![install size](https://packagephobia.com/badge?p=@batoanng/tsconfig)](https://packagephobia.com/result?p=@batoanng/tsconfig)

A set of shareable TypeScript configuration presets designed for consistency across Node.js, React, Next.js, and tooling within a monorepo.

---

## ✨ Features

- Strict type-checking across all environments
- Modern module and target settings
- Multiple environment presets:
  - Node.js (v22+)
  - React apps and libraries
  - Next.js projects
  - Optional tooling support for legacy ESLint TypeScript parser setups
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

### For a React app or component library

```json
{
  "extends": "@batoanng/tsconfig/reactjs.json"
}
```

### For a Next.js app

```json
{
  "extends": "@batoanng/tsconfig/nextjs.json"
}
```

### For Node.js (v22+)

```json
{
  "extends": "@batoanng/tsconfig/node24.json"
}
```

### For legacy ESLint parser projects only

```json
{
  "extends": "@batoanng/tsconfig/eslint.json"
}
```

> The shared [`@batoanng/eslint-config`](../eslint-config/README.md) package now uses ESLint flat config with `projectService`, so it no longer depends on this preset.

---

## 🧱 Available Configs

| File           | Purpose                                    |
|----------------|--------------------------------------------|
| `base.json`    | Core rules shared across all configs       |
| `eslint.json`  | Optional TS parser preset for legacy ESLint setups |
| `nextjs.json`  | For Next.js frontend apps                  |
| `node24.json`  | For modern Node.js apps and libraries      |
| `reactjs.json` | For React-based apps and libraries         |

---

## 🛠 Example `tsconfig.json`

```json
{
  "extends": "@batoanng/tsconfig/reactjs.json",
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

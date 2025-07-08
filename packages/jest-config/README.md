# @batoanng/jest-config

[![npm version](https://img.shields.io/npm/v/@batoanng/jest-config)](https://www.npmjs.com/package/@batoanng/jest-config)
[![install size](https://packagephobia.com/badge?p=@batoanng/jest-config)](https://packagephobia.com/result?p=@batoanng/jest-config)

A collection of pre-configured Jest setups for modern TypeScript projects across different frameworks like **Next.js**, **NestJS**, and **Node** with support for **esbuild**, **JSDOM**, and **custom test environments**.

---

## ✨ Features

- Multiple Jest presets:
  - `common`: base config for any TypeScript repo
  - `next`: optimized for Next.js
  - `nest`: tailored for NestJS
  - `esbuild`: fast builds with esbuild support
- Custom global setups via `jest.setup.js` and `esbuild-jest.setup.js`
- JSDOM, environment, and transform preconfigured
- Designed for monorepo or standalone repo usage

---

## 📦 Installation

```bash
npm install -D jest @batoanng/jest-config
```

You may also need to install peer dependencies:

```bash
npm install -D ts-jest jest-environment-jsdom @testing-library/react @types/jest
```

For esbuild support:

```bash
npm install -D esbuild jest-esbuild
```

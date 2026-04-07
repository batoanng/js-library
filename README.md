# JS Library Monorepo

Shared JavaScript and TypeScript packages for UI development, authentication flows, project tooling, and application scaffolding. This repository is organized as a pnpm workspace and uses Turborepo to keep builds, tests, and package workflows consistent across the codebase.

The workspace contains both published npm packages and internal applications used to document and validate those packages.

## What This Repository Includes

- Reusable runtime packages for React applications and frontend infrastructure
- Shareable engineering presets for ESLint, Prettier, Tailwind CSS, TypeScript, Jest, and Vite
- Internal documentation and examples for local development
- A Yeoman-based generator for bootstrapping new applications and features

## Package Catalog

### Runtime and UI packages

| Package | Purpose | Package size |
| --- | --- | --- |
| [`@batoanng/mui-components`](./packages/mui-components) | Typed React component library built on Material UI, including theming, form helpers, hooks, and shared design primitives. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Fmui-components) |
| [`@batoanng/oidc`](./packages/oidc) | OIDC helpers and routed authentication flows for React single-page applications, built around `react-oidc-context`. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Foidc) |
| [`@batoanng/utils`](./packages/utils) | Shared utility functions and React hooks used across applications and packages. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Futils) |
| [`@batoanng/types`](./packages/types) | Shared TypeScript types, including common error contracts and reusable domain-facing interfaces. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Ftypes) |
| [`@batoanng/frontend-server`](./packages/frontend-server) | Express-based frontend server utilities for serving static apps, proxying APIs, CSP handling, client env injection, and rate limiting. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Ffrontend-server) |

### Tooling and configuration packages

| Package | Purpose | Package size |
| --- | --- | --- |
| [`@batoanng/eslint-config`](./packages/eslint-config) | Flat ESLint presets for base JavaScript and TypeScript, React, Next.js, Tailwind CSS, and test environments. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Feslint-config) |
| [`@batoanng/prettier-config`](./packages/prettier-config) | Shared Prettier rules for consistent formatting across repositories and packages. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Fprettier-config) |
| [`@batoanng/tailwind-config`](./packages/tailwind-config) | Shared Tailwind CSS v4 theme package centered on a CSS-first setup. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Ftailwind-config) |
| [`@batoanng/tsconfig`](./packages/tsconfig) | Reusable TypeScript presets for Node.js, React, Next.js, and supporting tooling. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Ftsconfig) |
| [`@batoanng/jest-config`](./packages/jest-config) | Reusable Jest presets for common TypeScript, Next.js, NestJS, and esbuild-based test setups. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Fjest-config) |
| [`@batoanng/vite-config`](./packages/vite-config) | Shared Vite and Vitest configuration for React libraries and applications. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Fvite-config) |

### Scaffolding

| Package | Purpose | Package size |
| --- | --- | --- |
| [`generator-t-generator`](./packages/t-generator) | Yeoman generators for bootstrapping React, Next.js, NestJS, and Node.js projects, plus optional add-on features. | ![install size](https://packagephobia.com/badge?p=generator-t-generator) |

## Workspace Layout

```text
.
├── apps/
│   └── docs/          # Internal documentation site for package guides
├── packages/
│   ├── mui-components/
│   ├── oidc/
│   ├── utils/
│   ├── types/
│   ├── frontend-server/
│   ├── eslint-config/
│   ├── prettier-config/
│   ├── tailwind-config/
│   ├── tsconfig/
│   ├── jest-config/
│   ├── vite-config/
│   └── t-generator/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Requirements

- Node.js `>=24`
- pnpm `10`

The workspace declares both requirements in package metadata and uses `pnpm` as the package manager.

## Getting Started

Install dependencies from the repository root:

```bash
pnpm install
```

Run the standard workspace checks:

```bash
pnpm lint
pnpm test
pnpm type-check
pnpm build
```

For the full local CI flow:

```bash
pnpm ci
```

## Common Workspace Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Runs workspace development tasks through Turborepo. |
| `pnpm build` | Builds all packages and apps in dependency order. |
| `pnpm build:release` | Builds publishable packages under `packages/`. |
| `pnpm lint` | Runs lint tasks across the workspace. |
| `pnpm test` | Runs workspace test tasks. |
| `pnpm type-check` | Runs TypeScript checks across the workspace. |
| `pnpm format` | Formats the repository with Prettier. |
| `pnpm clean` | Clears Turbo outputs and removes the root `node_modules`. |

To work on a single package or app, filter by workspace name:

```bash
pnpm --filter @batoanng/docs dev
pnpm --filter @batoanng/mui-components test
pnpm --filter @batoanng/eslint-config lint:smoke
```

## Development Approach

- Packages are isolated under [`packages/`](./packages) and can be developed, tested, and published independently.
- Shared workspace orchestration is handled by [`turbo.json`](./turbo.json).
- Package-specific implementation details, usage examples, and peer dependency notes live in each package README.
- The internal docs app under [`apps/docs`](./apps/docs) is used to present package guides in a browsable format during development.

## Publishing and Versioning

This repository uses [Changesets](https://github.com/changesets/changesets) for version management and package publishing.

Typical release flow:

```bash
pnpm changeset
pnpm version-packages
pnpm release
```

Published packages use public npm access via their package-level `publishConfig`.

## Quality Standards

The workspace is set up to support shared engineering standards across packages:

- ESLint flat config via `@batoanng/eslint-config`
- Prettier formatting via `@batoanng/prettier-config`
- Shared TypeScript baselines via `@batoanng/tsconfig`
- Reusable test configuration via `@batoanng/jest-config` and `@batoanng/vite-config`
- Monorepo task orchestration and caching via Turborepo

## License

[MIT](./LICENSE)

# t-generator

`t-generator` is a Yeoman generator package for bootstrapping four stacks:

- React + TypeScript + Vite
- Next.js App Router
- NestJS + Fastify + Prisma
- Node.js + Express + Prisma

It supports two workflows:

- create a new base project
- add supported features to an existing generated project

The long-term direction lives in [SPECS.md](./SPECS.md).

## Install and run

Global install:

```bash
npm install -g yo generator-t-generator
yo t-generator
```

Without a global install:

```bash
npx -p yo -p generator-t-generator yo t-generator
```

Direct stack commands:

```bash
yo t-generator:react-app my-app
yo t-generator:nextjs-app my-next-app
yo t-generator:nestjs-app my-server
yo t-generator:nodejs-app my-node-server
```

Add features from an existing generated project root:

```bash
yo t-generator:react-add
yo t-generator:nextjs-add
yo t-generator:nestjs-add
yo t-generator:nodejs-add
```

## Stack overview

| Stack | Base scaffold | Installable features |
| --- | --- | --- |
| React | React, TypeScript, Vite, React Router, Vitest, FSD structure | `bff`, `tailwind`, `ui-library`, `auth`, `redux`, `react-query`, `apollo`, `pwa` |
| Next.js | App Router, TypeScript, Jest, FSD structure | `tailwind`, `ui-library`, `auth`, `redux`, `react-query`, `apollo`, `pwa` |
| NestJS | Nest 11, Fastify, Prisma, Swagger, JWT auth | `graphql`, `queue`, `cache`, `llm` |
| Node.js | Express, Prisma, JWT auth, `clean` or `mvp` architecture | `graphql`, `queue`, `cache`, `llm` |

## React stack

Base command:

```bash
yo t-generator:react-app [appName]
```

### Base structure

```text
src/
  app/
    entrypoint/
    providers/
    routes/
    styles/
  pages/
    home/
      ui/
      index.ts
  widgets/
  features/
  entities/
  shared/
    api/
    config/
    lib/
    ui/
  test/
main.tsx
```

### Base includes

- React + TypeScript via Vite
- React Router wiring
- `@` path alias to `src`
- ESLint and Prettier
- Vitest + Testing Library
- `.env.example` and env helper
- provider composition entry point
- Feature-Sliced Design starter structure

### Installable React features

- `bff`: adds a top-level `server/` package for API proxying and frontend serving
- `tailwind`: adds Tailwind CSS v4 through `@tailwindcss/vite` and shared styles from `@batoanng/tailwind-config`
- `ui-library`: adds MUI theme wiring and integrates `@batoanng/mui-components`
- `auth`: adds Auth0 React SDK wiring and an `/auth` example page
- `redux`: adds Redux Toolkit, `redux-persist`, typed hooks, and a `/redux` example page
- `react-query`: adds TanStack Query, Axios helpers, and a `/react-query` example page
- `apollo`: adds Apollo Client wiring and an `/apollo` example page
- `pwa`: adds `vite-plugin-pwa`, install/update state handling, and a `/pwa` example page

Feature commands:

```bash
yo t-generator:react-add bff
yo t-generator:react-add tailwind
yo t-generator:react-add ui-library
yo t-generator:react-add auth
yo t-generator:react-add redux
yo t-generator:react-add react-query
yo t-generator:react-add apollo
yo t-generator:react-add pwa
```

## Next.js stack

Base command:

```bash
yo t-generator:nextjs-app [appName]
```

### Base structure

```text
src/
  app/
    layout.tsx
    page.tsx
    providers/
  pages/
    home/
      ui/
      index.ts
  widgets/
  features/
  entities/
  shared/
    api/
    config/
    lib/
    ui/
```

### Base includes

- Next.js App Router
- TypeScript via `@batoanng/tsconfig/nextjs.json`
- `@` path alias to `src`
- ESLint and Prettier
- Jest + Testing Library
- `.env.example` and env helper
- provider composition entry point
- Feature-Sliced Design starter structure

### Installable Next.js features

- `tailwind`: adds Tailwind CSS v4 through `@tailwindcss/postcss` and shared styles from `@batoanng/tailwind-config`
- `ui-library`: adds MUI theme wiring and integrates `@batoanng/mui-components`
- `auth`: adds Auth0 route handlers, middleware, env wiring, and an `/auth` example page
- `redux`: adds Redux Toolkit, `redux-persist`, typed hooks, and a `/redux` example page
- `react-query`: adds TanStack Query, Axios helpers, and a `/react-query` example page
- `apollo`: adds Apollo Client wiring and an `/apollo` example page
- `pwa`: adds `app/manifest.ts`, `public/sw.js`, registration client wiring, and a `/pwa` example page

`bff` is intentionally not available for Next.js because App Router and route handlers already provide the server-side integration layer.

Feature commands:

```bash
yo t-generator:nextjs-add tailwind
yo t-generator:nextjs-add ui-library
yo t-generator:nextjs-add auth
yo t-generator:nextjs-add redux
yo t-generator:nextjs-add react-query
yo t-generator:nextjs-add apollo
yo t-generator:nextjs-add pwa
```

## NestJS stack

Base command:

```bash
yo t-generator:nestjs-app [appName]
```

### Base structure

```text
src/
  modules/
    app.module.ts
    auth/
    common/
      controller/
      flow/
      provider/
      security/
    tokens.ts
  test/
  types/
server.ts
prisma/
  schema.prisma
```

### Base includes

- Nest 11 with Fastify
- Swagger at `/docs`
- versioned API prefix
- Prisma configured for MongoDB
- health endpoint protected by `HEALTH_TOKEN`
- local access/refresh JWT auth with `login`, `refresh`, `logout`, and `me`
- typed config provider
- Vitest starter tests

### Installable NestJS features

- `graphql`: adds Apollo code-first GraphQL at `/api/graphql` with demo resolver scaffolding
- `queue`: adds BullMQ infrastructure, shared Redis env, and a demo queue endpoint
- `cache`: adds Redis-backed cache infrastructure and a demo cache module
- `llm`: adds OpenAI client wiring and a demo prompt-chain endpoint

Feature commands:

```bash
yo t-generator:nestjs-add graphql
yo t-generator:nestjs-add queue
yo t-generator:nestjs-add cache
yo t-generator:nestjs-add llm
```

## Node.js stack

Base command:

```bash
yo t-generator:nodejs-app [appName]
```

The Node.js generator prompts for one of two architectures:

- `clean`
- `mvp`

### Shared base structure

```text
src/
  config/
  infrastructure/
    prisma/
  shared/
    auth/
  app.ts
  server.ts
tests/
prisma/
  schema.prisma
```

### Clean Architecture structure

```text
src/
  domain/
  usecases/
  interfaces/
    controllers/
    routes/
  infrastructure/
    prisma/
    repositories/
```

### MVP structure

```text
src/
  modules/
    auth/
    health/
  infrastructure/
    prisma/
```

### Base includes

- Express + Prisma
- prompt to choose `clean` or `mvp`
- Prisma configured for MySQL
- `GET /health` and `/api/auth/*` endpoints
- shared env parsing with `zod`
- local access/refresh JWT auth
- logging, security middleware, and graceful shutdown
- Jest + Supertest starter coverage

### Installable Node.js features

- `graphql`: adds a GraphQL endpoint at `/api/graphql`
- `queue`: adds BullMQ plus Redis-backed demo queue infrastructure
- `cache`: adds Redis-backed demo cache endpoints
- `llm`: adds OpenAI client wiring and a demo REST endpoint

Feature commands:

```bash
yo t-generator:nodejs-add graphql
yo t-generator:nodejs-add queue
yo t-generator:nodejs-add cache
yo t-generator:nodejs-add llm
```

## Generator behavior

- base generators create a new normalized directory and fail if it already exists and is not empty
- add-feature generators must run from the root of a compatible generated project
- generators write files only; they do not install dependencies or initialize Git
- installed features are tracked in `package.json` under `tGenerator.features`

Typical flow after generation:

```bash
cd my-app
npm install
npm run dev
```

## Local development

From `packages/t-generator`:

```bash
pnpm install
pnpm run type-check
pnpm run lint
pnpm test
pnpm run build
pnpm run test:dist
```

Link the built package locally:

```bash
pnpm run link:dev
```

If `yo` is not installed yet:

```bash
npm install -g yo
```

If you already linked an older local build:

```bash
npm unlink -g generator-t-generator
pnpm run link:dev
```

Manual package validation from `packages/t-generator`:

```bash
PACKAGE_TGZ="$(npm pack)"
npm install -g yo "./$PACKAGE_TGZ"
```

## Release workflow

This package is published from this README and uses Changesets in the monorepo.

Create a changeset from the repository root:

```bash
pnpm changeset
```

Apply pending changesets from the repository root:

```bash
pnpm version-packages
```

Publish from `packages/t-generator`:

```bash
pnpm run release
```

GitHub Actions can publish automatically from `main` when a Changesets release PR is merged and `NPM_TOKEN` is configured in repository secrets.

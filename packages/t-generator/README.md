# t-generator

`t-generator` is a Yeoman generator package for bootstrapping React repositories, Next.js applications, lean NestJS servers, and Express-based Node.js servers with clean, scalable starting points.

The current implementation covers:

- a base React + TypeScript + Vite scaffold
- eight React add-on features: `bff`, `tailwind`, `ui-library`, `auth`, `redux`, `react-query`, `apollo`, and `pwa`
- a base Next.js App Router scaffold
- seven Next.js add-on features: `tailwind`, `ui-library`, `auth`, `redux`, `react-query`, `apollo`, and `pwa`
- a lean NestJS + Fastify + Prisma server base scaffold
- four NestJS server add-on features: `graphql`, `queue`, `cache`, and `llm`
- a Node.js + Express + Prisma + MySQL server base scaffold with a choice of `clean` or `mvp` architecture
- four Node.js server add-on features: `graphql`, `queue`, `cache`, and `llm`

The current server base defaults now include local access/refresh JWT auth scaffolding for both NestJS and Node.js, with generated `login`, `refresh`, `logout`, and `me` routes.

The long-term direction is described in [SPECS.md](./SPECS.md).

Primary interactive command:

```bash
yo t-generator
```

It prompts for:

- stack: `react`, `nextjs`, `nestjs`, or `nodejs`
- action: create a base project or add a feature

Primary React base command:

```bash
yo t-generator:react-app [appName]
```

Primary React feature commands:

```bash
yo t-generator:react-add
yo t-generator:react-add bff
yo t-generator:react-add tailwind
yo t-generator:react-add ui-library
yo t-generator:react-add auth
yo t-generator:react-add redux
yo t-generator:react-add react-query
yo t-generator:react-add apollo
yo t-generator:react-add pwa
```

Primary Next.js base command:

```bash
yo t-generator:nextjs-app [appName]
```

Primary Next.js feature commands:

```bash
yo t-generator:nextjs-add
yo t-generator:nextjs-add tailwind
yo t-generator:nextjs-add ui-library
yo t-generator:nextjs-add auth
yo t-generator:nextjs-add redux
yo t-generator:nextjs-add react-query
yo t-generator:nextjs-add apollo
yo t-generator:nextjs-add pwa
```

NestJS base command:

```bash
yo t-generator:nestjs-app [appName]
```

Primary NestJS feature commands:

```bash
yo t-generator:nestjs-add
yo t-generator:nestjs-add graphql
yo t-generator:nestjs-add queue
yo t-generator:nestjs-add cache
yo t-generator:nestjs-add llm
```

Node.js base command:

```bash
yo t-generator:nodejs-app [appName]
```

Primary Node.js feature commands:

```bash
yo t-generator:nodejs-add
yo t-generator:nodejs-add graphql
yo t-generator:nodejs-add queue
yo t-generator:nodejs-add cache
yo t-generator:nodejs-add llm
```

## Using the published npm package

Global install:

```bash
npm install -g yo generator-t-generator
yo t-generator
yo t-generator:react-app my-app
yo t-generator:nextjs-app my-next-app
yo t-generator:nestjs-app my-server
yo t-generator:nodejs-app my-node-server
```

Add features after `cd` into the generated project:

```bash
yo t-generator:react-add auth
yo t-generator:nextjs-add tailwind
yo t-generator:nestjs-add graphql
yo t-generator:nodejs-add queue
```

Without a global install:

```bash
npx -p yo -p generator-t-generator yo t-generator
npx -p yo -p generator-t-generator yo t-generator:react-app my-app
npx -p yo -p generator-t-generator yo t-generator:nextjs-app my-next-app
npx -p yo -p generator-t-generator yo t-generator:nestjs-app my-server
npx -p yo -p generator-t-generator yo t-generator:nodejs-app my-node-server
```

The npm package page README is published directly from this file.

## What the generators create today

### React base

The React base command currently includes:

- React + TypeScript via Vite
- ESLint configuration
- Prettier configuration
- `@` path alias mapped to `src`
- `.env` example file plus a small env helper
- `VITE_APP_PORT=3000` in `.env.example`, wired into the generated Vite dev server config for local development
- a provider composition entry point
- React Router setup
- a placeholder home page
- Vitest + Testing Library setup
- a Feature-Sliced Design directory structure

The React base command does not install add-on features automatically. The implemented React add-ons are:

- `bff`, which creates a top-level `server/` package for API proxying and production frontend serving
- `tailwind`, which adds Tailwind CSS v4 through `@tailwindcss/vite`, imports `@batoanng/tailwind-config/styles.css`, and rewrites the generated app styles to use the CSS-first flow
- `ui-library`, which owns the generated MUI theme wiring, integrates `@batoanng/mui-components`, and adds a showcase section to the home page
- `auth`, which wires the Auth0 React SDK into the app shell, adds an `/auth` example page, and links to it from the home page
- `redux`, which wires a persisted Redux Toolkit store into the app shell, adds a `/redux` example page, and links to it from the home page
- `react-query`, which wires a shared QueryClient and Axios-based data helpers into the app shell, adds a `/react-query` example page, and links to it from the home page
- `apollo`, which wires a shared Apollo client into the routed app tree, adds a generated GraphQL demo hook, and links to an `/apollo` example page from the home page
- `pwa`, which wires `vite-plugin-pwa` into the build, adds install and update status UI to the app shell, and links to a `/pwa` guide page from the home page

### Next.js base

The Next.js base command currently includes:

- Next.js App Router
- TypeScript via `@batoanng/tsconfig/nextjs.json`
- ESLint and Prettier configuration
- Jest + Testing Library setup
- `@` path alias mapped to `src`
- `.env` example file plus a small env helper
- a provider composition entry point
- a placeholder home page backed by `src/pages/home`
- a Feature-Sliced Design directory structure

The Next.js base command keeps Tailwind and other add-ons optional. The implemented Next.js add-ons are:

- `tailwind`, which adds Tailwind CSS v4 through `@tailwindcss/postcss`, imports `@batoanng/tailwind-config/styles.css`, and rewrites the generated global styles to the CSS-first flow
- `ui-library`, which wires MUI into the App Router shell, integrates `@batoanng/mui-components`, and adds a showcase section to the home page
- `auth`, which adds Auth0 route-handler scaffolding, middleware, env wiring, and an `/auth` example page
- `redux`, which wires a persisted Redux Toolkit store into the client provider shell, adds a `/redux` example page, and links to it from the home page
- `react-query`, which wires a shared QueryClient and Axios-based data helpers into the client provider shell, adds a `/react-query` example page, and links to it from the home page
- `apollo`, which wires a shared Apollo client into the app shell, adds a generated GraphQL demo hook, and links to an `/apollo` example page from the home page
- `pwa`, which adds a generated manifest route, a service worker registration client component, and a `/pwa` guide page

`bff` is intentionally not available for Next.js because App Router, route handlers, and server rendering already provide the server-side integration layer that the React `bff` feature is meant to supply.

### NestJS base

The NestJS base generator creates a lean Nest 11 server with:

- Fastify as the HTTP adapter
- Swagger at `/docs`
- a versioned `/api/v1`-style global prefix
- Prisma configured for MongoDB
- a health endpoint protected by `HEALTH_TOKEN`
- local access/refresh JWT auth scaffolding with `login`, `refresh`, `logout`, and `me` routes
- default auth env entries for `ACCESS_SECRET`, `REFRESH_SECRET`, `ACCESS_EXPIRES_IN=15m`, and `REFRESH_EXPIRES_IN=7d`
- a typed env/config provider
- Vitest plus starter health and auth smoke tests

The base intentionally excludes GraphQL, BullMQ, Redis-backed caching, and LLM tooling until you add them with `yo t-generator:nestjs-add`.

The implemented NestJS server add-ons are:

- `graphql`, which adds code-first Apollo/Nest GraphQL infrastructure at `/api/graphql`, preserves raw request access in GraphQL context, passes through `x-guest-user-id`, and generates a self-contained demo resolver and GraphQL-only auth helpers
- `queue`, which adds generic BullMQ infrastructure, shared Redis env, one demo queue registration, queue constants, and a producer/controller example without workers or Prisma-backed job creation
- `cache`, which adds generic Redis-backed Nest cache infrastructure, shared Redis env, a cache demo controller/service, and cache-manager wiring without depending on Prisma or GraphQL
- `llm`, which adds an OpenAI client plus a minimal prompt-chain demo endpoint driven by `OPENAI_API_KEY` and `OPENAI_MODEL`

### Node.js base

The Node.js base generator creates an Express + Prisma server with:

- a prompt to choose `Clean Architecture` or `MVP`
- Prisma configured for MySQL
- generated `GET /health` and `/api/auth/*` endpoints
- shared env parsing with `zod`, including access/refresh token secrets and expiries
- default auth env entries for `ACCESS_SECRET`, `REFRESH_SECRET`, `ACCESS_EXPIRES_IN=15m`, and `REFRESH_EXPIRES_IN=7d`
- logging, security middleware, and graceful shutdown wiring
- Jest + Supertest starter coverage for health and auth flows

The base intentionally excludes GraphQL, BullMQ, Redis-backed caching, and LLM tooling until you add them with `yo t-generator:nodejs-add`.

The implemented Node.js server add-ons are:

- `graphql`, which adds a GraphQL endpoint at `/api/graphql` alongside the REST server
- `queue`, which adds BullMQ plus Redis-backed demo queue infrastructure
- `cache`, which adds Redis-backed demo cache endpoints
- `llm`, which adds an OpenAI client and a demo REST endpoint

## UI direction

The preferred UI stack for generated projects is based on:

- Material UI
- `@batoanng/mui-components`

The `ui-library` feature keeps that setup optional instead of forcing it into every base scaffold. When you add the feature, the generator installs `@batoanng/mui-components` plus its current peer dependency set, wires `ThemeProvider` and `CssBaseline` into `AppProviders`, and generates a main-page example section that uses both MUI layout primitives and your shared library.

`theme` is no longer a separate feature. Theme setup is part of `ui-library`.

## Tailwind flow

The `tailwind` feature uses Tailwind CSS v4.

When you add it, the generator:

- installs the Tailwind v4 integration package for the selected stack
- imports `@batoanng/tailwind-config/styles.css`
- rewrites the generated app shell styles to the CSS-first Tailwind flow
- keeps Tailwind opt-in so the base scaffold stays styling-framework neutral

For React, the feature uses `@tailwindcss/vite`. For Next.js, it uses `@tailwindcss/postcss`.

## React auth flow

The `auth` feature uses `@auth0/auth0-react`.

When you add it, the generator:

- extends `.env.example` with Auth0 settings
- adds an Auth0-aware provider wrapper into `AppProviders`
- creates a public `/auth` page that shows setup guidance until Auth0 values are configured
- adds a main-page link to open the auth example

`auth` works as a standalone feature and also composes with `ui-library` in either order.

## Next.js auth flow

The Next.js `auth` feature uses `@auth0/nextjs-auth0`.

When you add it, the generator:

- extends `.env.example` with the Auth0 server and public client settings
- adds `src/lib/auth0.ts` plus `src/middleware.ts`
- creates a public `/auth` page that documents the generated route-handler setup
- adds a main-page link to open the auth example

## Redux flow

The `redux` feature uses Redux Toolkit, React Redux, and `redux-persist`.

When you add it, the generator:

- extends `.env.example` with `VITE_ENABLE_REDUX_LOGGING`
- adds a persisted store under `src/app/store`
- exports typed `useAppDispatch` and `useAppSelector` hooks
- creates a public `/redux` page that demonstrates dispatching and persisted state
- adds a main-page link to open the Redux example

`redux` works as a standalone feature and also composes with `auth` and `ui-library` in either order.

## React Query flow

The `react-query` feature uses `@tanstack/react-query`, React Query Devtools, and Axios.

When you add it, the generator:

- extends `.env.example` with `VITE_API_BASE_URL=/api`
- adds a shared Axios client and QueryClient under `src/shared/api`
- exports generic `useApiQuery` and `useApiMutation` wrappers for feature-level hooks
- creates a public `/react-query` page that documents the generated setup and example hooks
- adds a main-page link to open the React Query example

`react-query` works as a standalone feature and also composes with `auth`, `redux`, and `ui-library` in either order.

## Apollo flow

The `apollo` feature uses `@apollo/client` and `graphql`.

When you add it, the generator:

- extends `.env.example` with `VITE_GRAPHQL_URL=/graphql`
- adds `env.graphqlUrl` to the shared env helper
- creates `src/shared/apollo` with a route-level Apollo provider and client setup
- generates a small `query ApolloDemoRootType { __typename }` demo hook under `src/features/apollo-demo`
- creates a public `/apollo` page that explains the setup and runs the demo query
- adds a main-page link to open the Apollo example

`apollo` works as a standalone feature and also composes with `auth`, `redux`, `react-query`, and `ui-library` in either order. When `auth` is present, the generated Apollo provider attempts to attach an Auth0 access token and falls back to unauthenticated requests until Auth0 is configured.

## React PWA flow

The `pwa` feature uses `vite-plugin-pwa`.

When you add it, the generator:

- installs `vite-plugin-pwa` as a dev dependency
- rewrites `vite.config.ts` to use `VitePWA` with `generateSW`, prompt-based updates, conservative Workbox precaching, and plugin-managed asset generation from `public/pwa-icon.svg`
- rewrites `src/app/entrypoint/App.tsx` to mount `PwaProvider` and the global `PwaStatus` app-shell component
- creates `src/features/pwa` with a `useRegisterSW` wrapper plus install, update, and online/offline state handling
- creates a public `/pwa` page that explains the generated setup and reflects the live PWA state
- adds a main-page link to open the PWA example

`pwa` works as a standalone feature and also composes with `auth`, `redux`, `react-query`, `apollo`, and `ui-library` in either order. The first version keeps runtime caching conservative and does not add custom REST or GraphQL caching rules.

## Next.js PWA flow

The Next.js `pwa` feature uses a Next-native setup instead of `vite-plugin-pwa`.

When you add it, the generator:

- adds `app/manifest.ts`
- adds a generated service worker at `public/sw.js`
- mounts a small `PwaClient` registration component in `AppProviders`
- creates a public `/pwa` page that documents the generated setup and links to the manifest and service worker

## Base app architecture

The generated base app is designed as a stable foundation that future feature generators can extend without needing to rewrite the app shell.

### High-level structure

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
    config/
    ui/
    api/
    lib/
```

### Why this structure exists

- `app` holds application-wide concerns such as the root entrypoint, provider composition, routing, and global styles.
- `pages` holds route-level screens. The base ships with a single `home` page slice.
- `widgets`, `features`, and `entities` are created up front so later additions fit into a consistent shape from the start.
- `shared` holds reusable code that is not tied to a specific business slice.

### FSD deep dive

The base follows Feature-Sliced Design as the default architectural model.

- `app` and `shared` are not sliced layers. They are organized directly by segments because they represent application-wide setup and common building blocks.
- `pages`, `widgets`, `features`, and `entities` are sliced layers. New code in those layers should be organized by business purpose, then by segments such as `ui`, `model`, `api`, `lib`, or `config` when needed.
- Route wiring, provider wiring, app bootstrap code, and global CSS stay inside `app`. This keeps application orchestration in one place.
- Reusable, non-domain-specific utilities and configuration stay inside `shared`.
- Public APIs matter. A slice should expose what other layers use through its top-level `index.ts` instead of forcing callers to reach into internal folders.
- Cross-slice imports should go through public APIs. Relative imports are fine within the same slice. Imports across layers should only point downward according to FSD dependency rules.

### How the base app uses that architecture

- `src/app/entrypoint/App.tsx` is the root shell that composes providers, router, and global styles.
- `src/app/providers/AppProviders.tsx` is deliberately minimal today, but it is the extension point for future app-wide providers.
- `src/app/routes/AppRouter.tsx` owns the initial route table and is where future routes can be wired in safely.
- `src/pages/home/index.ts` exposes the home page slice through a public API.
- `src/shared/config/env.ts` centralizes access to the app name environment variable.

This keeps the base focused on general setup only while still preparing the codebase for future composition.

## How to use

From `packages/t-generator`, build the staged package and link that output locally:

```bash
pnpm install
pnpm run build
pnpm run link:dev
```

`pnpm run build` now does two things:

- compiles the generators in place under `generators/**/*.js`
- stages a linkable package in `dist/` for the local `npm link` step

`pnpm run link:dev` runs `npm link` with `dist/` as the package root. This avoids npm re-reading the workspace package in `packages/t-generator`, which fails on `workspace:*` dependencies.

If `yo` is not already available on your machine:

```bash
npm install -g yo
```

If you already linked an older build, refresh the link after rebuilding:

```bash
npm unlink -g generator-t-generator
pnpm run link:dev
```

Generate a new React app:

```bash
yo t-generator:react-app my-app
```

Behavior of the current command:

- The generator creates a new directory named after the normalized app name.
- It fails if the target directory already exists and is not empty.
- It writes files only. It does not automatically install dependencies or initialize Git.

Run the interactive router:

```bash
yo t-generator
```

If you prefer explicit commands, the subgenerators remain available.

After generation, move into the new app and start it:

```bash
cd my-app
npm install
npm run dev
```

Add a React feature from the generated app root:

```bash
cd my-app
yo t-generator:react-add
```

Every add-on command validates that the current directory still contains the generated base app before writing managed files.

The interactive prompt currently lets you choose between, in order:

- `bff`
- `ui-library`
- `auth`
- `redux`
- `react-query`
- `apollo`
- `pwa`

If you prefer the explicit form, these work:

```bash
yo t-generator:react-add bff
yo t-generator:react-add ui-library
yo t-generator:react-add auth
yo t-generator:react-add redux
yo t-generator:react-add react-query
yo t-generator:react-add apollo
yo t-generator:react-add pwa
```

Generate a NestJS server:

```bash
yo t-generator:nestjs-app my-server
cd my-server
npm install
npm run dev
```

Generate a Node.js server:

```bash
yo t-generator:nodejs-app my-node-server
cd my-node-server
npm install
npm run dev
```

Add a NestJS server feature from the generated server root:

```bash
cd my-server
yo t-generator:nestjs-add
```

The interactive NestJS feature prompt currently lets you choose between, in order:

- `graphql`
- `queue`
- `cache`
- `llm`

If you prefer the explicit form, these work:

```bash
yo t-generator:nestjs-add graphql
yo t-generator:nestjs-add queue
yo t-generator:nestjs-add cache
yo t-generator:nestjs-add llm
```

Add a Node.js server feature from the generated server root:

```bash
cd my-node-server
yo t-generator:nodejs-add
```

The interactive Node.js feature prompt currently lets you choose between, in order:

- `graphql`
- `queue`
- `cache`
- `llm`

If you prefer the explicit form, these work:

```bash
yo t-generator:nodejs-add graphql
yo t-generator:nodejs-add queue
yo t-generator:nodejs-add cache
yo t-generator:nodejs-add llm
```

After the BFF files are generated:

```bash
npm install
npm --prefix server install
npm run dev:full
```

After the UI library files are generated:

```bash
npm install
npm run dev
```

After the Auth files are generated:

```bash
npm install
npm run dev
```

Then add your Auth0 values in `.env.local` and open `/auth`.

After the Redux files are generated:

```bash
npm install
npm run dev
```

Then open `/redux`.

After the React Query files are generated:

```bash
npm install
npm run dev
```

Then open `/react-query`.

After the Apollo files are generated:

```bash
npm install
npm run dev
```

Then open `/apollo`.

After the PWA files are generated:

```bash
npm install
npm run dev
```

Then open `/pwa`.

After the NestJS server feature files are generated:

```bash
npm install
npm run dev
```

Then use one of these demo entry points:

- `graphql`: query `graphqlDemo` at `/api/graphql`
- `queue`: `POST /api/v1/queue/demo`
- `cache`: `POST /api/v1/cache/demo`
- `llm`: `POST /api/v1/llm/demo`

After the Node.js server feature files are generated:

```bash
npm install
npm run dev
```

Then use one of these demo entry points:

- `graphql`: query `graphqlDemo` at `/api/graphql`
- `queue`: `POST /api/queue/demo`
- `cache`: `POST /api/cache/demo`
- `llm`: `POST /api/llm/demo`

All add-on commands validate that the current directory already contains the generated base scaffold before they write anything. `bff` fails clearly if a `server/` folder already exists. `ui-library`, `auth`, `redux`, `react-query`, `apollo`, and `pwa` validate managed frontend scaffold files before they rewrite providers, routes, env helpers, entrypoint wiring, home-page content, or Vite setup. `graphql`, `queue`, `cache`, and `llm` do the same for the managed NestJS and Node.js server scaffolds before they rewrite shared app/bootstrap files or architecture-managed exports.

## Local development

Work on the generator itself from this repository:

```bash
npm install
```

Run the local checks against TypeScript source:

```bash
npm run type-check
npm run lint
npm test
```

Build the publishable package and run the package smoke test:

```bash
npm run build
npm run test:dist
```

Create a changeset for release-worthy changes:

These commands proxy to the monorepo root, where the shared `.changeset` folder lives.

```bash
npm run changeset
```

Apply pending changesets to the package version and changelog:

```bash
npm run version-packages
```

Publish the package after versioning:

```bash
npm run release
```

Manual `yo` validation should use a packed tarball from the package root:

```bash
PACKAGE_TGZ="$(npm pack)"
npm install -g yo "./$PACKAGE_TGZ"
```

## Release automation

This repository now uses Changesets on `main` through GitHub Actions.

Setup for the easiest token-based publish flow:

1. In npm, create a write-capable access token for this package.
2. In GitHub, add that token as the repository Actions secret `NPM_TOKEN`.
3. Merge changes that include a changeset into `main`.

What happens next:

- the release workflow opens or updates a Changesets release PR on `main`
- when that release PR is merged, the same workflow publishes the package to npm automatically
- `GITHUB_TOKEN` is provided by GitHub automatically, so you only need to manage `NPM_TOKEN`

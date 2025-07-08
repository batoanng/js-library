# JS Library Monorepo

A scalable, modular monorepo for a component and tooling library, built with [pnpm](https://pnpm.io/), [Turborepo](https://turbo.build/repo), and modern development tools. This repository is designed to support reusable components and configurations for consistent UI, tooling, and development practices across projects.

---

## 📦 Packages

Located under the `packages/` directory, each folder is a self-contained npm package that can be independently published and versioned.

| Package | Description | Install Size |
|--------|-------------|--------------|
| [`mui-components`](./packages/mui-components) | UI components built on top of Material UI (MUI), ready to be used in React projects. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Fmui-components) |
| [`utils`](./packages/utils) | Common utility functions shared by multiple packages. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Futils) |
| [`eslint-config`](./packages/eslint-config) | Shared ESLint configuration for consistent linting across the codebase. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Feslint-config) |
| [`jest-config`](./packages/jest-config) | Reusable Jest testing configuration for unit and integration tests. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Fjest-config) |
| [`prettier-config`](./packages/prettier-config) | Shared Prettier configuration to enforce consistent formatting. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Fprettier-config) |
| [`tailwind-config`](./packages/tailwind-config) | Shared Tailwind CSS configuration used across apps and packages. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Ftailwind-config) |
| [`tsconfig`](./packages/tsconfig) | Shared TypeScript configuration for all packages. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Ftsconfig) |
| [`types`](./packages/types) | Shared TypeScript types used across multiple packages. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Ftypes) |
| [`vite-config`](./packages/vite-config) | Shared Vite configuration for building frontend apps and libraries. | ![install size](https://packagephobia.com/badge?p=%40batoanng%2Fvite-config) |

---

## 🧰 Tech Stack

- **Monorepo:** [`pnpm`](https://pnpm.io/), [`Turbo`](https://turbo.build)
- **Language:** TypeScript / JavaScript
- **UI Framework:** React + MUI
- **Styling:** Tailwind CSS
- **Linting & Formatting:** ESLint, Prettier
- **Testing:** Jest
- **CI/CD:** GitHub Actions (via `.github/`)
- **Release Management:** Changesets

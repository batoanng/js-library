# @batoanng/eslint-config

Flat ESLint configs for TypeScript, React, Next.js, Tailwind, and tests.

## Installation

Baseline install:

```bash
npm install -D eslint typescript @batoanng/eslint-config
```

Install additional peers only for the entrypoints you use:

- `@batoanng/eslint-config` or `@batoanng/eslint-config/react`:
  `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`
- `@batoanng/eslint-config/next`:
  `@next/eslint-plugin-next`
- `@batoanng/eslint-config/tailwind`:
  `eslint-plugin-tailwindcss`, `tailwindcss`
- `@batoanng/eslint-config/test`:
  `eslint-plugin-jest`, `eslint-plugin-testing-library`, `jest`

## Exports

- `@batoanng/eslint-config`: base + React defaults
  Requires: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`
- `@batoanng/eslint-config/base`: JavaScript and TypeScript baseline
  Requires no extra peers beyond `eslint` and `typescript`
- `@batoanng/eslint-config/react`: React, hooks, and JSX a11y rules
  Requires: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`
- `@batoanng/eslint-config/typed`: opt-in type-aware TypeScript rules
  Requires no extra peers beyond `eslint` and `typescript`
- `@batoanng/eslint-config/next`: Next.js rules
  Requires: `@next/eslint-plugin-next`
- `@batoanng/eslint-config/tailwind`: Tailwind CSS rules
  Requires: `eslint-plugin-tailwindcss`, `tailwindcss`
- `@batoanng/eslint-config/test`: Jest, Vitest globals, and Testing Library rules
  Requires: `eslint-plugin-jest`, `eslint-plugin-testing-library`, `jest`

## Usage

### TypeScript library

```js
// eslint.config.mjs
import base from '@batoanng/eslint-config/base';

export default [...base];
```

### React package with type-aware linting

```js
// eslint.config.mjs
import config from '@batoanng/eslint-config';
import test from '@batoanng/eslint-config/test';
import typed from '@batoanng/eslint-config/typed';

export default [...config, ...typed, ...test];
```

### Next.js app with Tailwind

```js
// eslint.config.mjs
import config from '@batoanng/eslint-config';
import next from '@batoanng/eslint-config/next';
import tailwind from '@batoanng/eslint-config/tailwind';
import typed from '@batoanng/eslint-config/typed';

export default [...config, ...typed, ...next, ...tailwind];
```

## Notes

- `typed` uses `parserOptions.projectService`, so it reads the consumer project's own TypeScript configuration.
- The shared config already enables `eslint-config-prettier`, so formatting-only rule conflicts stay off.
- Feature-specific ESLint plugins are peer dependencies so consumers only install the entrypoint-specific packages they actually use.
- The package ships flat config only. Legacy `.eslintrc*` usage is intentionally unsupported.

# @batoanng/eslint-config

Flat ESLint configs for TypeScript, React, Next.js, Tailwind, and tests.

## Installation

```bash
npm install -D eslint typescript @batoanng/eslint-config
```

## Exports

- `@batoanng/eslint-config`: base + React defaults
- `@batoanng/eslint-config/base`: JavaScript and TypeScript baseline
- `@batoanng/eslint-config/react`: React, hooks, and JSX a11y rules
- `@batoanng/eslint-config/typed`: opt-in type-aware TypeScript rules
- `@batoanng/eslint-config/next`: Next.js rules
- `@batoanng/eslint-config/tailwind`: Tailwind CSS rules
- `@batoanng/eslint-config/test`: Jest, Vitest globals, and Testing Library rules

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
- The package ships flat config only. Legacy `.eslintrc*` usage is intentionally unsupported.

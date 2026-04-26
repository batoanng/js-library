import { existsSync, promises as fs } from 'fs';
import path from 'path';

import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type GuideSection,
  type PackageCategory,
  type PackageDoc,
} from './docs-catalog';
import { humanizePackageName, slugifyValue } from './slugs';

type PackageJson = {
  author?: string;
  bin?: Record<string, string> | string;
  dependencies?: Record<string, string>;
  description?: string;
  devDependencies?: Record<string, string>;
  exports?: Record<string, unknown> | string;
  files?: string[];
  main?: string;
  module?: string;
  name: string;
  peerDependencies?: Record<string, string>;
  publishConfig?: {
    access?: string;
  };
  type?: string;
  types?: string;
  version: string;
};

type PackageDocOverride = {
  category: PackageCategory;
  highlights?: string[];
  installMode?: 'dev' | 'global' | 'prod';
  quickStart: PackageDoc['quickStart'];
  relatedSlugs?: string[];
  summary?: string;
  tagline: string;
};

type RawPackageDoc = {
  changelog: string;
  description: string;
  folderName: string;
  keyFiles: string[];
  packageJson: PackageJson;
  parsedReadme: MarkdownDocument;
  readme: string;
  slug: string;
  summary: string;
};

type MarkdownDocument = {
  intro: string;
  sections: MarkdownSection[];
};

type MarkdownSection = {
  content: string;
  id: string;
  title: string;
};

type BasePackageDoc = Omit<PackageDoc, 'guideSections' | 'relatedPackageNames'> & {
  parsedReadme: MarkdownDocument;
};

let packageDocsPromise: Promise<PackageDoc[]> | null = null;

const PACKAGE_OVERRIDES: Record<string, PackageDocOverride> = {
  'eslint-config': {
    category: 'Config',
    installMode: 'dev',
    tagline: 'Flat-config presets for React, Next.js, Tailwind, tests, and strict TypeScript repos.',
    summary:
      'Compose shared lint rules with targeted exports for base JavaScript, React, Next.js, Tailwind, and test environments.',
    quickStart: {
      title: 'Compose a flat config',
      description: 'Start with the shared base and add the environment-specific presets your package needs.',
      language: 'js',
      code: `import config from '@batoanng/eslint-config';\nimport typed from '@batoanng/eslint-config/typed';\nimport test from '@batoanng/eslint-config/test';\n\nexport default [...config, ...typed, ...test];`,
    },
  },
  'frontend-server': {
    category: 'Server',
    tagline: 'Serve front-end builds, inject env vars, proxy API traffic, and keep edge concerns in one runtime.',
    summary:
      'Use a single Express-based entrypoint to host static assets, proxy back-end traffic, enforce security headers, and rate-limit requests.',
    quickStart: {
      title: 'Stand up the server',
      description: 'Build the server once, then point it at your client build output and API target.',
      language: 'ts',
      code: `import { buildServer } from '@batoanng/frontend-server';\n\nconst { server } = buildServer({\n  targetServerUrl: process.env.APP_API_TARGET_SERVER,\n  clientBuildPath: './build',\n  indexOptions: {\n    filename: 'index.html',\n    globalClientEnvVariableName: 'process.env',\n  },\n});\n\nserver.listen(process.env.PORT ?? 3000);`,
    },
  },
  'jest-config': {
    category: 'Config',
    installMode: 'dev',
    tagline: 'Preset Jest setups for Next.js, NestJS, Node, and esbuild-driven TypeScript projects.',
    summary:
      'Adopt a ready-made Jest configuration with the right environment, transforms, and setup files already wired.',
    quickStart: {
      title: 'Adopt the Next.js preset',
      description: 'Most packages can point Jest directly at the preset and layer in extra settings only when needed.',
      language: 'js',
      code: `module.exports = require('@batoanng/jest-config/next');`,
    },
  },
  'mui-components': {
    category: 'Components',
    tagline: 'Typed MUI primitives, atomic UI building blocks, and a shared theme system for product teams.',
    summary:
      'Ship consistent interfaces faster with a shared component library, bundled theme tokens, test utilities, and form-ready building blocks.',
    quickStart: {
      title: 'Wrap your app with the shared theme',
      description: 'The package exports both theme primitives and ready-to-use components for immediate adoption.',
      language: 'tsx',
      code: `import { CssBaseline, ThemeProvider } from '@mui/material';\nimport { Button, defaultTheme } from '@batoanng/mui-components';\n\nexport function App() {\n  return (\n    <ThemeProvider theme={defaultTheme}>\n      <CssBaseline />\n      <Button variant="contained">Launch</Button>\n    </ThemeProvider>\n  );\n}`,
    },
    relatedSlugs: ['utils'],
  },
  'oidc': {
    category: 'Authentication',
    tagline: 'React-first OIDC flows with route callbacks, shared auth context, and ready-made status screens.',
    summary:
      'Wrap routed React apps with OIDC callbacks, shared authorisation state, post-login profile enrichment, and optional axios token wiring around `react-oidc-context`.',
    quickStart: {
      title: 'Wrap the routed app tree',
      description:
        'Provide the OIDC settings once, then use the callback helpers to complete profile and privilege loading after login.',
      language: 'tsx',
      code: `import { OidcAuthorisationProvider } from '@batoanng/oidc';\n\n<OidcAuthorisationProvider\n  userManagerSettings={{\n    authority: 'https://your-idp.example.com',\n    client_id: 'web-app',\n    redirect_uri: 'http://localhost:3000/oidc/callback',\n    post_logout_redirect_uri: 'http://localhost:3000/oidc/logout',\n  }}\n>\n  <App />\n</OidcAuthorisationProvider>;`,
    },
    relatedSlugs: ['mui-components', 'utils'],
  },
  'prettier-config': {
    category: 'Config',
    installMode: 'dev',
    tagline: 'A single formatting baseline for JavaScript and TypeScript repos in the workspace.',
    summary:
      'Share quote style, trailing comma rules, print width, and import ordering without repeating Prettier options package by package.',
    quickStart: {
      title: 'Point Prettier at the shared config',
      description: 'Reference the exported config and keep per-project overrides minimal.',
      language: 'js',
      code: `module.exports = require('@batoanng/prettier-config');`,
    },
  },
  't-generator': {
    category: 'Scaffolding',
    installMode: 'global',
    tagline: 'Yeoman generators for React, Next.js, NestJS, and Node.js stacks with documented base structures and installable features.',
    summary:
      'Generate one of four stack-specific base projects, then extend it with supported add-on features for UI, auth, data, GraphQL, queues, caching, PWA support, or LLM tooling.',
    highlights: [
      'React + Vite scaffold with Feature-Sliced Design structure and add-ons for bff, tailwind, ui-library, auth, redux, react-query, apollo, and pwa.',
      'Next.js App Router scaffold with Feature-Sliced Design structure and add-ons for tailwind, ui-library, auth, redux, react-query, apollo, and pwa.',
      'NestJS + Fastify + Prisma scaffold with module-based server structure and add-ons for graphql, queue, cache, and llm.',
      'Node.js + Express + Prisma scaffold with clean or mvp architecture plus add-ons for graphql, queue, cache, and llm.',
    ],
    quickStart: {
      title: 'Generate a stack starter',
      description:
        'Install the generator globally, then use either the interactive router or the direct stack commands for React, Next.js, NestJS, and Node.js.',
      language: 'bash',
      code: `npm install -g yo generator-t-generator\nyo t-generator\nyo t-generator:react-app my-app\nyo t-generator:nextjs-app my-next-app\nyo t-generator:nestjs-app my-server\nyo t-generator:nodejs-app my-node-server`,
    },
  },
  'tailwind-config': {
    category: 'Config',
    installMode: 'dev',
    tagline: 'Shared Tailwind CSS v4 theme tokens and utility extensions exposed through a CSS-first stylesheet.',
    summary:
      'Import one shared stylesheet to pick up fonts, colors, spacing, shadows, and utility extensions without maintaining a local Tailwind config file.',
    quickStart: {
      title: 'Import the shared Tailwind v4 stylesheet',
      description:
        'Add the shared stylesheet next to your app-level Tailwind import and keep project-specific tokens in regular CSS.',
      language: 'css',
      code: `@import "tailwindcss";\n@import "@batoanng/tailwind-config/styles.css";`,
    },
  },
  'tsconfig': {
    category: 'Config',
    installMode: 'dev',
    tagline: 'TypeScript presets for React apps, Next.js projects, Node runtimes, and legacy tooling edges.',
    summary:
      'Pick a preset, extend it from your local `tsconfig.json`, and keep compiler defaults aligned across the monorepo.',
    quickStart: {
      title: 'Extend the React preset',
      description:
        'Choose the preset that matches the runtime and only override the options that are genuinely project-specific.',
      language: 'json',
      code: `{\n  "extends": "@batoanng/tsconfig/reactjs.json",\n  "compilerOptions": {\n    "outDir": "dist"\n  }\n}`,
    },
  },
  'types': {
    category: 'Types',
    installMode: 'dev',
    tagline: 'Centralised domain and error contracts that can be shared across apps, servers, and tooling.',
    summary:
      'Keep common type shapes in one package so consumers can import the same error and payload contracts everywhere.',
    quickStart: {
      title: 'Import shared error contracts',
      description: 'Because the package is type-only, it is most often used as a development dependency in consumers.',
      language: 'ts',
      code: `import type { ApiError, NormalisedError } from '@batoanng/types/errors';`,
    },
    relatedSlugs: ['utils'],
  },
  'utils': {
    category: 'Utilities',
    tagline: 'General-purpose helpers and React hooks for the shared front-end ecosystem.',
    summary:
      'Reach for small, typed utilities like slug conversion, delays, previous-value tracking, and error normalisation without rewriting them in each project.',
    quickStart: {
      title: 'Pull utility functions and hooks from the package root',
      description:
        'The package is tree-shakable, so consumers can import narrow helpers without paying for the full surface area.',
      language: 'tsx',
      code: `import { sleep, toSlug, usePrevious } from '@batoanng/utils';\n\nawait sleep(250);\nconst previousValue = usePrevious(value);\nconst slug = toSlug('Design System Docs');`,
    },
    relatedSlugs: ['types'],
  },
  'vite-config': {
    category: 'Config',
    installMode: 'dev',
    tagline: 'A shared Vite and Vitest baseline for React and TypeScript projects in the workspace.',
    summary:
      'Adopt the default Vite stack, then merge in only the project-specific settings you need for build or test behaviour.',
    quickStart: {
      title: 'Start from the shared Vite config',
      description:
        'Both the Vite build config and the Vitest test setup are exported so apps and libraries stay aligned.',
      language: 'js',
      code: `import baseConfig from '@batoanng/vite-config/vite.config';\nimport { defineConfig, mergeConfig } from 'vite';\n\nexport default mergeConfig(baseConfig, defineConfig({\n  define: {\n    __DEV__: true,\n  },\n}));`,
    },
  },
};

const SECTION_PATTERNS: Record<string, RegExp[]> = {
  development: [
    /development/i,
    /linting/i,
    /storybook/i,
    /internals/i,
    /structure/i,
    /files overview/i,
    /strictness/i,
    /local development/i,
    /release workflow/i,
  ],
  exports: [/exports/i, /available configs/i],
  features: [/features/i, /what the generators create today/i, /ui direction/i, /stack overview/i],
  installation: [/installation/i, /install and run/i],
  notes: [/notes/i, /csp/i, /rate limiting/i, /automatic client-side env variable injection/i, /related packages/i],
  props: [/props/i, /default routes/i],
  usage: [
    /usage/i,
    /quick start/i,
    /main entry point/i,
    /customization/i,
    /test setup/i,
    /auth flow/i,
    /react stack/i,
    /next\.js stack/i,
    /nestjs stack/i,
    /node\.js stack/i,
    /generator behavior/i,
  ],
};

const IGNORED_TOP_LEVEL_ENTRIES = new Set([
  '.gitignore',
  '.npmrc',
  '.turbo',
  'CHANGELOG.md',
  'LICENSE',
  'README.md',
  'dist',
  'node_modules',
  'package-lock.json',
  'pnpm-lock.yaml',
]);

function workspaceRoot(): string {
  let currentDirectory = process.cwd();

  while (true) {
    if (existsSync(path.join(currentDirectory, 'pnpm-workspace.yaml'))) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      return process.cwd();
    }

    currentDirectory = parentDirectory;
  }
}

function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[`*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mergeMarkdownParts(parts: Array<string | undefined>): string {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join('\n\n');
}

function inferCategory(folderName: string): PackageCategory {
  if (folderName === 'mui-components') {
    return 'Components';
  }

  if (folderName === 'oidc') {
    return 'Authentication';
  }

  if (folderName === 'frontend-server') {
    return 'Server';
  }

  if (folderName === 'utils') {
    return 'Utilities';
  }

  if (folderName === 'types') {
    return 'Types';
  }

  if (folderName === 't-generator') {
    return 'Scaffolding';
  }

  return 'Config';
}

function inferInstallMode(category: PackageCategory): 'dev' | 'global' | 'prod' {
  if (category === 'Config' || category === 'Types') {
    return 'dev';
  }

  if (category === 'Scaffolding') {
    return 'global';
  }

  return 'prod';
}

function buildInstallCommand(packageName: string, mode: 'dev' | 'global' | 'prod'): string {
  if (mode === 'global') {
    return `npm install -g yo ${packageName}`;
  }

  if (mode === 'dev') {
    return `npm install -D ${packageName}`;
  }

  return `npm install ${packageName}`;
}

function readingTimeMinutes(markdown: string): number {
  const wordCount = stripMarkdown(markdown).split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(wordCount / 220));
}

function extractIntro(markdown: string): string {
  const body = markdown.replace(/^# .*\n+/, '').trim();
  const paragraphs = body.split(/\n{2,}/).map((paragraph) => paragraph.trim());

  return (
    paragraphs.find((paragraph) => {
      if (!paragraph) {
        return false;
      }

      return !paragraph.startsWith('![') && !paragraph.startsWith('---') && !paragraph.startsWith('[');
    }) ?? ''
  );
}

function extractHighlights(markdown: string): string[] {
  const featuresMatch = markdown.match(/## .*features[\s\S]*?(?=\n## |\n# |$)/i);
  const source = featuresMatch?.[0] ?? markdown;

  return Array.from(source.matchAll(/^- (.+)$/gm))
    .slice(0, 4)
    .map((match) => stripMarkdown(match[1]))
    .filter(Boolean);
}

function fallbackHighlights({
  description,
  entrypoints,
  exports,
  internalDependencies,
  keyFiles,
  peerDependencies,
}: {
  description: string;
  entrypoints: string[];
  exports: string[];
  internalDependencies: string[];
  keyFiles: string[];
  peerDependencies: string[];
}): string[] {
  return [
    description ? stripMarkdown(description) : undefined,
    exports.length > 0
      ? `${exports.length} published export${exports.length === 1 ? '' : 's'} ready to compose.`
      : undefined,
    entrypoints.length > 0
      ? `${entrypoints.length} entrypoint${entrypoints.length === 1 ? '' : 's'} exposed for consumers.`
      : undefined,
    peerDependencies.length > 0 ? `Designed to work alongside ${peerDependencies.slice(0, 3).join(', ')}.` : undefined,
    internalDependencies.length > 0
      ? `Connects with ${internalDependencies.slice(0, 3).join(', ')} inside the monorepo.`
      : undefined,
    keyFiles.length > 0 ? `Key files include ${keyFiles.slice(0, 3).join(', ')}.` : undefined,
  ]
    .filter((highlight): highlight is string => Boolean(highlight))
    .slice(0, 4);
}

function collectKeyFiles(entryNames: string[]): string[] {
  return entryNames
    .filter((entryName) => !IGNORED_TOP_LEVEL_ENTRIES.has(entryName))
    .map((entryName) => (entryName.includes('.') ? `\`${entryName}\`` : `\`${entryName}/\``))
    .slice(0, 7);
}

function flattenExportEntries(exportsValue: PackageJson['exports']): string[] {
  if (!exportsValue) {
    return [];
  }

  if (typeof exportsValue === 'string') {
    return [`\`.\` -> \`${exportsValue}\``];
  }

  return Object.entries(exportsValue).flatMap(([exportKey, exportValue]) => {
    if (typeof exportValue === 'string') {
      return [`\`${exportKey}\` -> \`${exportValue}\``];
    }

    if (!exportValue || typeof exportValue !== 'object') {
      return [];
    }

    const variants = Object.entries(exportValue)
      .filter(([, exportTarget]) => typeof exportTarget === 'string')
      .map(([variant, exportTarget]) => `${variant}: \`${exportTarget}\``);

    if (variants.length === 0) {
      return [];
    }

    return [`\`${exportKey}\` -> ${variants.join(', ')}`];
  });
}

function entrypointsForPackage(packageJson: PackageJson): string[] {
  const entrypoints = [
    packageJson.main ? `main: \`${packageJson.main}\`` : undefined,
    packageJson.module ? `module: \`${packageJson.module}\`` : undefined,
    packageJson.types ? `types: \`${packageJson.types}\`` : undefined,
  ];

  if (packageJson.bin) {
    if (typeof packageJson.bin === 'string') {
      entrypoints.push(`bin: \`${packageJson.bin}\``);
    } else {
      entrypoints.push(
        ...Object.entries(packageJson.bin).map(([binName, binTarget]) => `bin \`${binName}\`: \`${binTarget}\``)
      );
    }
  }

  return entrypoints.filter((entrypoint): entrypoint is string => Boolean(entrypoint));
}

function extractLatestChangelogEntry(changelog: string): string {
  if (!changelog.trim()) {
    return '';
  }

  const lines = changelog.split('\n');
  const excerpt: string[] = [];
  let inEntry = false;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (inEntry) {
        break;
      }

      inEntry = true;
      excerpt.push(line);
      continue;
    }

    if (inEntry) {
      excerpt.push(line);
    }
  }

  return excerpt.join('\n').trim();
}

function parseMarkdownSections(markdown: string): MarkdownDocument {
  const lines = markdown.split('\n');
  const intro: string[] = [];
  const sections: MarkdownSection[] = [];
  let currentSection: MarkdownSection | null = null;
  let insideCodeFence = false;

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      insideCodeFence = !insideCodeFence;
    }

    const headingMatch = !insideCodeFence ? line.match(/^(##)\s+(.+)$/) : null;

    if (headingMatch) {
      if (currentSection) {
        currentSection.content = currentSection.content.trim();
        sections.push(currentSection);
      }

      currentSection = {
        content: '',
        id: slugifyValue(headingMatch[2]),
        title: headingMatch[2].trim(),
      };
      continue;
    }

    if (currentSection) {
      currentSection.content += `${line}\n`;
    } else if (!line.startsWith('# ')) {
      intro.push(line);
    }
  }

  if (currentSection) {
    currentSection.content = currentSection.content.trim();
    sections.push(currentSection);
  }

  return {
    intro: intro.join('\n').trim(),
    sections,
  };
}

function stripLeadingTitle(markdown: string): string {
  return markdown.replace(/^# .*\n+/, '').trim();
}

function deriveDefaultQuickStart(folderName: string, packageJson: PackageJson): PackageDoc['quickStart'] {
  return {
    title: 'Start from the primary entrypoint',
    description:
      'The package publishes a small entry surface. Start with the root export and add deeper subpaths only if you need them.',
    language: 'bash',
    code: buildInstallCommand(packageJson.name, inferInstallMode(inferCategory(folderName))),
  };
}

function pullSections(sectionPool: MarkdownSection[], patterns: RegExp[]): MarkdownSection[] {
  return sectionPool.filter((section) => patterns.some((pattern) => pattern.test(section.title)));
}

function sectionMarkdown(title: string, sections: MarkdownSection[]): string {
  if (sections.length === 0) {
    return '';
  }

  return sections
    .map((section) => {
      if (section.title.toLowerCase() === title.toLowerCase()) {
        return section.content;
      }

      return `### ${section.title}\n\n${section.content}`;
    })
    .join('\n\n')
    .trim();
}

function makeBullets(items: string[], emptyState?: string): string {
  if (items.length === 0) {
    return emptyState ?? '';
  }

  return items.map((item) => `- ${item}`).join('\n');
}

function buildTGeneratorGuideSections(doc: Omit<PackageDoc, 'guideSections' | 'relatedPackageNames'>): GuideSection[] {
  return [
    {
      eyebrow: 'Overview',
      id: 'overview',
      title: 'What It Covers',
      markdown: [
        doc.summary,
        '### Supported stacks',
        '| Stack | Base scaffold | Installable features |',
        '| --- | --- | --- |',
        '| React | React, TypeScript, Vite, React Router, Vitest, Feature-Sliced Design structure | `bff`, `tailwind`, `ui-library`, `auth`, `redux`, `react-query`, `apollo`, `pwa` |',
        '| Next.js | App Router, TypeScript, Jest, Feature-Sliced Design structure | `tailwind`, `ui-library`, `auth`, `redux`, `react-query`, `apollo`, `pwa` |',
        '| NestJS | Nest 11, Fastify, Prisma, Swagger, JWT auth | `graphql`, `queue`, `cache`, `llm` |',
        '| Node.js | Express, Prisma, JWT auth, `clean` or `mvp` architecture | `graphql`, `queue`, `cache`, `llm` |',
        '### Core behavior',
        makeBullets([
          'Base generators create a new normalized directory and fail if it already exists and is not empty.',
          'Add-feature generators must run from the root of a compatible generated project.',
          'Generators write files only and do not install dependencies or initialize Git.',
          'Installed features are tracked in `package.json` under `tGenerator.features`.',
        ]),
      ].join('\n\n'),
    },
    {
      eyebrow: 'Setup',
      id: 'installation',
      title: 'Install And Run',
      markdown: [
        'Install globally for the standard Yeoman flow:',
        '```bash\nnpm install -g yo generator-t-generator\nyo t-generator\n```',
        'Run without a global install:',
        '```bash\nnpx -p yo -p generator-t-generator yo t-generator\n```',
        'Use direct stack commands when you want to skip the interactive router:',
        '```bash\nyo t-generator:react-app my-app\nyo t-generator:nextjs-app my-next-app\nyo t-generator:nestjs-app my-server\nyo t-generator:nodejs-app my-node-server\n```',
        'Use feature generators from the root of an existing generated project:',
        '```bash\nyo t-generator:react-add\nyo t-generator:nextjs-add\nyo t-generator:nestjs-add\nyo t-generator:nodejs-add\n```',
      ].join('\n\n'),
    },
    {
      eyebrow: 'Frontend',
      id: 'react-and-nextjs',
      title: 'React And Next.js Stacks',
      markdown: [
        '### React base structure',
        '```text\nsrc/\n  app/\n    entrypoint/\n    providers/\n    routes/\n    styles/\n  pages/\n    home/\n      ui/\n      index.ts\n  widgets/\n  features/\n  entities/\n  shared/\n    api/\n    config/\n    lib/\n    ui/\n  test/\nmain.tsx\n```',
        '### React base includes',
        makeBullets([
          'React + TypeScript via Vite.',
          'React Router wiring, `@` path alias, ESLint, Prettier, Vitest, and Testing Library.',
          '`.env.example`, env helper, provider composition entry point, and Feature-Sliced Design starter structure.',
        ]),
        '### React installable features',
        makeBullets([
          '`bff`: adds a top-level `server/` package for API proxying and frontend serving.',
          '`tailwind`: adds Tailwind CSS v4 through `@tailwindcss/vite` and shared styles from `@batoanng/tailwind-config`.',
          '`ui-library`: adds MUI theme wiring and integrates `@batoanng/mui-components`.',
          '`auth`: adds Auth0 React SDK wiring and an `/auth` example page.',
          '`redux`: adds Redux Toolkit, `redux-persist`, typed hooks, and a `/redux` example page.',
          '`react-query`: adds TanStack Query, Axios helpers, and a `/react-query` example page.',
          '`apollo`: adds Apollo Client wiring and an `/apollo` example page.',
          '`pwa`: adds `vite-plugin-pwa`, install/update state handling, and a `/pwa` example page.',
        ]),
        '```bash\nyo t-generator:react-add bff\nyo t-generator:react-add tailwind\nyo t-generator:react-add ui-library\nyo t-generator:react-add auth\nyo t-generator:react-add redux\nyo t-generator:react-add react-query\nyo t-generator:react-add apollo\nyo t-generator:react-add pwa\n```',
        '### Next.js base structure',
        '```text\nsrc/\n  app/\n    layout.tsx\n    page.tsx\n    providers/\n  pages/\n    home/\n      ui/\n      index.ts\n  widgets/\n  features/\n  entities/\n  shared/\n    api/\n    config/\n    lib/\n    ui/\n```',
        '### Next.js base includes',
        makeBullets([
          'Next.js App Router with TypeScript via `@batoanng/tsconfig/nextjs.json`.',
          '`@` path alias, ESLint, Prettier, Jest, Testing Library, `.env.example`, env helper, and provider composition entry point.',
          'Feature-Sliced Design starter structure with optional add-ons layered in later.',
        ]),
        '### Next.js installable features',
        makeBullets([
          '`tailwind`: adds Tailwind CSS v4 through `@tailwindcss/postcss` and shared styles from `@batoanng/tailwind-config`.',
          '`ui-library`: adds MUI theme wiring and integrates `@batoanng/mui-components`.',
          '`auth`: adds Auth0 route handlers, middleware, env wiring, and an `/auth` example page.',
          '`redux`: adds Redux Toolkit, `redux-persist`, typed hooks, and a `/redux` example page.',
          '`react-query`: adds TanStack Query, Axios helpers, and a `/react-query` example page.',
          '`apollo`: adds Apollo Client wiring and an `/apollo` example page.',
          '`pwa`: adds `app/manifest.ts`, `public/sw.js`, registration client wiring, and a `/pwa` example page.',
        ]),
        '`bff` is intentionally not available for Next.js because App Router and route handlers already provide the server-side integration layer.',
        '```bash\nyo t-generator:nextjs-add tailwind\nyo t-generator:nextjs-add ui-library\nyo t-generator:nextjs-add auth\nyo t-generator:nextjs-add redux\nyo t-generator:nextjs-add react-query\nyo t-generator:nextjs-add apollo\nyo t-generator:nextjs-add pwa\n```',
      ].join('\n\n'),
    },
    {
      eyebrow: 'Backend',
      id: 'nestjs-and-nodejs',
      title: 'NestJS And Node.js Stacks',
      markdown: [
        '### NestJS base structure',
        '```text\nsrc/\n  modules/\n    app.module.ts\n    auth/\n    common/\n      controller/\n      flow/\n      provider/\n      security/\n    tokens.ts\n  test/\n  types/\nserver.ts\nprisma/\n  schema.prisma\n```',
        '### NestJS base includes',
        makeBullets([
          'Nest 11 with Fastify, Swagger at `/docs`, versioned API prefix, and Prisma configured for MongoDB.',
          'Health endpoint protected by `HEALTH_TOKEN` plus local access/refresh JWT auth with `login`, `refresh`, `logout`, and `me`.',
          'Typed config provider and Vitest starter tests.',
        ]),
        '### NestJS installable features',
        makeBullets([
          '`graphql`: adds Apollo code-first GraphQL at `/api/graphql` with demo resolver scaffolding.',
          '`queue`: adds BullMQ infrastructure, shared Redis env, and a demo queue endpoint.',
          '`cache`: adds Redis-backed cache infrastructure and a demo cache module.',
          '`llm`: adds OpenAI client wiring and a demo prompt-chain endpoint.',
        ]),
        '```bash\nyo t-generator:nestjs-add graphql\nyo t-generator:nestjs-add queue\nyo t-generator:nestjs-add cache\nyo t-generator:nestjs-add llm\n```',
        '### Node.js shared base structure',
        '```text\nsrc/\n  config/\n  infrastructure/\n    prisma/\n  shared/\n    auth/\n  app.ts\n  server.ts\ntests/\nprisma/\n  schema.prisma\n```',
        '### Node.js architecture options',
        'Clean Architecture:',
        '```text\nsrc/\n  domain/\n  usecases/\n  interfaces/\n    controllers/\n    routes/\n  infrastructure/\n    prisma/\n    repositories/\n```',
        'MVP:',
        '```text\nsrc/\n  modules/\n    auth/\n    health/\n  infrastructure/\n    prisma/\n```',
        '### Node.js base includes',
        makeBullets([
          'Express + Prisma with a prompt to choose `clean` or `mvp`.',
          'Prisma configured for MySQL, `GET /health`, `/api/auth/*`, shared env parsing with `zod`, JWT auth, logging, security middleware, and graceful shutdown.',
          'Jest + Supertest starter coverage.',
        ]),
        '### Node.js installable features',
        makeBullets([
          '`graphql`: adds a GraphQL endpoint at `/api/graphql`.',
          '`queue`: adds BullMQ plus Redis-backed demo queue infrastructure.',
          '`cache`: adds Redis-backed demo cache endpoints.',
          '`llm`: adds OpenAI client wiring and a demo REST endpoint.',
        ]),
        '```bash\nyo t-generator:nodejs-add graphql\nyo t-generator:nodejs-add queue\nyo t-generator:nodejs-add cache\nyo t-generator:nodejs-add llm\n```',
      ].join('\n\n'),
    },
    {
      eyebrow: 'Workflow',
      id: 'development-and-release',
      title: 'Local Development And Release Workflow',
      markdown: [
        '### Local development',
        '```bash\npnpm install\npnpm run type-check\npnpm run lint\npnpm test\npnpm run build\npnpm run test:dist\n```',
        'Link the built package locally:',
        '```bash\npnpm run link:dev\n```',
        'If `yo` is not installed yet:',
        '```bash\nnpm install -g yo\n```',
        'If you already linked an older local build:',
        '```bash\nnpm unlink -g generator-t-generator\npnpm run link:dev\n```',
        'Manual package validation from `packages/t-generator`:',
        '```bash\nPACKAGE_TGZ=\"$(npm pack)\"\nnpm install -g yo \"./$PACKAGE_TGZ\"\n```',
        '### Release workflow',
        'Create a changeset from the repository root:',
        '```bash\npnpm changeset\n```',
        'Apply pending changesets from the repository root:',
        '```bash\npnpm version-packages\n```',
        'Publish from `packages/t-generator`:',
        '```bash\npnpm run release\n```',
        'GitHub Actions can publish automatically from `main` when a Changesets release PR is merged and `NPM_TOKEN` is configured in repository secrets.',
      ].join('\n\n'),
    },
  ];
}

function buildGuideSections(
  doc: Omit<PackageDoc, 'guideSections' | 'relatedPackageNames'>,
  readmeSections: MarkdownSection[],
  relatedPackageNames: string[]
): GuideSection[] {
  if (doc.slug === 't-generator') {
    return buildTGeneratorGuideSections(doc);
  }

  const featuresSections = pullSections(readmeSections, SECTION_PATTERNS.features);
  const installationSections = pullSections(readmeSections, SECTION_PATTERNS.installation);
  const usageSections = pullSections(readmeSections, SECTION_PATTERNS.usage);
  const exportsSections = pullSections(readmeSections, SECTION_PATTERNS.exports);
  const propsSections = pullSections(readmeSections, SECTION_PATTERNS.props);
  const notesSections = pullSections(readmeSections, SECTION_PATTERNS.notes);
  const developmentSections = pullSections(readmeSections, SECTION_PATTERNS.development);

  const overviewMarkdown = mergeMarkdownParts([
    doc.summary,
    doc.highlights.length > 0 ? makeBullets(doc.highlights.map((highlight) => stripMarkdown(highlight))) : undefined,
    sectionMarkdown('Features', featuresSections),
  ]);

  const installationMarkdown = mergeMarkdownParts([
    'Bring the package into your project with the published npm entrypoint.',
    `\`\`\`bash\n${doc.installCommand}\n\`\`\``,
    sectionMarkdown('Installation', installationSections),
  ]);

  const usageMarkdown = mergeMarkdownParts([
    doc.quickStart.description,
    `\`\`\`${doc.quickStart.language}\n${doc.quickStart.code}\n\`\`\``,
    sectionMarkdown('Usage', usageSections),
  ]);

  const exportsMarkdown = mergeMarkdownParts([
    doc.exports.length > 0 ? `### Export surface\n\n${makeBullets(doc.exports)}` : undefined,
    doc.entrypoints.length > 0 ? `### Entrypoints\n\n${makeBullets(doc.entrypoints)}` : undefined,
    doc.keyFiles.length > 0 ? `### Key files\n\n${makeBullets(doc.keyFiles)}` : undefined,
    sectionMarkdown('Exports', exportsSections),
  ]);

  const notesMarkdown = mergeMarkdownParts([
    doc.peerDependencies.length > 0
      ? `### Peer dependencies\n\n${makeBullets(doc.peerDependencies.map((dependency) => `\`${dependency}\``))}`
      : undefined,
    doc.internalDependencies.length > 0
      ? `### Internal workspace links\n\n${makeBullets(doc.internalDependencies.map((dependency) => `\`${dependency}\``))}`
      : undefined,
    relatedPackageNames.length > 0
      ? `### Related packages\n\n${makeBullets(
          relatedPackageNames.map((packageName, index) => `[${packageName}](/packages/${doc.relatedSlugs[index]})`)
        )}`
      : undefined,
    sectionMarkdown('Notes', notesSections),
  ]);

  const developmentMarkdown = mergeMarkdownParts([
    doc.latestReleaseNotes ? `### Latest release snapshot\n\n${doc.latestReleaseNotes}` : undefined,
    sectionMarkdown('Development', developmentSections),
  ]);

  const sections: GuideSection[] = [
    {
      eyebrow: 'Context',
      id: 'overview',
      markdown: overviewMarkdown,
      title: 'What It Covers',
    },
    {
      eyebrow: 'Setup',
      id: 'installation',
      markdown: installationMarkdown,
      title: 'Installation',
    },
    {
      eyebrow: 'Start',
      id: 'quick-start',
      markdown: usageMarkdown,
      title: doc.quickStart.title,
    },
    {
      eyebrow: 'Surface',
      id: 'exports-and-entrypoints',
      markdown: exportsMarkdown,
      title: 'Exports And Entrypoints',
    },
  ];

  if (propsSections.length > 0) {
    sections.push({
      eyebrow: 'API',
      id: 'props-and-routes',
      markdown: sectionMarkdown('Props', propsSections),
      title: 'Props And Route Contracts',
    });
  }

  if (notesMarkdown) {
    sections.push({
      eyebrow: 'Integration',
      id: 'integration-notes',
      markdown: notesMarkdown,
      title: 'Integration Notes',
    });
  }

  if (developmentMarkdown) {
    sections.push({
      eyebrow: 'Ops',
      id: 'development-notes',
      markdown: developmentMarkdown,
      title: 'Development Notes',
    });
  }

  return sections.filter((section) => section.markdown.trim().length > 0);
}

async function readTextFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

async function readPackage(folderName: string): Promise<RawPackageDoc> {
  const packageDirectory = path.join(workspaceRoot(), 'packages', folderName);
  const packageJson = JSON.parse(await fs.readFile(path.join(packageDirectory, 'package.json'), 'utf8')) as PackageJson;
  const readme = await readTextFile(path.join(packageDirectory, 'README.md'));
  const changelog = await readTextFile(path.join(packageDirectory, 'CHANGELOG.md'));
  const entryNames = await fs.readdir(packageDirectory);
  const intro = extractIntro(readme);
  const summary = stripMarkdown(packageJson.description ?? intro) || humanizePackageName(packageJson.name);

  return {
    changelog,
    description: stripMarkdown(packageJson.description ?? intro),
    folderName,
    keyFiles: collectKeyFiles(entryNames.sort()),
    packageJson,
    parsedReadme: parseMarkdownSections(readme),
    readme,
    slug: slugifyValue(folderName),
    summary,
  };
}

async function loadAllPackageDocs(): Promise<PackageDoc[]> {
  const packagesDirectory = path.join(workspaceRoot(), 'packages');
  const packageDirectories = (await fs.readdir(packagesDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const rawPackages = await Promise.all(packageDirectories.map(readPackage));
  const packageNameToSlug = new Map(rawPackages.map((rawPackage) => [rawPackage.packageJson.name, rawPackage.slug]));

  const baseDocs: BasePackageDoc[] = rawPackages.map((rawPackage) => {
    const override = PACKAGE_OVERRIDES[rawPackage.folderName];
    const category = override?.category ?? inferCategory(rawPackage.folderName);
    const installMode = override?.installMode ?? inferInstallMode(category);
    const internalDependencies = Object.keys({
      ...(rawPackage.packageJson.dependencies ?? {}),
      ...(rawPackage.packageJson.devDependencies ?? {}),
      ...(rawPackage.packageJson.peerDependencies ?? {}),
    })
      .filter((dependency) => dependency.startsWith('@batoanng/'))
      .filter((dependency) => dependency !== rawPackage.packageJson.name);
    const entrypoints = entrypointsForPackage(rawPackage.packageJson);
    const exports = flattenExportEntries(rawPackage.packageJson.exports);
    const extractedHighlights = extractHighlights(rawPackage.readme);
    const highlights =
      override?.highlights && override.highlights.length > 0
        ? override.highlights
        : extractedHighlights.length > 0
          ? extractedHighlights
          : fallbackHighlights({
              description: rawPackage.description || rawPackage.summary,
              entrypoints,
              exports,
              internalDependencies,
              keyFiles: rawPackage.keyFiles,
              peerDependencies: Object.keys(rawPackage.packageJson.peerDependencies ?? {}).sort(),
            });

    return {
      accent: CATEGORY_META[category].accent,
      category,
      changelog: rawPackage.changelog,
      description: rawPackage.description || rawPackage.summary,
      entrypoints,
      exports,
      folderName: rawPackage.folderName,
      highlights,
      installCommand: buildInstallCommand(rawPackage.packageJson.name, installMode),
      internalDependencies,
      keyFiles: rawPackage.keyFiles,
      latestReleaseNotes: extractLatestChangelogEntry(rawPackage.changelog),
      name: rawPackage.packageJson.name,
      parsedReadme: rawPackage.parsedReadme,
      peerDependencies: Object.keys(rawPackage.packageJson.peerDependencies ?? {}).sort(),
      quickStart: override?.quickStart ?? deriveDefaultQuickStart(rawPackage.folderName, rawPackage.packageJson),
      readme: rawPackage.readme,
      readingTimeMinutes: readingTimeMinutes(rawPackage.readme),
      referenceMarkdown: stripLeadingTitle(rawPackage.readme),
      relatedSlugs: Array.from(
        new Set([
          ...(override?.relatedSlugs ?? []),
          ...internalDependencies
            .map((dependency) => packageNameToSlug.get(dependency))
            .filter((dependencySlug): dependencySlug is string => Boolean(dependencySlug)),
        ])
      ),
      slug: rawPackage.slug,
      summary: override?.summary ?? rawPackage.summary,
      tagline: override?.tagline ?? rawPackage.summary,
      version: rawPackage.packageJson.version,
    };
  });

  const docsBySlug = new Map(baseDocs.map((doc) => [doc.slug, doc]));

  const docs: PackageDoc[] = baseDocs.map((baseDoc) => {
    const relatedDocs = baseDoc.relatedSlugs
      .map((slug) => docsBySlug.get(slug))
      .filter((packageDoc): packageDoc is BasePackageDoc => Boolean(packageDoc));
    const relatedPackageNames = relatedDocs.map((packageDoc) => packageDoc.name);
    const relatedSlugs = relatedDocs.map((packageDoc) => packageDoc.slug);

    return {
      ...baseDoc,
      guideSections: buildGuideSections(
        { ...baseDoc, relatedSlugs },
        baseDoc.parsedReadme.sections,
        relatedPackageNames
      ),
      relatedPackageNames,
      relatedSlugs,
    };
  });

  return docs.sort((leftDoc, rightDoc) => {
    const categoryDelta = CATEGORY_ORDER.indexOf(leftDoc.category) - CATEGORY_ORDER.indexOf(rightDoc.category);

    if (categoryDelta !== 0) {
      return categoryDelta;
    }

    return leftDoc.name.localeCompare(rightDoc.name);
  });
}

export async function getAllPackageDocs(): Promise<PackageDoc[]> {
  if (!packageDocsPromise) {
    packageDocsPromise = loadAllPackageDocs();
  }

  return packageDocsPromise;
}

export async function getPackageDocBySlug(slug: string): Promise<PackageDoc | undefined> {
  const packageDocs = await getAllPackageDocs();

  return packageDocs.find((packageDoc) => packageDoc.slug === slug);
}

export async function getPackageCategoryGroups(): Promise<
  Array<{
    category: PackageCategory;
    packageDocs: PackageDoc[];
  }>
> {
  const packageDocs = await getAllPackageDocs();

  return CATEGORY_ORDER.map((category) => ({
    category,
    packageDocs: packageDocs.filter((packageDoc) => packageDoc.category === category),
  })).filter((group) => group.packageDocs.length > 0);
}

export function __internal__parseMarkdownSections(markdown: string): MarkdownDocument {
  return parseMarkdownSections(markdown);
}

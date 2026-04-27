import { slugifyValue } from './slugs';

export type PackageCategory =
  | 'Authentication'
  | 'Components'
  | 'Config'
  | 'Scaffolding'
  | 'Server'
  | 'Types'
  | 'Utilities';

export type PackageAccent = {
  badgeClassName: string;
  borderClassName: string;
  glowClassName: string;
  orbClassName: string;
  surfaceClassName: string;
  textClassName: string;
};

export type GuideSection = {
  eyebrow: string;
  id: string;
  markdown: string;
  title: string;
};

export type PackageQuickStart = {
  code: string;
  description: string;
  language: string;
  title: string;
};

export type PackageDoc = {
  accent: PackageAccent;
  category: PackageCategory;
  changelog: string;
  description: string;
  entrypoints: string[];
  exports: string[];
  folderName: string;
  guideSections: GuideSection[];
  highlights: string[];
  installCommand: string;
  internalDependencies: string[];
  keyFiles: string[];
  latestReleaseNotes: string;
  name: string;
  peerDependencies: string[];
  quickStart: PackageQuickStart;
  readme: string;
  readingTimeMinutes: number;
  referenceMarkdown: string;
  relatedPackageNames: string[];
  relatedSlugs: string[];
  slug: string;
  summary: string;
  tagline: string;
  version: string;
};

export const CATEGORY_ORDER: PackageCategory[] = [
  'Components',
  'Authentication',
  'Server',
  'Utilities',
  'Types',
  'Config',
  'Scaffolding',
];

export const CATEGORY_META: Record<
  PackageCategory,
  {
    description: string;
    label: string;
    accent: PackageAccent;
  }
> = {
  Components: {
    label: 'Components',
    description: 'Design systems, theme primitives, and ready-to-ship interface building blocks.',
    accent: {
      badgeClassName: 'bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-200',
      borderClassName: 'border-rose-200/80',
      glowClassName: 'shadow-[0_32px_80px_-42px_rgba(244,63,94,0.55)]',
      orbClassName: 'from-rose-300/65 via-orange-200/50 to-transparent',
      surfaceClassName: 'from-rose-50 via-orange-50 to-white',
      textClassName: 'text-rose-700',
    },
  },
  Authentication: {
    label: 'Authentication',
    description: 'Identity flows and route-level primitives for secure front-end sessions.',
    accent: {
      badgeClassName: 'bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-sky-200',
      borderClassName: 'border-sky-200/80',
      glowClassName: 'shadow-[0_32px_80px_-42px_rgba(14,165,233,0.45)]',
      orbClassName: 'from-sky-300/60 via-cyan-200/45 to-transparent',
      surfaceClassName: 'from-sky-50 via-cyan-50 to-white',
      textClassName: 'text-sky-700',
    },
  },
  Server: {
    label: 'Server Runtime',
    description: 'Production-facing runtime helpers for delivery, proxying, and front-end hosting.',
    accent: {
      badgeClassName: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-200',
      borderClassName: 'border-emerald-200/80',
      glowClassName: 'shadow-[0_32px_80px_-42px_rgba(16,185,129,0.45)]',
      orbClassName: 'from-emerald-300/65 via-teal-200/45 to-transparent',
      surfaceClassName: 'from-emerald-50 via-teal-50 to-white',
      textClassName: 'text-emerald-700',
    },
  },
  Utilities: {
    label: 'Utilities',
    description: 'Shared helpers, hooks, and error-shaping primitives used across the workspace.',
    accent: {
      badgeClassName: 'bg-violet-500/10 text-violet-700 ring-1 ring-inset ring-violet-200',
      borderClassName: 'border-violet-200/80',
      glowClassName: 'shadow-[0_32px_80px_-42px_rgba(139,92,246,0.42)]',
      orbClassName: 'from-violet-300/65 via-fuchsia-200/45 to-transparent',
      surfaceClassName: 'from-violet-50 via-fuchsia-50 to-white',
      textClassName: 'text-violet-700',
    },
  },
  Types: {
    label: 'Types',
    description: 'Type-only contracts that keep front-end and back-end code aligned.',
    accent: {
      badgeClassName: 'bg-indigo-500/10 text-indigo-700 ring-1 ring-inset ring-indigo-200',
      borderClassName: 'border-indigo-200/80',
      glowClassName: 'shadow-[0_32px_80px_-42px_rgba(99,102,241,0.42)]',
      orbClassName: 'from-indigo-300/65 via-blue-200/45 to-transparent',
      surfaceClassName: 'from-indigo-50 via-blue-50 to-white',
      textClassName: 'text-indigo-700',
    },
  },
  Config: {
    label: 'Config',
    description: 'Reusable standards for linting, formatting, bundling, testing, and build setup.',
    accent: {
      badgeClassName: 'bg-amber-500/10 text-amber-800 ring-1 ring-inset ring-amber-200',
      borderClassName: 'border-amber-200/80',
      glowClassName: 'shadow-[0_32px_80px_-42px_rgba(245,158,11,0.42)]',
      orbClassName: 'from-amber-300/65 via-yellow-200/45 to-transparent',
      surfaceClassName: 'from-amber-50 via-yellow-50 to-white',
      textClassName: 'text-amber-800',
    },
  },
  Scaffolding: {
    label: 'Scaffolding',
    description: 'Generators that stamp out new apps and opinionated feature slices quickly.',
    accent: {
      badgeClassName: 'bg-pink-500/10 text-pink-700 ring-1 ring-inset ring-pink-200',
      borderClassName: 'border-pink-200/80',
      glowClassName: 'shadow-[0_32px_80px_-42px_rgba(236,72,153,0.42)]',
      orbClassName: 'from-pink-300/65 via-rose-200/45 to-transparent',
      surfaceClassName: 'from-pink-50 via-rose-50 to-white',
      textClassName: 'text-pink-700',
    },
  },
};

export function categoryAnchor(category: PackageCategory): string {
  return `category-${slugifyValue(category)}`;
}

import { promises as fs } from 'fs';
import path from 'path';

import type { PackageDoc } from '../src/lib/docs-catalog';
import { __internal__parseMarkdownSections, getAllPackageDocs, getPackageDocBySlug } from '../src/lib/package-docs';

describe('package docs loader', () => {
  it('discovers every package folder and assigns stable slugs', async () => {
    const packageDirectory = path.resolve(process.cwd(), '..', '..', 'packages');
    const directoryEntries = await fs.readdir(packageDirectory, { withFileTypes: true });
    const expectedPackageCount = directoryEntries.filter((entry) => entry.isDirectory()).length;

    const packageDocs = await getAllPackageDocs();

    expect(packageDocs).toHaveLength(expectedPackageCount);
    expect(packageDocs.map((packageDoc: PackageDoc) => packageDoc.slug)).toEqual(
      expect.arrayContaining(['eslint-config', 'frontend-server', 'mui-components', 'utils'])
    );
  });

  it('extracts markdown sections while keeping nested headings inside their parent sections', () => {
    const parsed = __internal__parseMarkdownSections(`# Package Title

Intro paragraph.

## Installation

\`\`\`bash
npm install sample
\`\`\`

### Optional flags

Document more setup.

## Usage

Import the entrypoint.`);

    expect(parsed.sections.map((section) => section.title)).toEqual(['Installation', 'Usage']);
    expect(parsed.sections[0].content).toContain('### Optional flags');
    expect(parsed.sections[1].content).toContain('Import the entrypoint.');
  });

  it('builds fallback guide sections for packages with sparse README structure', async () => {
    const packageDoc = await getPackageDocBySlug('prettier-config');

    expect(packageDoc).toBeDefined();
    expect(packageDoc?.guideSections.map((section) => section.title)).toEqual(
      expect.arrayContaining(['Installation', 'Point Prettier at the shared config', 'Exports And Entrypoints'])
    );
    expect(packageDoc?.guideSections.find((section) => section.id === 'installation')?.markdown).toContain(
      'npm install -D @batoanng/prettier-config'
    );
  });

  it('uses explicit generator highlights so Next.js and Node.js stay visible on the package page', async () => {
    const packageDoc = await getPackageDocBySlug('t-generator');

    expect(packageDoc).toBeDefined();
    expect(packageDoc?.highlights.join(' ')).toContain('Next.js App Router');
    expect(packageDoc?.highlights.join(' ')).toContain('Node.js + Express');
  });

  it('builds rich stack-by-stack guide sections for t-generator', async () => {
    const packageDoc = await getPackageDocBySlug('t-generator');

    expect(packageDoc).toBeDefined();
    expect(packageDoc?.guideSections.map((section) => section.title)).toEqual(
      expect.arrayContaining([
        'What It Covers',
        'Install And Run',
        'React And Next.js Stacks',
        'NestJS And Node.js Stacks',
        'Local Development And Release Workflow',
      ])
    );
    expect(packageDoc?.guideSections.find((section) => section.id === 'react-and-nextjs')?.markdown).toContain(
      'yo t-generator:react-add bff'
    );
    expect(packageDoc?.guideSections.find((section) => section.id === 'nestjs-and-nodejs')?.markdown).toContain(
      'yo t-generator:nestjs-add graphql'
    );
    expect(packageDoc?.guideSections.find((section) => section.id === 'overview')?.markdown).toContain(
      '| React | React, TypeScript, Vite, React Router, Vitest, Feature-Sliced Design structure |'
    );
  });

  it('documents tailwind-config with the Tailwind v4 CSS-first quick start', async () => {
    const packageDoc = await getPackageDocBySlug('tailwind-config');

    expect(packageDoc).toBeDefined();
    expect(packageDoc?.quickStart.language).toBe('css');
    expect(packageDoc?.quickStart.code).toContain('@import "tailwindcss";');
    expect(packageDoc?.quickStart.code).toContain('@import "@batoanng/tailwind-config/styles.css";');
  });
});

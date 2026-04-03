import { promises as fs } from 'fs'
import path from 'path'

import type { PackageDoc } from '../src/lib/docs-catalog'
import { __internal__parseMarkdownSections, getAllPackageDocs, getPackageDocBySlug } from '../src/lib/package-docs'

describe('package docs loader', () => {
  it('discovers every package folder and assigns stable slugs', async () => {
    const packageDirectory = path.resolve(process.cwd(), '..', '..', 'packages')
    const directoryEntries = await fs.readdir(packageDirectory, { withFileTypes: true })
    const expectedPackageCount = directoryEntries.filter((entry) => entry.isDirectory()).length

    const packageDocs = await getAllPackageDocs()

    expect(packageDocs).toHaveLength(expectedPackageCount)
    expect(packageDocs.map((packageDoc: PackageDoc) => packageDoc.slug)).toEqual(
      expect.arrayContaining(['eslint-config', 'frontend-server', 'mui-components', 'utils'])
    )
  })

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

Import the entrypoint.`)

    expect(parsed.sections.map((section) => section.title)).toEqual(['Installation', 'Usage'])
    expect(parsed.sections[0].content).toContain('### Optional flags')
    expect(parsed.sections[1].content).toContain('Import the entrypoint.')
  })

  it('builds fallback guide sections for packages with sparse README structure', async () => {
    const packageDoc = await getPackageDocBySlug('prettier-config')

    expect(packageDoc).toBeDefined()
    expect(packageDoc?.guideSections.map((section) => section.title)).toEqual(
      expect.arrayContaining(['Installation', 'Point Prettier at the shared config', 'Exports And Entrypoints'])
    )
    expect(packageDoc?.guideSections.find((section) => section.id === 'installation')?.markdown).toContain(
      'npm install -D @batoanng/prettier-config'
    )
  })
})

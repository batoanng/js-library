import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PackageGuide } from '@/components/docs/package-guide'
import type { PackageDoc } from '@/lib/docs-catalog'
import { getAllPackageDocs, getPackageDocBySlug } from '@/lib/package-docs'

type PackageSectionPageProps = {
  params: Promise<{
    sectionPath: string[]
    slug: string
  }>
}

export const dynamicParams = false

const referenceSectionId = 'reference'

function packageSectionIds(packageDoc: PackageDoc): string[] {
  return [
    ...packageDoc.guideSections.map((section) => section.id),
    ...(packageDoc.referenceMarkdown.trim().length > 0 ? [referenceSectionId] : []),
  ]
}

function findSectionTitle(packageDoc: PackageDoc, sectionId: string): string | undefined {
  if (sectionId === referenceSectionId && packageDoc.referenceMarkdown.trim().length > 0) {
    return 'Reference'
  }

  return packageDoc.guideSections.find((section) => section.id === sectionId)?.title
}

export async function generateStaticParams() {
  const packageDocs = await getAllPackageDocs()

  return packageDocs.flatMap((packageDoc) =>
    packageSectionIds(packageDoc).map((sectionId) => ({
      sectionPath: [sectionId],
      slug: packageDoc.slug,
    }))
  )
}

export async function generateMetadata({ params }: PackageSectionPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const sectionId = resolvedParams.sectionPath[0]
  const packageDoc = await getPackageDocBySlug(resolvedParams.slug)
  const sectionTitle = packageDoc && sectionId ? findSectionTitle(packageDoc, sectionId) : undefined

  if (!packageDoc || !sectionTitle || resolvedParams.sectionPath.length !== 1) {
    return {
      title: 'Package section not found',
    }
  }

  return {
    title: `${packageDoc.name} ${sectionTitle} Docs`,
    description: packageDoc.summary,
  }
}

export default async function PackageSectionPage({ params }: PackageSectionPageProps) {
  const resolvedParams = await params
  const sectionId = resolvedParams.sectionPath[0]
  const packageDoc = await getPackageDocBySlug(resolvedParams.slug)
  const sectionTitle = packageDoc && sectionId ? findSectionTitle(packageDoc, sectionId) : undefined

  if (!packageDoc || !sectionTitle || resolvedParams.sectionPath.length !== 1) {
    notFound()
  }

  return <PackageGuide packageDoc={packageDoc} />
}

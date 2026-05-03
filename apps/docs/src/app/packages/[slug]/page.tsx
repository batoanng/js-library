import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PackageGuide } from '@/components/docs/package-guide'
import type { PackageDoc } from '@/lib/docs-catalog'
import { getAllPackageDocs, getPackageDocBySlug } from '@/lib/package-docs'

type PackagePageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  const packageDocs = await getAllPackageDocs()

  return packageDocs.map((packageDoc: PackageDoc) => ({
    slug: packageDoc.slug,
  }))
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const packageDoc = await getPackageDocBySlug(resolvedParams.slug)

  if (!packageDoc) {
    return {
      title: 'Package not found',
    }
  }

  return {
    title: `${packageDoc.name} Docs`,
    description: packageDoc.summary,
  }
}

export default async function PackagePage({ params }: PackagePageProps) {
  const resolvedParams = await params
  const packageDoc = await getPackageDocBySlug(resolvedParams.slug)

  if (!packageDoc) {
    notFound()
  }

  return <PackageGuide packageDoc={packageDoc} />
}

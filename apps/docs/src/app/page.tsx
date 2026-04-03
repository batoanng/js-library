import { DocsHome } from '@/components/docs/docs-home'
import { getAllPackageDocs } from '@/lib/package-docs'

export default async function HomePage() {
  const packageDocs = await getAllPackageDocs()

  return <DocsHome packageDocs={packageDocs} />
}

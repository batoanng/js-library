'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

import { AnimatedSection, DocsMotionProvider } from '@/components/docs/docs-motion'
import { CategoryIcon } from '@/components/docs/icons'
import { MarkdownRenderer } from '@/components/docs/markdown-renderer'
import type { PackageDoc } from '@/lib/docs-catalog'

type PackageGuideProps = {
  packageDoc: PackageDoc
}

export function PackageGuide({ packageDoc }: PackageGuideProps) {
  const packagePath = `/packages/${packageDoc.slug}`
  const hasReference = packageDoc.referenceMarkdown.trim().length > 0
  const tocItems = [
    ...packageDoc.guideSections.map((section) => ({
      id: section.id,
      title: section.title,
    })),
    ...(hasReference
      ? [
          {
            id: 'reference',
            title: 'Reference',
          },
        ]
      : []),
  ]

  return (
    <DocsMotionProvider>
      <main className="docs-shell pb-24 pt-8 sm:pt-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              href="/"
            >
              <ArrowLeftIcon className="size-4" />
              All packages
            </Link>
            <span>/</span>
            <span>{packageDoc.name}</span>
          </div>

          <AnimatedSection>
            <section
              className={clsx(
                'relative overflow-hidden rounded-[2rem] border bg-gradient-to-br px-6 py-8 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.35)] backdrop-blur sm:px-8 sm:py-10 lg:px-12 lg:py-12',
                packageDoc.accent.borderClassName,
                packageDoc.accent.surfaceClassName,
                packageDoc.accent.glowClassName
              )}
            >
              <div
                className={clsx(
                  'pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full bg-gradient-to-br blur-3xl',
                  packageDoc.accent.orbClassName
                )}
              />
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                <div className="relative">
                  <div
                    className={clsx(
                      'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]',
                      packageDoc.accent.badgeClassName
                    )}
                  >
                    <CategoryIcon category={packageDoc.category} />
                    {packageDoc.category}
                  </div>
                  <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                    {packageDoc.name}
                  </h1>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">{packageDoc.tagline}</p>
                  <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="docs-chip bg-white/80 shadow-sm">Version {packageDoc.version}</span>
                    <span className="docs-chip bg-white/80 shadow-sm">{packageDoc.readingTimeMinutes} min read</span>
                    {packageDoc.peerDependencies.length > 0 ? (
                      <span className="docs-chip bg-white/80 shadow-sm">
                        {packageDoc.peerDependencies.length} peer dep
                        {packageDoc.peerDependencies.length === 1 ? '' : 's'}
                      </span>
                    ) : null}
                    {packageDoc.entrypoints.length > 0 ? (
                      <span className="docs-chip bg-white/80 shadow-sm">
                        {packageDoc.entrypoints.length} entrypoint{packageDoc.entrypoints.length === 1 ? '' : 's'}
                      </span>
                    ) : null}
                    {packageDoc.exports.length > 0 ? (
                      <span className="docs-chip bg-white/80 shadow-sm">
                        {packageDoc.exports.length} export{packageDoc.exports.length === 1 ? '' : 's'}
                      </span>
                    ) : null}
                  </div>
                </div>
                <motion.div
                  className="relative rounded-[1.6rem] border border-slate-950/10 bg-slate-950 p-5 text-slate-50"
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -4 }}
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Quick install</p>
                  <code className="mt-3 block overflow-x-auto text-sm">{packageDoc.installCommand}</code>
                  <div className="mt-5 border-t border-white/10 pt-5">
                    <p className="text-sm font-medium text-white/85">{packageDoc.quickStart.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/70">{packageDoc.quickStart.description}</p>
                  </div>
                </motion.div>
              </div>
            </section>
          </AnimatedSection>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-6">
              {packageDoc.guideSections.map((section, index) => (
                <AnimatedSection delay={index * 0.04} id={section.id} key={section.id}>
                  <section className="docs-panel">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="docs-eyebrow">{section.eyebrow}</p>
                        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">
                          {section.title}
                        </h2>
                      </div>
                      <Link
                        className="hidden items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-950 sm:inline-flex"
                        href={`${packagePath}/${section.id}#${section.id}`}
                      >
                        Jump link
                        <ArrowTopRightOnSquareIcon className="size-4" />
                      </Link>
                    </div>
                    <div className="mt-6">
                      <MarkdownRenderer content={section.markdown} headingPrefix={`${packageDoc.slug}-${section.id}`} />
                    </div>
                  </section>
                </AnimatedSection>
              ))}

              {hasReference ? (
                <AnimatedSection id="reference">
                  <section className="docs-panel">
                    <p className="docs-eyebrow">Source docs</p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">Reference</h2>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                      The full README is rendered below so the package guide stays detailed and traceable to the source
                      docs that live with the package itself.
                    </p>
                    <div className="mt-8">
                      <MarkdownRenderer
                        content={packageDoc.referenceMarkdown}
                        headingPrefix={`${packageDoc.slug}-reference`}
                      />
                    </div>
                  </section>
                </AnimatedSection>
              ) : null}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
              <section className="docs-panel">
                <p className="docs-eyebrow">On this page</p>
                <nav className="mt-4 space-y-2">
                  {tocItems.map((item) => (
                    <Link
                      className="flex rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                      href={`${packagePath}/${item.id}#${item.id}`}
                      key={item.id}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </section>

              {packageDoc.relatedSlugs.length > 0 ? (
                <section className="docs-panel">
                  <p className="docs-eyebrow">Related packages</p>
                  <div className="mt-4 flex flex-col gap-2">
                    {packageDoc.relatedSlugs.map((relatedSlug, index) => (
                      <Link
                        className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                        href={`/packages/${relatedSlug}`}
                        key={relatedSlug}
                      >
                        <span>{packageDoc.relatedPackageNames[index]}</span>
                        <ArrowLeftIcon className="size-4 rotate-180" />
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              {packageDoc.peerDependencies.length > 0 ? (
                <section className="docs-panel">
                  <p className="docs-eyebrow">Peer dependencies</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {packageDoc.peerDependencies.map((dependencyName) => (
                      <span className="docs-chip bg-slate-100 text-slate-700" key={dependencyName}>
                        {dependencyName}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        </div>
      </main>
    </DocsMotionProvider>
  )
}

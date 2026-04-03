'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

import { AnimatedSection, DocsMotionProvider, StaggeredGrid, StaggeredGridItem } from '@/components/docs/docs-motion'
import { CategoryIcon } from '@/components/docs/icons'
import { CATEGORY_META, CATEGORY_ORDER, categoryAnchor, type PackageDoc } from '@/lib/docs-catalog'

type DocsHomeProps = {
  packageDocs: PackageDoc[]
}

export function DocsHome({ packageDocs }: DocsHomeProps) {
  const categoryGroups = CATEGORY_ORDER.map((category) => ({
    category,
    packageDocs: packageDocs.filter((packageDoc) => packageDoc.category === category),
  })).filter((group) => group.packageDocs.length > 0)

  const configPackageCount = packageDocs.filter((packageDoc) => packageDoc.category === 'Config').length

  return (
    <DocsMotionProvider>
      <main className="docs-shell pb-24 pt-10 sm:pt-14">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 px-6 py-8 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.35)] backdrop-blur sm:px-8 sm:py-10 lg:px-12 lg:py-14">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <div className="pointer-events-none absolute -right-16 top-0 size-56 rounded-full bg-gradient-to-br from-rose-300/50 via-sky-300/30 to-transparent blur-3xl" />
              <div className="pointer-events-none absolute -left-12 bottom-0 size-52 rounded-full bg-gradient-to-br from-amber-200/60 via-orange-100/30 to-transparent blur-3xl" />
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                <div>
                  <span className="docs-eyebrow">Package Docs Hub</span>
                  <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                    The shared building blocks behind this JavaScript library monorepo.
                  </h1>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                    Browse every package under <code className="docs-inline-code">packages/</code>, see how they fit
                    together, and jump straight into install steps, quick-start snippets, and the full reference docs.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {categoryGroups.map(({ category }) => (
                      <a
                        key={category}
                        className="docs-chip bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
                        href={`#${categoryAnchor(category)}`}
                      >
                        <CategoryIcon category={category} className={CATEGORY_META[category].accent.textClassName} />
                        {CATEGORY_META[category].label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="docs-panel bg-slate-950 text-white">
                    <p className="text-sm uppercase tracking-[0.24em] text-white/65">Packages</p>
                    <p className="mt-3 text-4xl font-semibold">{packageDocs.length}</p>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      Each card leads to a detailed usage guide and the README reference.
                    </p>
                  </div>
                  <div className="docs-panel">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Categories</p>
                    <p className="mt-3 text-4xl font-semibold text-slate-950">{categoryGroups.length}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      From config presets to runtime packages, grouped by how teams adopt them.
                    </p>
                  </div>
                  <div className="docs-panel">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Config Pack</p>
                    <p className="mt-3 text-4xl font-semibold text-slate-950">{configPackageCount}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Linting, formatting, TypeScript, Tailwind, Jest, and Vite standards in one lane.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {categoryGroups.map(({ category, packageDocs: docsInCategory }, categoryIndex) => {
            const categoryMeta = CATEGORY_META[category]

            return (
              <AnimatedSection className="space-y-6" delay={categoryIndex * 0.05} id={categoryAnchor(category)} key={category}>
                <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div
                      className={clsx(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
                        categoryMeta.accent.badgeClassName
                      )}
                    >
                      <CategoryIcon category={category} />
                      {categoryMeta.label}
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950">
                      {categoryMeta.description}
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-slate-600">
                    {docsInCategory.length} package{docsInCategory.length === 1 ? '' : 's'} in this lane.
                  </p>
                </div>

                <StaggeredGrid className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {docsInCategory.map((packageDoc) => (
                    <StaggeredGridItem key={packageDoc.slug}>
                      <Link className="group block h-full" href={`/packages/${packageDoc.slug}`}>
                        <motion.article
                          className={clsx(
                            'relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-6 transition duration-500',
                            packageDoc.accent.borderClassName,
                            packageDoc.accent.surfaceClassName,
                            packageDoc.accent.glowClassName
                          )}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ y: -10 }}
                        >
                          <div
                            className={clsx(
                              'pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl',
                              packageDoc.accent.orbClassName
                            )}
                          />
                          <div className="relative flex items-start justify-between gap-4">
                            <div>
                              <div
                                className={clsx(
                                  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
                                  packageDoc.accent.badgeClassName
                                )}
                              >
                                <CategoryIcon category={packageDoc.category} />
                                {packageDoc.category}
                              </div>
                              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-950">
                                {packageDoc.name}
                              </h3>
                            </div>
                            <ArrowRightIcon className="mt-1 size-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
                          </div>
                          <p className="relative mt-4 text-sm leading-7 text-slate-700">{packageDoc.tagline}</p>
                          <div className="relative mt-6 rounded-[1.4rem] border border-slate-950/10 bg-slate-950 px-4 py-4 text-slate-50">
                            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Install</p>
                            <code className="mt-3 block overflow-x-auto text-sm">{packageDoc.installCommand}</code>
                          </div>
                          <ul className="relative mt-6 space-y-2 text-sm leading-6 text-slate-700">
                            {packageDoc.highlights.slice(0, 3).map((highlight) => (
                              <li className="flex gap-3" key={highlight}>
                                <span className={clsx('mt-2 size-1.5 shrink-0 rounded-full', packageDoc.accent.textClassName)} />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                          {packageDoc.relatedPackageNames.length > 0 ? (
                            <div className="relative mt-6 flex flex-wrap gap-2">
                              {packageDoc.relatedPackageNames.map((relatedPackageName) => (
                                <span className="docs-chip bg-white/80 text-slate-700 shadow-sm" key={relatedPackageName}>
                                  {relatedPackageName}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          <div className="relative mt-6 flex items-center justify-between pt-2 text-sm text-slate-500">
                            <span>v{packageDoc.version}</span>
                            <span>{packageDoc.readingTimeMinutes} min read</span>
                          </div>
                        </motion.article>
                      </Link>
                    </StaggeredGridItem>
                  ))}
                </StaggeredGrid>
              </AnimatedSection>
            )
          })}
        </div>
      </main>
    </DocsMotionProvider>
  )
}

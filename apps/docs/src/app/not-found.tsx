import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="docs-shell flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
      <section className="docs-panel max-w-2xl text-center">
        <p className="docs-eyebrow">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          This package page does not exist.
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-600">
          The docs hub only generates routes for packages that are currently present under
          <code className="docs-inline-code"> packages/</code>.
        </p>
        <Link
          className="mt-8 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          href="/"
        >
          Return to the package hub
        </Link>
      </section>
    </main>
  )
}

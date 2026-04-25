import { env } from '@/shared/config';

export function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Base application</p>
        <h1>{env.appName}</h1>
        <p>
          Next.js App Router starter with testing, shared config, aliases, and a
          Feature-Sliced Design foundation for product work.
        </p>

      </section>
    </main>
  );
}

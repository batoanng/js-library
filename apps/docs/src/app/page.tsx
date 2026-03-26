import {
  ArchiveBoxArrowDownIcon,
  BeakerIcon,
  BriefcaseIcon,
  CursorArrowRaysIcon,
  FunnelIcon,
  type HeroIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline'

type Feature = {
  description: string
  href: string
  Icon: HeroIcon
  name: string
}

const features: Feature[] = [
  {
    name: 'Turborepo',
    description:
      'Turborepo is a high-performance build system for JavaScript and TypeScript codebases.',
    href: 'https://turbo.build/repo',
    Icon: ServerStackIcon,
  },
  {
    name: 'pnpm',
    description: 'Fast, disk space efficient package manager',
    href: 'https://pnpm.io/',
    Icon: ArchiveBoxArrowDownIcon,
  },
  {
    name: 'Next.js',
    description:
      'Next.js gives you the best developer experience of React for production.',
    href: 'https://nextjs.org/',
    Icon: BriefcaseIcon,
  },
  {
    name: 'Tailwindcss',
    description:
      'Rapidly build modern websites without ever leaving your HTML.',
    href: 'https://tailwindcss.com/',
    Icon: CursorArrowRaysIcon,
  },
  {
    name: 'ESLlint',
    description: 'Find and fix problems in your JavaScript code ',
    href: 'https://turbo.build/repo',
    Icon: FunnelIcon,
  },
  {
    name: 'Jest',
    description:
      'Jest is a delightful JavaScript Testing Framework with a focus on simplicity.',
    href: 'https://jestjs.io/',
    Icon: BeakerIcon,
  },
]

function FeatureCard({ description, href, Icon, name }: Feature) {
  return (
    <a
      className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 transition group-hover:bg-pink-100">
        <Icon aria-hidden className="size-6" />
      </div>
      <h2 className="mt-6 text-lg font-semibold text-slate-900">{name}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </a>
  )
}

export default function Example() {
  return (
    <main className="bg-brand/50">
      {/* Feature section with grid */}
      <div className="relative bg-white py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="bg-gradient-to-r from-pink-500 to-indigo-800  bg-clip-text text-4xl font-bold text-transparent">
            Turbo Monorepo Template
          </h1>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            A battery-included presets to bootstrap a monorepo
          </p>
          <section className="grid grid-cols-1 gap-8 pt-12  sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.name}
                Icon={feature.Icon}
                name={feature.name}
                href={feature.href}
                description={feature.description}
              />
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}

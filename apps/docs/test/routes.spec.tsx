import { render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'

jest.mock('react-markdown', () => {
  return function ReactMarkdownMock({
    children,
  }: PropsWithChildren<{
    children?: string
  }>) {
    return <div>{children}</div>
  }
})

jest.mock('remark-gfm', () => () => undefined)

import HomePage from '../src/app/page'
import PackagePage, { generateStaticParams } from '../src/app/packages/[slug]/page'

jest.mock('framer-motion', () => {
  const React = require('react')

  const motion = new Proxy(
    {},
    {
      get: (_target, tagName: string) =>
        React.forwardRef(function MotionComponent(
          { children, ...props }: PropsWithChildren<Record<string, unknown>>,
          ref: unknown
        ) {
          const {
            animate,
            initial,
            layout,
            transition,
            variants,
            viewport,
            whileHover,
            whileInView,
            ...safeProps
          } = props

          void animate
          void initial
          void layout
          void transition
          void variants
          void viewport
          void whileHover
          void whileInView

          return React.createElement(tagName, { ...safeProps, ref }, children)
        }),
    }
  )

  return {
    MotionConfig: ({ children }: PropsWithChildren) => <>{children}</>,
    motion,
    useReducedMotion: () => false,
  }
})

describe('docs routes', () => {
  it('renders the home page with package links', async () => {
    render(await HomePage())

    expect(screen.getByRole('heading', { name: /shared building blocks behind this javascript library monorepo/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '@batoanng/utils', level: 3 })).toBeInTheDocument()
    expect(screen.getAllByRole('link').find((link) => link.getAttribute('href') === '/packages/utils')).toBeTruthy()
    expect(screen.getByText(/Package Docs Hub/i)).toBeInTheDocument()
  })

  it('renders a library package page with quick-start and reference sections', async () => {
    render(await PackagePage({ params: { slug: 'utils' } }))

    expect(screen.getByRole('heading', { name: '@batoanng/utils' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Pull utility functions and hooks from the package root/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Reference', level: 2 })).toBeInTheDocument()
    expect(screen.getAllByText(/npm install @batoanng\/utils/i).length).toBeGreaterThan(0)
  })

  it('renders a config package page with export details', async () => {
    render(await PackagePage({ params: { slug: 'eslint-config' } }))

    expect(screen.getByRole('heading', { name: /Compose a flat config/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/Export surface/i)).toBeInTheDocument()
    expect(screen.getAllByText(/@batoanng\/eslint-config\/typed/i).length).toBeGreaterThan(0)
  })

  it('generates static params for the package routes', async () => {
    const params = await generateStaticParams()

    expect(params).toEqual(expect.arrayContaining([{ slug: 'utils' }, { slug: 'mui-components' }]))
  })
})

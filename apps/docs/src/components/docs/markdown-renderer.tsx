import clsx from 'clsx'
import type { Components, ExtraProps } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { isValidElement, type ComponentProps } from 'react'

import { slugifyValue } from '@/lib/slugs'

type MarkdownRendererProps = {
  className?: string
  content: string
  headingPrefix?: string
}

function extractText(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return `${node}`
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join(' ')
  }

  if (isValidElement(node)) {
    return extractText((node.props as { children?: unknown }).children)
  }

  return ''
}

function createHeading(
  tagName: 'h1' | 'h2' | 'h3' | 'h4',
  headingPrefix: string
): Components['h2'] {
  return function Heading({ children, ...props }) {
    const text = extractText(children)
    const id = slugifyValue(`${headingPrefix}-${text}`)

    return (
      <div className="scroll-mt-28" id={id}>
        {tagName === 'h1' ? (
          <h1 className="mt-10 font-display text-3xl font-semibold tracking-tight text-slate-950" {...props}>
            {children}
          </h1>
        ) : null}
        {tagName === 'h2' ? (
          <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-slate-950" {...props}>
            {children}
          </h2>
        ) : null}
        {tagName === 'h3' ? (
          <h3 className="mt-8 text-lg font-semibold tracking-tight text-slate-900" {...props}>
            {children}
          </h3>
        ) : null}
        {tagName === 'h4' ? (
          <h4 className="mt-6 text-base font-semibold tracking-tight text-slate-900" {...props}>
            {children}
          </h4>
        ) : null}
      </div>
    )
  }
}

function markdownComponents(headingPrefix: string): Components {
  return {
    a({ children, href, ...props }) {
      const isExternal = Boolean(href?.startsWith('http'))

      return (
        <a
          className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-950"
          href={href}
          rel={isExternal ? 'noreferrer' : undefined}
          target={isExternal ? '_blank' : undefined}
          {...props}
        >
          {children}
        </a>
      )
    },
    blockquote({ children, ...props }) {
      return (
        <blockquote
          className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-5 py-4 text-slate-700"
          {...props}
        >
          {children}
        </blockquote>
      )
    },
    code({ children, className, ...props }: ComponentProps<'code'> & ExtraProps) {
      const isBlock = Boolean(className)

      if (isBlock) {
        return (
          <code className={clsx('docs-code-block', className)} {...props}>
            {children}
          </code>
        )
      }

      return (
        <code className="rounded-md bg-slate-950/[0.04] px-1.5 py-0.5 text-[0.92em] text-slate-900" {...props}>
          {children}
        </code>
      )
    },
    h1: createHeading('h1', headingPrefix),
    h2: createHeading('h2', headingPrefix),
    h3: createHeading('h3', headingPrefix),
    h4: createHeading('h4', headingPrefix),
    hr() {
      return <hr className="my-10 border-slate-200" />
    },
    img({ alt, ...props }) {
      return <img alt={alt ?? ''} className="rounded-2xl border border-slate-200/80" {...props} />
    },
    ol({ children, ...props }) {
      return (
        <ol className="ml-5 list-decimal space-y-2 text-slate-700" {...props}>
          {children}
        </ol>
      )
    },
    p({ children, ...props }) {
      return (
        <p className="text-base leading-7 text-slate-700" {...props}>
          {children}
        </p>
      )
    },
    pre({ children, ...props }) {
      return (
        <pre className="docs-code-surface overflow-x-auto rounded-[1.4rem] p-4 text-sm text-slate-100" {...props}>
          {children}
        </pre>
      )
    },
    table({ children, ...props }) {
      return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
          <table className="min-w-full border-collapse text-left text-sm" {...props}>
            {children}
          </table>
        </div>
      )
    },
    td({ children, ...props }) {
      return (
        <td className="border-t border-slate-200 px-4 py-3 align-top text-slate-700" {...props}>
          {children}
        </td>
      )
    },
    th({ children, ...props }) {
      return (
        <th className="bg-slate-50 px-4 py-3 font-semibold text-slate-950" {...props}>
          {children}
        </th>
      )
    },
    ul({ children, ...props }) {
      return (
        <ul className="ml-5 list-disc space-y-2 text-slate-700" {...props}>
          {children}
        </ul>
      )
    },
  }
}

export function MarkdownRenderer({ className, content, headingPrefix = 'docs' }: MarkdownRendererProps) {
  return (
    <div className={clsx('docs-prose', className)}>
      <ReactMarkdown components={markdownComponents(headingPrefix)} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

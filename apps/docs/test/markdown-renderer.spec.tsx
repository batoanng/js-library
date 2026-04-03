import { render, screen, waitFor } from '@testing-library/react'

jest.mock('react-markdown', () => {
  return function ReactMarkdownMock({
    components,
  }: {
    components: {
      code?: (props: { children: string; className?: string }) => JSX.Element
    }
  }) {
    return <div>{components.code?.({ children: 'flowchart TD\n  A --> B\n', className: 'language-mermaid' })}</div>
  }
})

jest.mock('remark-gfm', () => () => undefined)

import { MarkdownRenderer } from '../src/components/docs/markdown-renderer'

const mermaidMarkdown = `## Diagram

\`\`\`mermaid
flowchart TD
  A --> B
\`\`\`
`

describe('MarkdownRenderer', () => {
  afterEach(() => {
    delete (window as typeof window & { __docsMermaidLoader?: Promise<unknown>; mermaid?: unknown }).__docsMermaidLoader
    delete (window as typeof window & { __docsMermaidLoader?: Promise<unknown>; mermaid?: unknown }).mermaid
    document.querySelectorAll('script[data-mermaid-loader="true"]').forEach((element) => element.remove())
    jest.restoreAllMocks()
  })

  it('falls back to the Mermaid source block while the browser renderer is unavailable', () => {
    render(<MarkdownRenderer content={mermaidMarkdown} />)

    expect(screen.getByTestId('mermaid-diagram')).toBeInTheDocument()
    expect(screen.getByText(/flowchart TD/)).toBeInTheDocument()
    expect(document.querySelector('script[data-mermaid-loader="true"]')).toBeInTheDocument()
  })

  it('renders a Mermaid diagram when the browser renderer is present', async () => {
    ;(window as typeof window & { mermaid?: { initialize: jest.Mock; render: jest.Mock } }).mermaid = {
      initialize: jest.fn(),
      render: jest.fn().mockResolvedValue({
        svg: '<svg aria-label="Mermaid diagram"><text>Rendered diagram</text></svg>',
      }),
    }

    render(<MarkdownRenderer content={mermaidMarkdown} />)

    const renderedDiagram = await screen.findByTestId('mermaid-diagram')
    expect(renderedDiagram).toBeInTheDocument()
    await waitFor(() => expect(renderedDiagram.innerHTML).toContain('Rendered diagram'))
  })
})

'use client'

import { useEffect, useId, useState } from 'react'

type MermaidRenderer = {
  initialize: (config: {
    securityLevel: 'strict'
    startOnLoad: boolean
    theme: 'neutral'
  }) => void
  render: (id: string, chart: string) => Promise<{ svg: string }> | { svg: string }
}

declare global {
  interface Window {
    __docsMermaidLoader?: Promise<MermaidRenderer>
    mermaid?: MermaidRenderer
  }
}

const MERMAID_SCRIPT_SOURCE = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'

function loadMermaidRenderer(): Promise<MermaidRenderer> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Mermaid is only available in the browser.'))
  }

  if (window.mermaid) {
    return Promise.resolve(window.mermaid)
  }

  if (window.__docsMermaidLoader) {
    return window.__docsMermaidLoader
  }

  window.__docsMermaidLoader = new Promise<MermaidRenderer>((resolve, reject) => {
    const handleLoad = () => {
      if (window.mermaid) {
        resolve(window.mermaid)
        return
      }

      reject(new Error('Mermaid failed to initialize.'))
    }

    const handleError = () => reject(new Error('Could not load Mermaid.'))
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-mermaid-loader="true"]')

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true })
      existingScript.addEventListener('error', handleError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = MERMAID_SCRIPT_SOURCE
    script.async = true
    script.dataset.mermaidLoader = 'true'
    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })
    document.head.appendChild(script)
  })

  return window.__docsMermaidLoader
}

type MermaidBlockProps = {
  chart: string
}

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [svg, setSvg] = useState<string | null>(null)
  const diagramId = useId().replace(/:/g, '-')

  useEffect(() => {
    let isActive = true

    const renderDiagram = async () => {
      try {
        setErrorMessage(null)
        setSvg(null)

        const mermaid = await loadMermaidRenderer()
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'neutral',
        })

        const rendered = await mermaid.render(`docs-mermaid-${diagramId}`, chart)
        if (!isActive) {
          return
        }

        setSvg(rendered.svg)
      } catch {
        if (!isActive) {
          return
        }

        setErrorMessage('Diagram preview unavailable. Mermaid source is shown instead.')
      }
    }

    void renderDiagram()

    return () => {
      isActive = false
    }
  }, [chart, diagramId])

  return (
    <div className="rounded-[1.4rem] border border-slate-200/80 bg-white p-4" data-testid="mermaid-diagram">
      {svg ? (
        <div aria-label="Mermaid diagram" className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} role="img" />
      ) : (
        <pre className="docs-code-surface overflow-x-auto rounded-[1.1rem] p-4 text-sm text-slate-100">
          <code className="language-mermaid">{chart}</code>
        </pre>
      )}

      {errorMessage ? <p className="mt-3 text-sm text-slate-500">{errorMessage}</p> : null}
    </div>
  )
}

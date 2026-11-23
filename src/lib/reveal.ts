import { useEffect } from 'react'

/**
 * Mask reveal per line, bottom to top.
 * Every <p> is split into its rendered lines. Each line sits in an
 * overflow-hidden mask and slides up from below when it enters the viewport.
 * Elements inside [data-reveal-manual] are split but not observed —
 * their parent controls the state (used by the sticky steps section).
 */

const LINE_STAGGER = 0.08 // s between lines
const START_DELAY_MS = 1000 // wait for the preloader before revealing the first screen

function splitIntoLines(p: HTMLElement) {
  if (p.dataset.split) return
  p.dataset.split = '1'

  // 1. Wrap each word in a span, remembering which inline wrappers (e.g. coloured spans) it belongs to.
  type Token = { word: HTMLSpanElement; chain: HTMLElement[]; space: boolean }
  const tokens: Token[] = []

  const walk = (node: Node, chain: HTMLElement[]) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent || '').split(/(\s+)/)
        const frag = document.createDocumentFragment()
        parts.forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part))
            if (tokens.length) tokens[tokens.length - 1].space = true
          } else {
            const w = document.createElement('span')
            w.textContent = part
            frag.appendChild(w)
            tokens.push({ word: w, chain, space: false })
          }
        })
        child.replaceWith(frag)
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child, [...chain, child as HTMLElement])
      }
    })
  }
  walk(p, [])
  if (!tokens.length) return

  // 2. Group words by their rendered line.
  const lines: Token[][] = []
  let lastTop: number | null = null
  tokens.forEach((t) => {
    const top = Math.round(t.word.getBoundingClientRect().top)
    if (lastTop === null || Math.abs(top - lastTop) > 4) {
      lines.push([])
      lastTop = top
    }
    lines[lines.length - 1].push(t)
  })

  // 3. Rebuild: one masked block per line, keeping inline wrappers (colours etc).
  const frag = document.createDocumentFragment()
  lines.forEach((line, i) => {
    const mask = document.createElement('span')
    mask.className = 'rl'
    const inner = document.createElement('span')
    inner.className = 'ri'
    inner.style.transitionDelay = `${i * LINE_STAGGER}s`
    line.forEach((t, j) => {
      let target: HTMLElement = inner
      t.chain.forEach((wrapper) => {
        const clone = wrapper.cloneNode(false) as HTMLElement
        target.appendChild(clone)
        target = clone
      })
      target.appendChild(document.createTextNode(t.word.textContent + (t.space && j < line.length - 1 ? ' ' : '')))
    })
    mask.appendChild(inner)
    frag.appendChild(mask)
  })
  p.textContent = ''
  p.appendChild(frag)
}

export function useReveal() {
  useEffect(() => {
    let observer: IntersectionObserver | undefined
    let timer: number | undefined
    let cancelled = false

    document.fonts.ready.then(() => {
      if (cancelled) return
      const root = document.getElementById('root')!
      // [data-no-split]: React-updated text (e.g. the day schedule) keeps its own animation
      const ps = Array.from(root.querySelectorAll<HTMLElement>('p')).filter((p) => !p.closest('[data-no-split]'))
      ps.forEach(splitIntoLines)
      root.classList.add('reveal-ready')
      window.dispatchEvent(new Event('reveal:split'))

      const auto = ps.filter((p) => !p.closest('[data-reveal-manual]') || p.hasAttribute('data-reveal-auto'))
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-revealed')
              observer!.unobserve(e.target)
            }
          })
        },
        { rootMargin: '0px 0px -8% 0px' },
      )
      // Footer logo also gets observed; the CSS plays its drop-in once it is in view.
      const footerLogo = root.querySelector('[data-node-id="503:506"]')
      timer = window.setTimeout(() => {
        auto.forEach((p) => observer!.observe(p))
        if (footerLogo) observer!.observe(footerLogo)
      }, START_DELAY_MS)
    })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      observer?.disconnect()
    }
  }, [])
}

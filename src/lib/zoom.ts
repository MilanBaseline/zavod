import { useLayoutEffect } from 'react'

/**
 * Desktop is designed at 1920px. On narrower desktop screens the whole page is
 * scaled down with CSS zoom so every section looks the same as on 1920.
 * --z holds the factor; CSS that uses vh inside the zoomed page divides by it,
 * and scroll code converts between layout px (offsetHeight) and screen px
 * (getBoundingClientRect) with getZoom().
 */
export const DESIGN_WIDTH = 1920

export function getZoom() {
  const z = parseFloat(document.documentElement.style.getPropertyValue('--z'))
  return z > 0 ? z : 1
}

/**
 * Readability floor for small text when the page is scaled down.
 * A text that is S px in the design should show at least min(S, MIN_PX) px on
 * screen. If S * zoom is smaller, its font size (and px line height) is raised
 * just enough. Headlines are never touched (they stay above the floor).
 */
const MIN_PX = 14
const LABEL_MIN_PX = 8

function boostText(root: HTMLElement, z: number) {
  const els = root.querySelectorAll<HTMLElement>('p, span, a, button, li, h1, h2, h3, h4, label, small')
  els.forEach((el) => {
    // remember the design size once
    if (!el.dataset.fs) {
      el.style.fontSize = ''
      el.style.lineHeight = ''
      const cs = getComputedStyle(el)
      el.dataset.fs = cs.fontSize
      el.dataset.lh = cs.lineHeight
    }
    const s = parseFloat(el.dataset.fs!)
    if (!s) return
    // small uppercase labels (pills, column titles) only need a light floor
    const upper = getComputedStyle(el).textTransform === 'uppercase'
    const target = Math.min(s, upper ? LABEL_MIN_PX : MIN_PX)
    if (s * z >= target - 0.01) {
      el.style.fontSize = ''
      el.style.lineHeight = ''
      el.style.whiteSpace = ''
      el.style.minWidth = ''
      return
    }
    // short labels (times, numbers, column titles) sit in fixed-width boxes: keep them on one line
    if ((el.textContent || '').trim().length <= 16) {
      el.style.whiteSpace = 'nowrap'
      el.style.minWidth = 'max-content'
    }
    const k = target / z / s
    el.style.fontSize = `${(s * k).toFixed(2)}px`
    const lh = el.dataset.lh!
    if (lh.endsWith('px')) el.style.lineHeight = `${(parseFloat(lh) * k).toFixed(2)}px`
  })
}

export function useDesktopZoom(rootId: string) {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(`[data-node-id="${rootId}"]`)
    if (!root) return
    const apply = () => {
      const z = Math.min(1, document.documentElement.clientWidth / DESIGN_WIDTH)
      document.documentElement.style.setProperty('--z', String(z))
      root.style.zoom = String(z)
      boostText(root, z)
      window.dispatchEvent(new Event('scroll'))
    }
    apply()
    window.addEventListener('resize', apply)
    // text added later (day schedule rows, split lines) gets the same floor
    let pending = 0
    const mo = new MutationObserver(() => {
      if (pending) return
      pending = requestAnimationFrame(() => {
        pending = 0
        boostText(root, parseFloat(document.documentElement.style.getPropertyValue('--z')) || 1)
      })
    })
    mo.observe(root, { childList: true, subtree: true })
    return () => {
      mo.disconnect()
      cancelAnimationFrame(pending)
      window.removeEventListener('resize', apply)
      document.documentElement.style.removeProperty('--z')
      root.style.zoom = ''
    }
  }, [rootId])
}

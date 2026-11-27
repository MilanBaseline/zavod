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

export function useDesktopZoom(rootId: string) {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(`[data-node-id="${rootId}"]`)
    if (!root) return
    const apply = () => {
      const z = Math.min(1, document.documentElement.clientWidth / DESIGN_WIDTH)
      document.documentElement.style.setProperty('--z', String(z))
      root.style.zoom = String(z)
      window.dispatchEvent(new Event('scroll'))
    }
    apply()
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      document.documentElement.style.removeProperty('--z')
      root.style.zoom = ''
    }
  }, [rootId])
}

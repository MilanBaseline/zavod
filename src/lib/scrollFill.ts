import { useEffect } from 'react'

/**
 * "Svakog dana u Srbiji potrebno je oko 1.000 jedinica krvi…"
 * The heading starts fully grey and fills with dark, letter by letter (sharp edge),
 * as it scrolls up through the viewport (the design shows it mid-fill).
 */

const GREY = [0xa9, 0xa9, 0xa9]
const DARK = [0x26, 0x26, 0x26]
const START = 0.8 // fill starts when the heading top reaches 80% of the viewport height
const END = 0.2 // …and is complete when its bottom reaches 20%

export function useScrollFill(nodeId: string) {
  useEffect(() => {
    let chars: HTMLSpanElement[] = []
    let raf = 0
    let last = -1

    const wrapChars = () => {
      const el = document.querySelector<HTMLElement>(`[data-node-id="${nodeId}"]`)
      if (!el || chars.length) return
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const texts: Text[] = []
      while (walker.nextNode()) texts.push(walker.currentNode as Text)
      texts.forEach((t) => {
        const frag = document.createDocumentFragment()
        for (const ch of t.data) {
          if (/\s/.test(ch)) {
            frag.appendChild(document.createTextNode(ch))
          } else {
            const s = document.createElement('span')
            s.textContent = ch
            frag.appendChild(s)
            chars.push(s)
          }
        }
        t.replaceWith(frag)
      })
      update()
    }

    const update = () => {
      raf = 0
      const el = document.querySelector<HTMLElement>(`[data-node-id="${nodeId}"]`)
      if (!el || !chars.length) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const from = vh * START
      const to = vh * END - r.height
      const p = Math.min(1, Math.max(0, (from - r.top) / (from - to)))
      if (Math.abs(p - last) < 0.001) return
      last = p
      const filled = Math.round(p * chars.length)
      const dark = `rgb(${DARK.join(', ')})`
      const grey = `rgb(${GREY.join(', ')})`
      chars.forEach((c, i) => {
        c.style.color = i < filled ? dark : grey
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    // wait until the line-reveal has split the heading into lines
    if (document.getElementById('root')?.classList.contains('reveal-ready')) wrapChars()
    else window.addEventListener('reveal:split', wrapChars, { once: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('reveal:split', wrapChars)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      chars = []
    }
  }, [nodeId])
}

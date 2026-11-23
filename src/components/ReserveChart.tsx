import { useEffect, useRef } from 'react'
import svgRaw from './reserve-chart.svg?raw'

/**
 * "Radijalni prikaz rezervi" from the design.
 * Each red segment (current reserve level) fills outward from the inner ring
 * up to the level drawn in the design, when the chart scrolls into view.
 */

const C = 219.865 // centre of the 439.73 viewBox
const R_START = 74 // inner radius of the red segments
const R_END = 222 // outer edge of the chart (covers every level)
const DURATION = 1600
const STAGGER = 110
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export default function ReserveChart() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current!
    host.innerHTML = svgRaw
    const svg = host.querySelector('svg')!
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')

    const NS = 'http://www.w3.org/2000/svg'
    const defs = svg.querySelector('defs') || svg.appendChild(document.createElementNS(NS, 'defs'))
    const group = svg.querySelector(':scope > g')!

    // Red segments: direct children of the chart group filled with the brand red
    // (either a <path fill> or a <g> of <use fill>).
    const reds = Array.from(group.children).filter((el) => {
      const fill = (el.getAttribute('fill') || el.querySelector('[fill]')?.getAttribute('fill') || '').toUpperCase()
      return fill === '#D32027'
    })

    const circles = reds.map((el, i) => {
      const mask = document.createElementNS(NS, 'mask')
      const id = `reserve-fill-${i}`
      mask.setAttribute('id', id)
      mask.setAttribute('maskUnits', 'userSpaceOnUse')
      const circle = document.createElementNS(NS, 'circle')
      circle.setAttribute('cx', String(C))
      circle.setAttribute('cy', String(C))
      circle.setAttribute('r', String(R_START))
      circle.setAttribute('fill', 'white')
      mask.appendChild(circle)
      defs.appendChild(mask)
      el.setAttribute('mask', `url(#${id})`)
      return circle
    })

    let raf = 0
    const play = () => {
      const t0 = performance.now()
      const tick = (now: number) => {
        let done = true
        circles.forEach((c, i) => {
          const t = Math.min(1, Math.max(0, (now - t0 - i * STAGGER) / DURATION))
          if (t < 1) done = false
          c.setAttribute('r', String(R_START + (R_END - R_START) * easeOutCubic(t)))
        })
        if (!done) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          play()
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(host)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      host.innerHTML = ''
    }
  }, [])

  return <div ref={ref} className="absolute inset-0 block" />
}

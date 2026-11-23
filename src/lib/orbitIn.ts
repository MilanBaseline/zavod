import { useEffect } from 'react'

/**
 * Used by "Krv je potrebna svakog dana." and "Crveni krst" — the photos and red rectangles load in
 * clockwise, starting at 12 o'clock and going right. Each one fades in while
 * gliding a short way along a circle around the heading into its design spot.
 */

const SWEEP_DEG = 14 // how far along the circle each item travels
const DURATION = 1400
const STAGGER = 90
const STEPS = 12 // keyframes used to trace the arc

export function useOrbitIn(sectionId: string, itemSelector = '[data-orbit-frame] > [data-node-id]') {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(`[data-node-id="${sectionId}"]`)
    if (!section) return
    const items = Array.from(section.querySelectorAll<HTMLElement>(itemSelector))
    if (!items.length) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    items.forEach((el) => (el.style.opacity = reduced ? '1' : '0'))
    if (reduced) return

    const animations: Animation[] = []

    const play = () => {
      const s = section.getBoundingClientRect()
      const cx = s.left + s.width / 2
      const cy = s.top + s.height / 2

      const placed = items.map((el) => {
        const r = el.getBoundingClientRect()
        const x = r.left + r.width / 2 - cx
        const y = r.top + r.height / 2 - cy
        // clockwise angle from 12 o'clock, 0..360
        const angle = ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360
        return { el, x, y, angle }
      })
      placed.sort((a, b) => a.angle - b.angle)

      placed.forEach(({ el, x, y }, i) => {
        const frames: Keyframe[] = []
        for (let k = 0; k <= STEPS; k++) {
          const t = k / STEPS
          const a = (-SWEEP_DEG * (1 - t) * Math.PI) / 180 // from -sweep to 0 → moves clockwise
          const nx = x * Math.cos(a) - y * Math.sin(a)
          const ny = x * Math.sin(a) + y * Math.cos(a)
          frames.push({
            transform: `translate(${(nx - x).toFixed(2)}px, ${(ny - y).toFixed(2)}px) scale(${0.92 + 0.08 * t})`,
            opacity: Math.min(1, t * 1.8),
            offset: t,
          })
        }
        const anim = el.animate(frames, {
          duration: DURATION,
          delay: i * STAGGER,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        })
        animations.push(anim)
      })
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          play()
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(section)

    return () => {
      io.disconnect()
      animations.forEach((a) => a.cancel())
      items.forEach((el) => (el.style.opacity = ''))
    }
  }, [sectionId, itemSelector])
}

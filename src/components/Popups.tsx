import { useEffect, useRef } from 'react'

/**
 * "Svakih minut i po, nekome je potrebna krv." section.
 * Photos from the design file and small red rectangles pop in softly at
 * random free spots around the text, stay for a moment, then fade out and
 * reappear somewhere else.
 */

// Photos used in the design's photo collages (no stock/couple layers).
const PHOTOS = [10, 12, 13, 17, 18, 19, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 35, 36, 754, 755].map(
  (n) => `./assets/imgRectangle${n}.jpg`,
)

const RED = '#d32027'
const RECT_CHANCE = 0.12
const RECT_COOLDOWN = 9000 // ms with no red rectangle after one leaves
const RATIO = 1.565 // width / height of every tile in the design
const SLOTS = 7
const GAP = 28 // min distance between tiles / text
const EDGE = 24 // keep away from the section edges

type Box = { x: number; y: number; w: number; h: number }
const rand = (a: number, b: number) => a + Math.random() * (b - a)
const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.w + GAP && a.x + a.w + GAP > b.x && a.y < b.y + b.h + GAP && a.y + a.h + GAP > b.y

export default function Popups() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const wrap = wrapRef.current!
    const section = wrap.parentElement!
    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[]
    const boxes: (Box | null)[] = tiles.map(() => null)
    const rectSlots = new Set<number>() // slots currently showing a red rectangle
    let rectAllowedAt = 0
    const timers: number[] = []
    let running = false
    let lastPhoto = -1

    const textBox = (): Box => {
      const s = section.getBoundingClientRect()
      const ps = Array.from(section.querySelectorAll('p'))
      const r = ps.reduce(
        (acc, p) => {
          const b = p.getBoundingClientRect()
          return {
            l: Math.min(acc.l, b.left),
            t: Math.min(acc.t, b.top),
            r: Math.max(acc.r, b.right),
            b: Math.max(acc.b, b.bottom),
          }
        },
        { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity },
      )
      return { x: r.l - s.left, y: r.t - s.top, w: r.r - r.l, h: r.b - r.t }
    }

    const findSpot = (i: number, w: number, h: number): Box | null => {
      const W = section.clientWidth
      const H = section.clientHeight
      const blocked = [textBox(), ...boxes.filter((b, j) => b && j !== i)] as Box[]
      for (let k = 0; k < 60; k++) {
        const box = { x: rand(EDGE, W - w - EDGE), y: rand(EDGE, H - h - EDGE), w, h }
        if (!blocked.some((b) => overlaps(box, b))) return box
      }
      return null
    }

    const show = (i: number) => {
      if (!running) return
      const el = tiles[i]
      // Red rectangles are rare: at most one on screen, and only occasionally.
      const isRect = rectSlots.size === 0 && Date.now() >= rectAllowedAt && Math.random() < RECT_CHANCE
      const w = isRect ? rand(37, 82) : rand(99, 175)
      const h = w / RATIO
      const box = findSpot(i, w, h)
      if (!box) {
        timers.push(window.setTimeout(() => show(i), 600))
        return
      }
      boxes[i] = box
      if (isRect) rectSlots.add(i)

      if (isRect) {
        el.style.backgroundImage = 'none'
        el.style.backgroundColor = RED
      } else {
        let n = Math.floor(Math.random() * PHOTOS.length)
        if (n === lastPhoto) n = (n + 1) % PHOTOS.length
        lastPhoto = n
        el.style.backgroundColor = '#eee'
        el.style.backgroundImage = `url(${PHOTOS[n]})`
      }
      Object.assign(el.style, {
        left: `${box.x}px`,
        top: `${box.y}px`,
        width: `${box.w}px`,
        height: `${box.h}px`,
      })
      el.classList.remove('is-in', 'is-out')
      void el.offsetWidth // restart transition
      el.classList.add('is-in')

      const hold = rand(2600, 4400)
      timers.push(
        window.setTimeout(() => {
          el.classList.remove('is-in')
          el.classList.add('is-out')
          timers.push(
            window.setTimeout(() => {
              boxes[i] = null
              if (rectSlots.delete(i)) rectAllowedAt = Date.now() + RECT_COOLDOWN
              timers.push(window.setTimeout(() => show(i), rand(200, 1400)))
            }, 1000),
          )
        }, 1100 + hold),
      )
    }

    const start = () => {
      if (running) return
      running = true
      tiles.forEach((_, i) => timers.push(window.setTimeout(() => show(i), i * 450 + rand(0, 300))))
    }
    const stop = () => {
      running = false
      timers.forEach(clearTimeout)
      timers.length = 0
      boxes.fill(null)
      rectSlots.clear()
      tiles.forEach((el) => el.classList.remove('is-in', 'is-out'))
    }

    // preload photos
    PHOTOS.forEach((src) => (new Image().src = src))

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.15 })
    io.observe(section)
    return () => {
      io.disconnect()
      stop()
    }
  }, [])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: SLOTS }).map((_, i) => (
        <div key={i} ref={(el) => (tileRefs.current[i] = el)} className="popup-tile" />
      ))}
    </div>
  )
}

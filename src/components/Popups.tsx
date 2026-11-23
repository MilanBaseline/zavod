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
      // measure the rendered text lines, not the paragraph boxes (the heading box spans the full width)
      const r = { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity }
      ps.forEach((p) => {
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT)
        const rects: DOMRect[] = []
        while (walker.nextNode()) {
          const range = document.createRange()
          range.selectNodeContents(walker.currentNode)
          rects.push(...Array.from(range.getClientRects()))
        }
        rects.forEach((b) => {
          if (!b.width) return
          r.l = Math.min(r.l, b.left)
          r.t = Math.min(r.t, b.top)
          r.r = Math.max(r.r, b.right)
          r.b = Math.max(r.b, b.bottom)
        })
      })
      return { x: r.l - s.left, y: r.t - s.top, w: r.r - r.l, h: r.b - r.t }
    }

    // The free space around the text is split into 8 areas (corners, top, bottom, sides).
    // Each new tile goes to the area with the fewest tiles, so they stay spread around the text.
    const zoneOf: (number | null)[] = tiles.map(() => null)
    const zones = (): Box[] => {
      const W = section.clientWidth
      const H = section.clientHeight
      const t = textBox()
      const x0 = EDGE, x3 = W - EDGE
      const x1 = t.x - GAP, x2 = t.x + t.w + GAP
      const y0 = EDGE, y3 = H - EDGE
      const y1 = t.y - GAP, y2 = t.y + t.h + GAP
      const mid1 = t.x + t.w / 3, mid2 = t.x + (2 * t.w) / 3
      return [
        { x: x0, y: y0, w: mid1 - x0, h: y1 - y0 }, // top-left
        { x: mid1, y: y0, w: mid2 - mid1, h: y1 - y0 }, // top
        { x: mid2, y: y0, w: x3 - mid2, h: y1 - y0 }, // top-right
        { x: x2, y: y1, w: x3 - x2, h: y2 - y1 }, // right
        { x: mid2, y: y2, w: x3 - mid2, h: y3 - y2 }, // bottom-right
        { x: mid1, y: y2, w: mid2 - mid1, h: y3 - y2 }, // bottom
        { x: x0, y: y2, w: mid1 - x0, h: y3 - y2 }, // bottom-left
        { x: x0, y: y1, w: x1 - x0, h: y2 - y1 }, // left
      ]
    }

    const findSpot = (i: number, w: number, h: number): { box: Box; zone: number } | null => {
      const blocked = [textBox(), ...boxes.filter((b, j) => b && j !== i)] as Box[]
      const zs = zones()
      const counts = zs.map((_, z) => zoneOf.filter((v, j) => v === z && j !== i).length)
      const band = (z: number) => (z <= 2 ? 0 : z === 3 || z === 7 ? 1 : 2) // top, sides, bottom
      const bandCounts = [0, 1, 2].map((bnd) => counts.reduce((n, c, z) => (band(z) === bnd ? n + c : n), 0))
      const bandSize = [3, 2, 3]
      // emptiest band first (relative to its number of areas), then emptiest area, random among equals
      const order = zs
        .map((_, z) => z)
        .filter((z) => zs[z].w >= w && zs[z].h >= h)
        .sort(
          (a, b) =>
            bandCounts[band(a)] / bandSize[band(a)] - bandCounts[band(b)] / bandSize[band(b)] ||
            counts[a] - counts[b] ||
            Math.random() - 0.5,
        )
      for (const z of order) {
        const zb = zs[z]
        for (let k = 0; k < 25; k++) {
          const box = { x: rand(zb.x, zb.x + zb.w - w), y: rand(zb.y, zb.y + zb.h - h), w, h }
          if (!blocked.some((b) => overlaps(box, b))) return { box, zone: z }
        }
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
      const spot = findSpot(i, w, h)
      if (!spot) {
        timers.push(window.setTimeout(() => show(i), 600))
        return
      }
      const box = spot.box
      boxes[i] = box
      zoneOf[i] = spot.zone
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
              zoneOf[i] = null
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
      zoneOf.fill(null)
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

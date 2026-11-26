import { useEffect, useRef } from 'react'
import PulseHeart from './PulseHeart'

/**
 * Hero "Tihi heroj" card (Figma 503:825), used on the combined-video version.
 * The hero video shows a different person every 5 seconds; the message swaps
 * with them, using the same line-mask reveal as the rest of the site.
 *
 * People, donation counts and order come from the v2 site; the order matches
 * the clips in the combined video.
 */

const PEOPLE = [
  { name: 'Jelena', count: 8, text: 'Danas prati nove davaoce na njihovo prvo davanje krvi.' },
  { name: 'Stefan', count: 9, text: 'Sa kolegama je organizovao zajednički odlazak na davanje krvi.' },
  { name: 'Marija', count: 7, text: 'Posle svog prvog davanja ohrabrila je koleginicu da pođe s njom.' },
  { name: 'Nikola', count: 14, text: 'Na sledeću akciju poveo je prijatelja koji se dugo premišljao.' },
  { name: 'Milica', count: 20, text: 'Na akciju u svom kraju dovela je još troje davalaca.' },
]
const CLIP_SECONDS = 5

export const HERO_PEOPLE_ENABLED = import.meta.env.VITE_HERO_PEOPLE === '1'

export default function HeroPeople({ mobile = false }: { mobile?: boolean }) {
  const msgRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let current = -1
    let video: HTMLVideoElement | null = null
    let raf = 0

    const setActive = (next: number) => {
      if (next === current) return
      const els = msgRefs.current
      const incoming = els[next]
      // the incoming message must start below (not above) so it always rises into place
      if (incoming && incoming.dataset.state === 'past') {
        incoming.classList.add('no-anim')
        incoming.dataset.state = 'next'
        void incoming.offsetWidth
        incoming.classList.remove('no-anim')
      }
      els.forEach((el, i) => {
        if (!el) return
        if (i === next) el.dataset.state = 'active'
        else if (i === current) el.dataset.state = 'past'
        else if (el.dataset.state !== 'past') el.dataset.state = 'next'
      })
      current = next
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!video) video = document.querySelector<HTMLVideoElement>('.hero-video')
      if (!video) return
      const i = Math.floor(video.currentTime / CLIP_SECONDS) % PEOPLE.length
      setActive(i)
    }
    // start after the hero text has had its reveal
    const t = window.setTimeout(() => (raf = requestAnimationFrame(tick)), 1200)
    return () => {
      window.clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      data-reveal-manual
      className={`content-stretch flex flex-col gap-[20px] items-start relative rounded-[16px] shrink-0 ${mobile ? 'w-full pt-[4px]' : 'p-[32px] w-[320px]'}`}
      data-node-id="503:825"
    >
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[14px] relative w-[16.333px]">
            <div className="absolute inset-[-41.67%_-35.71%]">
              <PulseHeart variant="large" />
            </div>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col font-['Host_Grotesk_Variable'] font-normal gap-[14px] items-start relative shrink-0 text-white w-full">
        <div className="flex flex-col justify-end leading-[0] relative shrink-0 text-[8px] text-center tracking-[3px] uppercase whitespace-nowrap">
          <p className="leading-[1.3] text-balance" data-reveal-auto>
            Tihi Heroj
          </p>
        </div>
        <div className="grid w-full">
          {PEOPLE.map((p, i) => (
            <div key={p.name} ref={(el) => (msgRefs.current[i] = el)} data-state="next" className="step col-1 row-1 self-end flex flex-col gap-[10px]">
              <p className={`[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] leading-[1.3] relative text-balance tracking-[-0.288px] w-full ${mobile ? 'text-[18px]' : 'text-[20px]'}`}>
                {p.name} · {p.count} davanja krvi
              </p>
              <p className={`font-['DM_Sans_Variable'] leading-[1.4] opacity-80 relative text-balance w-full ${mobile ? 'text-[14px]' : 'text-[14px]'}`}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

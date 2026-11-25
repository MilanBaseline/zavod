import { useEffect, useRef } from 'react'

/**
 * "Tvoja krv nastavlja put." — sticky scroll section with 5 steps.
 * The row stays pinned while the page scrolls through it. Photos in the
 * centre move up with the scroll; step texts alternate left (01, 03, 05) and
 * right (02, 04). Only the active step is visible; the previous one leaves
 * completely (text slides up and out), the next one slides in on its side.
 *
 * Copy and photos for all 5 steps come from the Figma "Section 1" frame (541:123).
 */

type Step = {
  num: string
  title: string
  text: string
  image: string
  position: string
  /** explicit crop (size/offset of the photo inside the frame), used where the design zooms in */
  crop?: { width: string; height: string; left: string; top: string }
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Davanje krvi',
    text: 'Sve počinje tvojim dolaskom. Posle upitnika i lekarskog pregleda sledi davanje krvi uz podršku našeg tima.',
    image: './assets/step1.jpg',
    position: '35% 50%',
    // design crop: close-up of the arm with the red ball (Figma 540:357), fitted to the portrait frame
    crop: { width: '414%', height: '175.4%', left: '-47.6%', top: '-75.4%' },
  },
  {
    num: '02',
    title: 'Priprema komponenti',
    text: 'Krv razdvajamo na komponente, kako bi pacijenti dobili deo krvi koji im je potreban.',
    image: './assets/step2.jpg',
    position: '55% 50%',
  },
  {
    num: '03',
    title: 'Testiranje i kontrola kvaliteta',
    text: 'Laboratorijskim analizama proveravamo krv i ispunjenost zahteva za bezbednost i kvalitet.',
    image: './assets/step3.jpg',
    position: '50% 50%',
  },
  {
    num: '04',
    title: 'Završna provera i obeležavanje',
    text: 'Proveravamo rezultate i obeležavamo komponente tako da njihov put može da se prati.',
    image: './assets/step4.jpg',
    position: '50% 50%',
  },
  {
    num: '05',
    title: 'Čuvanje i dostavljanje',
    text: 'Komponente čuvamo u odgovarajućim uslovima i dostavljamo zdravstvenim ustanovama prema potrebama pacijenata.',
    image: './assets/step5.jpg',
    position: '45% 50%',
  },
]

const ROW_H = 940 // design height of the steps row
const IMG_H = 766 // design height of the photo frame
const IMG_GAP = 8
const SCROLL_PER_STEP = '70vh'

function StepText({ step }: { step: Step }) {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[24px] items-start justify-center px-[16px] py-[64px] relative text-balance w-full">
      <div className="content-stretch flex flex-col font-['Archivo_Variable'] font-light gap-[20px] items-start justify-end relative shrink-0 text-[48px] tracking-[-0.72px] w-full">
        <p className="leading-[45px] relative shrink-0 text-[#ed9912] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
          {step.num}
        </p>
        <p
          className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] leading-[1.2] min-w-full relative shrink-0 text-[#483434] w-[min-content]"
          style={{ fontVariationSettings: '"wdth" 100' }}
        >
          {step.title}
        </p>
      </div>
      <p
        className="font-['DM_Sans_Variable'] font-normal leading-[22.5px] opacity-70 relative shrink-0 text-[#483434] text-[16px] tracking-[-0.09px] w-full"
        style={{ fontVariationSettings: '"opsz" 14' }}
      >
        {step.text}
      </p>
    </div>
  )
}

export default function StepsScroll() {
  const outerRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const outer = outerRef.current!
    const stack = stackRef.current!
    let active = -1
    let raf = 0

    const update = () => {
      raf = 0
      const rect = outer.getBoundingClientRect()
      const stickyTop = window.innerHeight / 2 - ROW_H / 2
      const distance = outer.offsetHeight - ROW_H
      const p = Math.min(1, Math.max(0, (stickyTop - rect.top) / distance))
      const s = p * (STEPS.length - 1)

      stack.style.transform = `translate3d(0, ${-s * (IMG_H + IMG_GAP)}px, 0)`

      const a = Math.round(s)
      if (a === active) return
      active = a
      stepRefs.current.forEach((el, i) => {
        if (!el) return
        el.dataset.state = i === a ? 'active' : i < a ? 'past' : 'next'
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const side = (parity: 0 | 1) =>
    STEPS.map((step, i) =>
      i % 2 === parity ? (
        <div key={i} ref={(el) => (stepRefs.current[i] = el)} className="step col-1 row-1 self-center" data-state="next">
          <StepText step={step} />
        </div>
      ) : null,
    )

  return (
    <div
      ref={outerRef}
      data-reveal-manual
      className="relative shrink-0 w-full"
      style={{ height: `calc(${ROW_H}px + ${STEPS.length - 1} * ${SCROLL_PER_STEP})` }}
    >
      <div className="sticky w-full" style={{ top: `calc(50vh - ${ROW_H / 2}px)` }}>
        <div className="content-stretch flex gap-[32px] h-[940px] items-center py-[126px] relative w-full" data-node-id="503:253">
          <div className="grid shrink-0 w-[360.52px]">{side(0)}</div>

          <div className="flex-[1_0_0] h-[766px] min-w-px overflow-clip relative rounded-[22px]">
            <div ref={stackRef} className="flex flex-col gap-[8px] will-change-transform">
              {STEPS.map((step, i) => (
                <div key={i} className="h-[766px] relative rounded-[22px] shrink-0 w-full overflow-hidden bg-[#d9d9d9]">
                  {step.crop ? (
                    <img alt="" className="absolute max-w-none" src={step.image} style={step.crop} />
                  ) : (
                    <img alt="" className="absolute max-w-none object-cover rounded-[22px] size-full" src={step.image} style={{ objectPosition: step.position }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid shrink-0 w-[360.52px]">{side(1)}</div>

          <div className="-translate-x-1/2 absolute border border-[rgba(226,226,226,0.3)] border-solid content-stretch flex gap-[10px] h-[26px] items-center justify-center left-[calc(50%-0.5px)] pl-[10px] pr-[16px] py-[2px] rounded-[39px] top-[35px]">
            <div className="relative shrink-0 size-[2px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="./assets/imgEllipse46.svg" />
            </div>
            <p
              className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[22.5px] opacity-60 relative shrink-0 text-[10px] text-balance text-black tracking-[3px] uppercase whitespace-nowrap"
              data-reveal-auto
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Put Krvi
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mobile 390 (Figma 351:1139): the photo sits on top and the step text below it.
 * The block stays pinned while the page scrolls; photos move up through the
 * frame and the step text swaps with the same line mask as on desktop.
 */
const M_IMG_H = 'clamp(260px, calc(100svh - 380px), 610px)'

export function StepsScrollMobile() {
  const outerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const outer = outerRef.current!
    const stack = stackRef.current!
    const frame = frameRef.current!
    const sticky = stickyRef.current!
    let active = -1
    let raf = 0

    const update = () => {
      raf = 0
      const rect = outer.getBoundingClientRect()
      const h = sticky.offsetHeight
      const stickyTop = Math.max(0, (window.innerHeight - h) / 2)
      sticky.style.top = `${stickyTop}px`
      const distance = outer.offsetHeight - h
      const p = Math.min(1, Math.max(0, (stickyTop - rect.top) / distance))
      const s = p * (STEPS.length - 1)
      stack.style.transform = `translate3d(0, ${-s * (frame.offsetHeight + 6)}px, 0)`
      const a = Math.round(s)
      if (a === active) return
      active = a
      stepRefs.current.forEach((el, i) => {
        if (!el) return
        el.dataset.state = i === a ? 'active' : i < a ? 'past' : 'next'
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={outerRef} data-reveal-manual className="relative shrink-0 w-full" style={{ height: `calc(${M_IMG_H} + 330px + ${STEPS.length - 1} * ${SCROLL_PER_STEP})` }}>
      <div ref={stickyRef} className="sticky content-stretch flex flex-col gap-[48px] items-center w-full">
        <div ref={frameRef} className="overflow-clip relative rounded-[14px] shrink-0 w-[310px] max-w-full" style={{ height: M_IMG_H }}>
          <div ref={stackRef} className="flex flex-col gap-[6px] will-change-transform h-full">
            {STEPS.map((step, i) => (
              <div key={i} className="h-full relative rounded-[14px] shrink-0 w-full overflow-hidden bg-[#d9d9d9]">
                <img alt="" className="absolute max-w-none object-cover size-full" src={step.image} style={{ objectPosition: step.position }} />
              </div>
            ))}
          </div>
        </div>
        <div className="grid w-full">
          {STEPS.map((step, i) => (
            <div key={i} ref={(el) => (stepRefs.current[i] = el)} className="step col-1 row-1" data-state="next">
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-start px-[16px] py-[20px] relative text-balance w-full">
                <div className="content-stretch flex flex-col font-['Archivo_Variable'] font-light gap-[20px] items-start leading-[1.2] relative shrink-0 text-[32px] tracking-[-0.72px] w-full">
                  <p className="relative shrink-0 text-[#ed9912] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
                    {step.num}
                  </p>
                  <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] relative shrink-0 text-[#483434] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
                    {step.title}
                  </p>
                </div>
                <p className="font-['DM_Sans_Variable'] font-normal leading-[1.45] opacity-70 relative shrink-0 text-[#483434] text-[16px] tracking-[-0.09px] w-full">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

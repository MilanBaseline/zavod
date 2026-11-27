import { useEffect, useRef } from 'react'
import { getZoom } from '../lib/zoom'

/**
 * "Crveni krst" section — two states from the Figma "Section 2" frame (544:151).
 * The section pins while the page scrolls past it. Scrolling past the halfway
 * point switches to state 2; scrolling back switches to state 1. The scroll
 * only triggers the switch — the transition itself plays on its own timing.
 *
 * State 1: "Lokalni Crveni krst je kontakt…" with the CPR photo left,
 *          volunteers top-right and the MIT tent bottom-right.
 * State 2: red cross + "Podrška je i u tvom mestu." Each photo swaps in place:
 *          the state 1 photo masks out upward and reveals the state 2 photo.
 *
 * Vertical positions are proportions of the 1080px design frame.
 */

const TOP = '26.944%' // 291 / 1080
const MID = '44.167%' // 477 / 1080
const LOW = '71.111%' // 768 / 1080
const BOT = '28.889%' // 312 / 1080

export default function CrveniKrst({ mobile = false }: { mobile?: boolean }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current!
    const stage = stageRef.current!
    let raf = 0
    let current = ''

    const update = () => {
      raf = 0
      const r = outer.getBoundingClientRect()
      const vh = window.innerHeight
      const distance = outer.offsetHeight * getZoom() - vh
      const p = Math.min(1, Math.max(0, -r.top / distance))
      // before the section is mostly on screen its first state is not revealed yet
      const next = r.top > vh * 0.35 ? 'idle' : p < 0.5 ? 'one' : 'two'
      if (next === current) return
      current = next
      stage.dataset.state = next
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

  if (mobile) {
    // Mobile: same two states and photo swaps, stacked for a narrow screen
    return (
      <div ref={outerRef} data-reveal-manual className="relative shrink-0 w-full" style={{ height: '200vh' }}>
        <div ref={stageRef} data-state="idle" className="ck-stage sticky top-0 h-[100svh] w-full overflow-hidden bg-[#480c0c]">
          {/* photo slots: each swaps in place — the state 1 photo masks out upward, revealing the state 2 photo */}
          <div className="absolute left-[20px] top-0 w-[134px] h-[86px] overflow-hidden">
            <img alt="" className="absolute inset-0 size-full object-cover" src="./assets/ck_cpr_group.jpg" />
            <img alt="" className="ck-out absolute inset-0 size-full object-cover" src="./assets/ck_cpr_boy.jpg" />
          </div>
          <div className="absolute right-0 top-[12%] w-[120px] h-[76px] overflow-hidden">
            <img alt="" className="absolute inset-0 size-full object-cover" src="./assets/ck_mit.jpg" />
            <img alt="" className="ck-out ck-out-2 absolute inset-0 size-full object-cover" src="./assets/ck_volunteers.jpg" />
          </div>
          <div className="absolute right-0 bottom-[6%] w-[120px] h-[76px] overflow-hidden">
            <img alt="" className="absolute inset-0 size-full object-cover" src="./assets/ck_tent.jpg" />
            <img alt="" className="ck-out ck-out-3 absolute inset-0 size-full object-cover" src="./assets/ck_mit.jpg" />
          </div>

          {/* state 1 text */}
          <div className="ck-one -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Archivo_Variable'] font-normal gap-[24px] items-center left-[32px] right-[32px] text-center text-white top-1/2">
            <p className="leading-[1.2] text-[28px] tracking-[-0.72px] text-balance" style={{ fontVariationSettings: '"wdth" 100' }}>
              Lokalni <span className="text-[#ee1c25]">Crveni krst</span> je kontakt za pojedince, kompanije i organizacije koji žele da se uključe.
            </p>
            <p className="leading-[1.3] opacity-60 text-[16px] tracking-[1px] text-balance" style={{ fontVariationSettings: '"wdth" 100' }}>
              Pomaže u organizovanju akcija i povezuje davaoce sa informacijama i aktivnostima u njihovoj sredini.
            </p>
          </div>

          {/* state 2: red cross + text */}
          <div className="ck-two -translate-y-1/2 absolute flex flex-col gap-[28px] items-center left-[32px] right-[32px] top-1/2 text-center">
            <div className="flex flex-col gap-[10px] items-center relative shrink-0 w-[96px]">
              <img alt="" className="ck-cross block size-[96px]" src="./assets/ck_cross.png" />
              <img alt="1876" className="ck-year block h-[11px] w-[32px]" src="./assets/ck_1876.svg" />
            </div>
            <div className="[word-break:break-word] flex flex-col font-normal gap-[16px] items-center relative shrink-0 text-balance text-white w-full">
              <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['DM_Sans_Variable'] leading-[1.3] text-[30px]">
                <span className="text-[#ee1c25]">Podrška</span> je i u tvom mestu.
              </p>
              <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Archivo_Variable'] leading-[1.3] opacity-60 text-[18px] tracking-[1px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                Crveni Krst Srbije
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={outerRef} data-reveal-manual className="relative shrink-0 w-full" style={{ height: 'calc(200vh / var(--z, 1))' }}>
      <div ref={stageRef} data-state="idle" className="ck-stage sticky top-0 h-[calc(100vh/var(--z,1))] w-full overflow-hidden bg-[#480c0c]">
        {/* grid lines */}
        <div className="absolute inset-y-0 left-[280px] w-px bg-[rgba(195,195,195,0.3)]" />
        <div className="absolute inset-y-0 right-[280px] w-px bg-[rgba(195,195,195,0.3)]" />
        <div className="absolute inset-x-0 h-px bg-[rgba(195,195,195,0.3)]" style={{ top: TOP }} />
        <div className="absolute inset-x-0 h-px bg-[rgba(195,195,195,0.3)]" style={{ top: LOW }} />

        {/* photo slots: each swaps in place — the state 1 photo masks out upward, revealing the state 2 photo */}
        <div className="absolute left-0 w-[280px] overflow-hidden" style={{ top: TOP, height: MID }}>
          <img alt="" className="absolute inset-0 size-full object-cover" src="./assets/ck_cpr_group.jpg" />
          <img alt="" className="ck-out absolute inset-0 size-full object-cover" src="./assets/ck_cpr_boy.jpg" />
        </div>
        <div className="absolute right-0 top-0 w-[280px] overflow-hidden" style={{ height: TOP }}>
          <img alt="" className="absolute inset-0 size-full object-cover" src="./assets/ck_mit.jpg" />
          <img alt="" className="ck-out ck-out-2 absolute inset-0 size-full object-cover" src="./assets/ck_volunteers.jpg" />
        </div>
        <div className="absolute right-0 w-[280px] overflow-hidden" style={{ top: LOW, height: BOT }}>
          <img alt="" className="absolute inset-0 size-full object-cover" src="./assets/ck_tent.jpg" />
          <img alt="" className="ck-out ck-out-3 absolute inset-0 size-full object-cover" src="./assets/ck_mit.jpg" />
        </div>

        {/* state 1 text */}
        <div className="ck-one -translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Archivo_Variable'] font-normal gap-[48px] items-start left-1/2 pb-[16px] text-center text-white top-[calc(50%+0.5px)] w-[1134px]">
          <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] flex flex-col relative shrink-0 tracking-[-0.72px] w-full" style={{ fontVariationSettings: '"wdth" 100' }}>
            <p className="leading-[1.2] text-[56px] text-balance">
              Lokalni <span className="text-[#ee1c25]">Crveni krst</span> je
            </p>
            <p className="leading-[1.2] text-[56px] text-balance">kontakt za pojedince, kompanije i organizacije koji žele da se uključe.</p>
          </div>
          <p
            className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] leading-[1.3] opacity-60 relative shrink-0 text-[20px] text-balance tracking-[1px] w-full"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            Pomaže u organizovanju akcija i povezuje davaoce sa informacijama i aktivnostima u njihovoj sredini.
          </p>
        </div>

        {/* state 2: red cross + text */}
        <div className="ck-two -translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-between left-[calc(50%+0.27px)] top-[calc(50%+0.17px)] w-[698.896px]">
          <div className="flex flex-col gap-[18px] items-center relative shrink-0 w-[186.896px]">
            {/* "1877" is invisible in the design; kept as a spacer so the cross sits where it is designed */}
            <div className="h-[21.726px] w-[63.029px]" />
            <img alt="" className="ck-cross block h-[186.896px] w-full" src="./assets/ck_cross.png" />
            <img alt="1876" className="ck-year block h-[21.726px] w-[63.029px]" src="./assets/ck_1876.svg" />
          </div>
          <div className="[word-break:break-word] flex flex-col font-normal gap-[16px] items-start relative shrink-0 text-balance text-white w-[432px]">
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['DM_Sans_Variable'] leading-[1.5] text-[36px] whitespace-nowrap">
              <span className="text-[#ee1c25]">Podrška</span> je i u tvom mestu.
            </p>
            <p
              className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Archivo_Variable'] leading-[1.3] opacity-60 text-[20px] tracking-[1px]"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              Crveni Krst Srbije
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

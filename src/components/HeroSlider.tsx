import { useEffect, useRef } from 'react'

/**
 * "Iza svakog davanja su ljudi." — Tihi heroji slider.
 * Arrows switch hero: the name and story change with the same line mask
 * animation as the rest of the site, the photo wipes in from the bottom.
 *
 * Slide 1 (Neda Petrović) is from the design. Slides 2–3 are PLACEHOLDERS:
 * their names and stories are not in the Figma file yet, the photos are
 * donor photos from the file.
 */

type Hero = {
  name: string
  text: string
  image: string
  /** exact crop from the design for Neda; others use object-cover */
  imgClass: string
}

const HEROES: Hero[] = [
  {
    name: 'Neda Petrović',
    text: 'Tihi heroji su ljudi poput tebe. Ljudi koji izdvoje vreme da pomognu nekome koga možda nikada neće upoznati. Ovde njihove priče susreću priče ljudi kojima krv pomaže.',
    image: './assets/imgImageWomanInABeigeShirtHoldingAWickerBasketInsideAGreenhouseWithPlants2.jpg',
    imgClass: 'absolute h-[156.33%] left-[-81.3%] max-w-none top-[-19.55%] w-[327%]',
  },
  // PLACEHOLDER — name and story not in the design yet
  {
    name: 'Ime Prezime',
    text: 'Ovde ide kratka priča drugog tihog heroja: ko je, koliko dugo daje krv i zašto.',
    image: './assets/imgRectangle36.jpg',
    imgClass: 'absolute inset-0 size-full max-w-none object-cover object-[40%_50%]',
  },
  // PLACEHOLDER — name and story not in the design yet
  {
    name: 'Ime Prezime',
    text: 'Ovde ide kratka priča trećeg tihog heroja: ko je, koliko dugo daje krv i zašto.',
    image: './assets/imgRectangle32.jpg',
    imgClass: 'absolute inset-0 size-full max-w-none object-cover object-[30%_50%]',
  },
]

const IMG_IN = 900

export default function HeroSlider() {
  const rootRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs = useRef<(HTMLDivElement | null)[]>([])
  const indexRef = useRef(0)
  const startedRef = useRef(false)

  const show = (next: number, animateImage: boolean) => {
    const prev = indexRef.current
    indexRef.current = next
    textRefs.current.forEach((el, i) => {
      if (el) el.dataset.state = i === next ? 'active' : i < next ? 'past' : 'next'
    })
    imgRefs.current.forEach((el, i) => {
      if (!el) return
      el.style.zIndex = i === next ? '2' : i === prev ? '1' : '0'
      el.style.visibility = i === next || i === prev ? 'visible' : 'hidden'
    })
    const img = imgRefs.current[next]
    if (img && animateImage && prev !== next) {
      img.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
        duration: IMG_IN,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      })
    }
  }

  const go = (dir: 1 | -1) => {
    if (!startedRef.current) return
    const n = (indexRef.current + dir + HEROES.length) % HEROES.length
    show(n, true)
  }

  useEffect(() => {
    // first slide: only the photo is shown until the section is in view, then its text reveals
    imgRefs.current.forEach((el, i) => {
      if (el) el.style.visibility = i === 0 ? 'visible' : 'hidden'
    })
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          startedRef.current = true
          show(0, false)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(rootRef.current!)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      data-reveal-manual
      className="content-stretch flex flex-col gap-[44px] items-center justify-center p-[32px] relative self-stretch shrink-0 w-[755px]"
      data-node-id="503:279"
      data-name="Container"
    >
      <div className="content-stretch flex flex-[1_0_0] gap-[126px] items-end justify-end min-h-px relative w-full" data-node-id="503:280">
        <div className="grid flex-[1_0_0] h-full items-end min-w-px relative" data-node-id="503:281">
          {HEROES.map((h, i) => (
            <div
              key={i}
              ref={(el) => (textRefs.current[i] = el)}
              data-state="next"
              className="step col-1 row-1 [word-break:break-word] content-stretch flex flex-col font-normal gap-[24px] items-start justify-end relative"
            >
              <p
                className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Archivo_Variable'] leading-[1.3] relative shrink-0 text-[40px] text-balance text-black w-full"
                data-node-id={i === 0 ? '503:282' : undefined}
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                {h.name}
              </p>
              <div
                className="flex flex-col font-['DM_Sans_Variable'] justify-end leading-[0] opacity-60 relative shrink-0 text-[#483434] text-[18px] tracking-[-0.09px] w-full"
                data-node-id={i === 0 ? '503:283' : undefined}
              >
                <p className="leading-[22.5px] text-balance">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="h-[237px] relative shrink-0 w-[203px]" data-node-id="503:284">
          {HEROES.map((h, i) => (
            <div key={i} ref={(el) => (imgRefs.current[i] = el)} aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className={h.imgClass} src={h.image} />
            </div>
          ))}
        </div>
      </div>
      <div className="content-stretch flex gap-[24px] items-center justify-center pt-[16px] relative shrink-0 w-full shadow-[inset_0_1px_0_#e6e6e6]" data-node-id="503:285">
        <p
          className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex-[1_0_0] font-['Archivo_Variable'] font-light leading-[55.2px] min-w-px relative text-[#483434] text-[24px] tracking-[-0.72px]"
          data-node-id="503:286"
          data-reveal-auto
          style={{ fontVariationSettings: '"wdth" 100' }}
        >
          Upoznaj tihe heroje
        </p>
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="503:287">
          <button
            type="button"
            aria-label="Prethodni heroj"
            onClick={() => go(-1)}
            className="slider-btn border-[0.55px] border-[rgba(61,66,46,0.3)] border-solid col-1 content-stretch flex items-center justify-center ml-0 mt-0 overflow-clip relative rounded-[55.023px] row-1 size-[26.411px] cursor-pointer bg-transparent p-0"
            data-node-id="503:288"
          >
            <span className="relative shrink-0 size-[13.206px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="./assets/imgIcon.svg" />
            </span>
          </button>
          <button
            type="button"
            aria-label="Sledeći heroj"
            onClick={() => go(1)}
            className="slider-btn border-[#08153f] border-[0.825px] border-solid col-1 content-stretch flex items-center justify-center ml-[30.29px] mt-0 overflow-clip relative rounded-[55.023px] row-1 size-[26.411px] cursor-pointer bg-transparent p-0"
            data-node-id="503:291"
          >
            <span className="relative shrink-0 size-[13.206px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="./assets/imgIcon1.svg" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

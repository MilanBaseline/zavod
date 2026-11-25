import ReserveChart from './components/ReserveChart'
import PulseHeart from './components/PulseHeart'
import HeroSlider from './components/HeroSlider'
import DaySchedule from './components/DaySchedule'
import { StepsScrollMobile } from './components/StepsScroll'
import { useReveal } from './lib/reveal'
import { useOrbitIn } from './lib/orbitIn'
import { useScrollFill } from './lib/scrollFill'

/**
 * Mobile layout (< 768px), built from the Figma frame "Home — Mobile 390" (351:933).
 * Content and behaviour follow the desktop decisions: hero video, no "Tihi heroj"
 * card in the hero, static logos, line reveals, animated reserve chart, clickable
 * day tabs, working hero slider, sticky "Put krvi" steps, scroll-filled heading
 * and the clockwise photo load-in.
 */

const A = './assets/m/'
const vw = { fontVariationSettings: '"wdth" 100' } as const

function Pill({ label }: { label: string }) {
  return (
    <div className="shadow-[inset_0_0_0_0.75px_rgba(226,226,226,0.3)] content-stretch flex gap-[7.5px] h-[19.5px] items-center justify-center pl-[7.5px] pr-[12px] py-[1.5px] relative rounded-[29.25px] shrink-0">
      <div className="relative shrink-0 size-[1.5px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}imgEllipse47.svg`} />
      </div>
      <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[16.875px] opacity-60 relative shrink-0 text-[7.5px] text-black tracking-[2.25px] uppercase whitespace-nowrap">
        {label}
      </p>
    </div>
  )
}

function Photo({ className, style, src, imgStyle }: { className: string; style?: React.CSSProperties; src: string; imgStyle?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
        <img alt="" className="absolute max-w-none object-cover size-full" src={src} style={imgStyle} />
      </div>
    </div>
  )
}

const FAQ: [string, string][] = [
  ['Ko može da da krv?', 'Osnovi uslovi su dobro zdravlje, uzrast od 18 do 65 godina i telesna masa iznad 50 kg. Konačnu procenu donosi lekar na pregledu — dođi bez brige.'],
  ['Kako da se pripremim?', 'Naspavaj se, pojedi lagan obrok i popij dovoljno vode. Na davanje krvi nemoj dolaziti gladan.'],
  ['Šta treba da ponesem?', 'Ponesi lični dokument sa fotografijom i JMBG-om.'],
  ['Koliko traje davanje krvi?', 'Za ceo postupak obično je potrebno oko 30 minuta, uključujući upitnik, pregled, davanje i kratki odmor. Vreme može zavisiti od gužve.'],
  ['Da li davanje krvi boli?', 'Možeš osetiti kratak ubod pri postavljanju igle. Ako imaš tremu ili ti je neprijatno, reci našem timu.'],
  ['Koliko često mogu da dajem krv?', 'Muškarci mogu da daju punu krv na svaka tri, a žene na svaka četiri meseca, uz ispunjene zdravstvene uslove.'],
  ['Da li mogu da dam krv ako uzimam lekove?', 'Zavisi od terapije i razloga zbog kojeg je uzimaš. Posavetuj se sa lekarom i nemoj samoinicijativno prekidati terapiju zbog davanja krvi.'],
  ['Kako da provedem ostatak dana nakon davanja?', 'Unosi više tečnosti i izbegavaj težak fizički napor i rizične aktivnosti. Prati savete osoblja koje dobiješ nakon davanja.'],
]

const FOOTER: [string, string[]][] = [
  ['Davanje krvi', ['Prvo davanje', 'Tok davanja', 'Priprema za davanje', 'Šta poneti', 'Posle davanja', 'Prava davalaca']],
  ['Ko može dati krv', ['Uslovi za davanje', 'Privremena odlaganja', 'Lekovi i davanje krvi', 'Žene i davanje krvi', 'Vakcine i putovanja', 'Zdravstvena pitanja']],
  ['Zašto dati krv', ['Zašto je krv potrebna', 'Kome pomažete', 'Od davaoca do pacijenta', 'Krvne komponente']],
  ['Uključite se', ['Organizujte akciju', 'Kompanije i ustanove', 'Škole i fakulteti', 'Edukacije', 'Lokalni Crveni krst', 'Volontiranje i promocija']],
  ['O krvi i zdravlju', ['Osnove o krvi', 'Krvne grupe i Rh', 'Testiranje i obrada krvi', 'Mitovi i činjenice', 'Česta pitanja', 'Edukativni materijali']],
  ['Vesti i kontakt', ['Vesti', 'Kampanje', 'Priče ljudi', 'Priče davalaca', 'Crveni krst', 'Kontakt']],
]

const CARD_GRADIENT = 'linear-gradient(180deg, rgba(0, 0, 0, 0) 72.611%, rgba(0, 0, 0, 0.6) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0) 53.424%, rgba(0, 0, 0, 0.6) 100%)'

const CARDS = [
  {
    num: '01',
    title: 'Mogu li da dam krv?',
    text: 'Pogledaj osnovne uslove i pronađi odgovore na nedoumice o davanju krvi.',
    // design: photo mirrored horizontally (negative width in Figma)
    img: <img alt="" className="absolute max-w-none" src={`${A}imgFrame1.jpg`} style={{ height: '99.84%', top: '0.07%', width: '200.07%', left: '-36.17%', transform: 'scaleX(-1)' }} />,
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.92) 100%)',
    numColor: 'text-white',
    textColor: 'text-[#bcbcbc]',
  },
  {
    num: '02',
    title: 'Kako da se pripremim?',
    text: 'Saznaj šta treba da uradiš pre dolaska i šta da poneseš.',
    img: <img alt="" className="absolute max-w-none object-cover size-full" src={`${A}imgFrame5.jpg`} />,
    gradient: CARD_GRADIENT,
    numColor: 'text-[#e2e2e2]',
    textColor: 'text-[#d8d8d8]',
  },
  {
    num: '03',
    title: 'Kako izgleda davanje?',
    text: 'Upoznaj svaki korak, od dolaska i pregleda do odmora nakon davanja.',
    img: <img alt="" className="absolute max-w-none" src={`${A}imgFrame2.jpg`} style={{ height: '99.97%', left: '-27.26%', top: '0.01%', width: '133.33%' }} />,
    gradient: CARD_GRADIENT,
    numColor: 'text-[#e2e2e2]',
    textColor: 'text-[#d8d8d8]',
  },
]

export default function HomeMobile() {
  useReveal()
  useOrbitIn('345:12595')
  useOrbitIn('351:1241')
  useScrollFill('351:1125')

  return (
    <div className="home-m bg-white content-stretch flex flex-col items-center relative w-full overflow-x-clip" data-node-id="351:933">
      {/* ---------- Header + hero ---------- */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="351:935" data-reveal-now>
        <div className="bg-white content-stretch flex gap-[10px] h-[48px] items-center justify-end px-[24px] py-[16px] relative shrink-0 w-full z-[2]" data-node-id="351:936">
          <div className="absolute bg-white content-stretch flex items-center left-0 p-[16.923px] rounded-bl-[67.692px] rounded-br-[67.692px] top-0">
            <div className="relative shrink-0 size-[76.154px]">
              <img alt="Zavod za transfuziju krvi Vojvodine" className="absolute block inset-0 max-w-none size-full" src={`${A}imgVector.png`} />
            </div>
          </div>
          <button type="button" className="content-stretch flex gap-[10px] items-center bg-transparent border-0 p-0 cursor-pointer">
            <span className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[24px]">
              <span className="h-[6px] relative shrink-0 w-[16px]">
                <span className="absolute inset-[-16.67%_0]">
                  <img alt="" className="block max-w-none size-full" src={`${A}imgFrame67.svg`} />
                </span>
              </span>
            </span>
            <span className="font-['Inter_Variable'] font-medium leading-[normal] text-[14px] text-black whitespace-nowrap">Meni</span>
          </button>
        </div>
        <div className="bg-white content-stretch flex flex-col items-start overflow-clip pb-[8px] px-[8px] relative shrink-0 w-full z-[1]">
          <div className="content-stretch flex flex-col items-start justify-end overflow-clip p-[12px] relative rounded-[24px] shrink-0 w-full h-[calc(100svh-56px)] min-h-[560px]" data-node-id="351:947">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[24px]">
              <video className="hero-video absolute max-w-none object-cover rounded-[24px] size-full" src="./assets/hero.mp4" poster="./assets/hero-poster.jpg" autoPlay muted loop playsInline preload="auto" disablePictureInPicture disableRemotePlayback controls={false} />
              <div className="absolute inset-0 rounded-[24px]" style={{ backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.6) 100%)' }} />
            </div>
            <div className="hero-m-content content-stretch flex flex-col gap-[20px] items-center justify-end p-[16px] relative w-full">
              <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <div className="bg-[rgba(251,251,250,0.1)] shadow-[inset_0_0_0_0.203px_rgba(226,226,226,0.1)] content-stretch flex gap-[10px] h-[24px] items-center pl-[10px] pr-[16px] py-[2px] relative rounded-[47px] shrink-0">
                  <div className="relative shrink-0 size-[2px]">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}imgEllipse46.svg`} />
                  </div>
                  <p className="font-['DM_Sans_Variable'] font-normal leading-[1.45] relative shrink-0 text-[11px] text-white tracking-[1px] uppercase whitespace-nowrap">
                    Dobrovoljno davanje krvi
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Archivo_Variable'] font-light leading-[1.2] relative shrink-0 text-[32px] text-balance text-white tracking-[-0.1463px] w-full" style={vw}>
                  Svaka krvna grupa je važna. I tvoja.
                </p>
                <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[1.45] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.8)] text-balance w-full">
                  Već danas možeš da učiniš nešto veliko i postaneš tihi heroj za nekoga koga možda nikada nećeš upoznati.
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
                <div className="bg-[#d32027] content-stretch flex h-[44px] items-center justify-center px-[20px] py-[14px] relative rounded-[90px] shrink-0 w-full">
                  <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['DM_Sans_Variable'] font-semibold leading-[1.45] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                    Gde mogu da dam krv?
                  </p>
                </div>
                <div className="bg-[rgba(255,255,255,0.1)] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.6)] content-stretch flex h-[44px] items-center justify-center px-[20px] py-[14px] relative rounded-[91px] shrink-0 w-full">
                  <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['DM_Sans_Variable'] font-normal leading-[1.45] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                    Dajem krv prvi put →
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Reserve chart ---------- */}
      <div className="bg-white content-stretch flex items-center justify-center overflow-clip px-[20px] py-[56px] relative shrink-0 w-full" data-node-id="351:965">
        <div className="content-stretch flex flex-col gap-[40px] items-center relative shrink-0 w-full max-w-[350px]">
          <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
            <div className="relative shrink-0 size-[32px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}imgGroup45.svg`} />
            </div>
            <p className="[word-break:break-word] font-['Archivo_Variable'] font-light leading-[1.2] relative shrink-0 text-[#483434] text-[28px] tracking-[-0.72px] w-full" style={vw}>
              Davaoci svih krvnih grupa svakog dana pomažu da krv bude dostupna onima kojima je potrebna.
            </p>
            <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[1.45] opacity-60 relative shrink-0 text-[#483434] text-[20px] text-balance tracking-[-0.72px] w-full">
              Pogledaj trenutno stanje rezervi i pridruži im se
            </p>
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['DM_Sans_Variable'] font-normal leading-[1.45] opacity-60 relative shrink-0 text-[#919191] text-[14px] w-full">
              Poslednje ažuriranje: 9 Septembar
            </p>
          </div>
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
            <div className="col-1 h-[333.345px] ml-[18.58px] mt-[16.66px] relative row-1 w-[295.408px]">
              <div className="absolute left-0 size-[295.408px] top-0">
                <ReserveChart />
              </div>
              <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col gap-[3.693px] items-center leading-[normal] left-[calc(50%-0.04px)] text-center top-[calc(50%-18.79px)] w-[88.622px]">
                <span className="font-['Inter_Variable'] font-medium text-[#737373] text-[8.124px] w-full">NIVO</span>
                <span className="font-['Inter_Variable'] font-semibold text-[#434343] text-[8.862px] w-full">REZERVI</span>
              </div>
            </div>
            {(
              [
                ['A+', 222.49, 0],
                ['A−', 311.17, 90.19],
                ['B+', 311.17, 212.45],
                ['B−', 222.36, 304.6],
                ['AB+', 90.02, 305.23],
                ['AB−', 0, 219.84],
                ['0+', 0, 86.83],
                ['0−', 82.76, 0],
              ] as [string, number, number][]
            ).map(([g, x, y]) => (
              <div key={g} className="col-1 content-stretch flex flex-col gap-[6.68px] items-center leading-[normal] relative row-1 text-center w-[23.381px]" style={{ marginLeft: x, marginTop: y }}>
                <span className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] block font-['Inter_Variable'] font-semibold text-[#252525] text-[10.749px] whitespace-nowrap">{g}</span>
                <span className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] block font-['Inter_Variable'] font-medium text-[#af3037] text-[8.733px]">10%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Locations ---------- */}
      <div className="bg-[#e9f4fe] content-stretch flex flex-col items-center overflow-clip px-[20px] py-[56px] relative shrink-0 w-full" data-node-id="351:1020">
        <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-center p-[20px] relative shrink-0 text-balance w-full">
              <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Archivo_Variable'] font-light leading-[1.45] relative shrink-0 text-[#483434] text-[16px] tracking-[1px] w-full" style={vw}>
                Pronađi mesto. Izaberi termin.
              </p>
              <p className="font-['DM_Sans_Variable'] font-normal leading-[1.2] relative shrink-0 text-[#5d6266] text-[24px] tracking-[-0.09px] w-full">
                Krv možeš da daš u Zavodu u Novom Sadu ili na nekoj od terenskih akcija širom Vojvodine. Pronađi lokaciju i vreme koji ti odgovaraju.
              </p>
            </div>
            <div className="bg-white content-stretch flex flex-col gap-[24px] h-[324px] items-center overflow-clip px-[48px] py-[42px] relative rounded-[18px] shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[22.5px] items-start min-h-px pt-[7.5px] relative shrink-0 w-[289px]">
                <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[15px] items-center relative shrink-0 w-full">
                    <div className="-scale-y-100 flex-none rotate-180">
                      <div className="h-[10.5px] relative w-[12.25px]">
                        <div className="absolute inset-[-35.71%_-30.61%]">
                          <PulseHeart variant="small" />
                        </div>
                      </div>
                    </div>
                    <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex-[1_0_0] font-['Archivo_Variable'] font-medium leading-[1.2] min-w-px relative text-[#3b1616] text-[22.5px] text-balance tracking-[-0.54px]" style={vw}>
                      U Zavodu u Novom Sadu
                    </p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[1.5px] items-start leading-[1.5] relative shrink-0 text-[#333] text-[13.5px] text-balance w-full">
                    <p className="font-['DM_Sans_Variable'] font-semibold relative shrink-0 w-full">Hajduk Veljkova 9a</p>
                    <p className="font-['DM_Sans_Variable'] font-normal opacity-60 relative shrink-0 w-full">Radno vreme za davaoce: 09:30 do 14:00</p>
                  </div>
                </div>
                <div className="bg-[#d32027] content-stretch flex items-center justify-center px-[24px] py-[10.5px] relative rounded-[64.5px] shrink-0 w-full">
                  <p className="font-['DM_Sans_Variable'] font-semibold leading-[normal] relative shrink-0 text-[10.5px] text-white whitespace-nowrap">
                    Pogledaj lokaciju i informacije za dolazak
                  </p>
                </div>
              </div>
              <div
                aria-hidden
                className="absolute h-[454.402px] left-[calc(50%-398.48px)] top-[86.64px] w-[807.826px] pointer-events-none"
                style={{
                  maskImage: `url("${A}imgMinimalisticArtwork2.svg")`,
                  WebkitMaskImage: `url("${A}imgMinimalisticArtwork2.svg")`,
                  maskPosition: '68.48px 144.363px',
                  WebkitMaskPosition: '68.48px 144.363px',
                  maskSize: '688.037px 229.5px',
                  WebkitMaskSize: '688.037px 229.5px',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              >
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={`${A}imgMinimalisticArtwork3.png`} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[20px] relative rounded-[32px] shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[20px] items-center relative shrink-0 w-full">
                <div className="h-[14px] relative shrink-0 w-[16.333px]">
                  <div className="absolute inset-[-35.71%_-30.61%]">
                    <PulseHeart variant="small" />
                  </div>
                </div>
                <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Archivo_Variable'] font-medium leading-[1.2] relative shrink-0 text-[#3b1616] text-[24px] tracking-[-0.72px]" style={vw}>
                  Na terenskoj akciji
                </p>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[1.45] opacity-60 relative shrink-0 text-[#333] text-[16px] text-balance w-full">
                Pogledaj gde smo u narednim danima. Izaberi akciju i sačuvaj termin u svom kalendaru.
              </p>
            </div>
            <DaySchedule mobile />
            <div className="bg-[#d32027] content-stretch flex items-start px-[12px] py-[14px] relative rounded-[86px] shrink-0 w-full">
              <p className="flex-[1_0_0] font-['DM_Sans_Variable'] font-semibold leading-[1.45] min-w-px relative text-[14px] text-center text-white">
                Pogledaj lokaciju i informacije za dolazak
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- First time ---------- */}
      <div className="bg-white content-stretch flex flex-col gap-[32px] items-center overflow-clip px-[20px] py-[56px] relative shrink-0 w-full" data-node-id="351:1090">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[20px] items-center p-[20px] relative shrink-0 text-[#483434] text-center w-full">
          <p className="font-['Archivo_Variable'] font-light leading-[1.2] relative shrink-0 text-[32px] tracking-[-0.72px] w-full" style={vw}>
            Prvi put daješ krv? Tu smo za tebe.
          </p>
          <p className="font-['DM_Sans_Variable'] font-normal leading-[1.45] opacity-60 relative shrink-0 text-[16px] text-balance tracking-[-0.09px] w-full">
            Svako ko redovno daje krv jednom je došao prvi put. Ako razmišljaš o svom prvom davanju, upoznaj se sa postupkom i dođi spremno. Naš tim je tu da te vodi kroz svaki korak.
          </p>
        </div>
        <div className="cards-m flex gap-[22.5px] h-[471px] items-start relative shrink-0 w-[calc(100%+40px)] -mx-[20px] px-[20px] overflow-x-auto snap-x snap-mandatory">
          {CARDS.map((c) => (
            <div key={c.num} className="content-stretch flex flex-col gap-[18px] h-full items-center justify-end overflow-clip px-[24px] py-[36px] relative rounded-[18px] shrink-0 w-[325px] snap-start [clip-path:inset(0_round_18px)]">
              <div aria-hidden className="absolute inset-0 pointer-events-none">
                <div className="absolute bg-[#fafaf4] inset-0" />
                <div className="absolute inset-0 overflow-hidden">{c.img}</div>
                <div className="absolute inset-0" style={{ backgroundImage: c.gradient }} />
              </div>
              <p className={`font-['DM_Sans_Variable'] font-bold leading-[normal] relative shrink-0 text-[9px] ${c.numColor}`}>{c.num}</p>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-center relative shrink-0 text-center w-full max-w-[277px]">
                <p className="font-['DM_Sans_Variable'] font-bold leading-[normal] relative shrink-0 text-[15px] text-white tracking-[-0.75px] w-full">{c.title}</p>
                <p className={`font-['DM_Sans_Variable'] font-normal leading-[1.6] relative shrink-0 text-[11.25px] text-balance w-full ${c.textColor}`}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Svakih minut i po ---------- */}
      <div className="bg-white content-stretch flex flex-col gap-[32px] items-center overflow-clip px-[20px] py-[56px] relative shrink-0 w-full" data-node-id="351:1123">
        <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[1.45] opacity-62 relative shrink-0 text-[20px] text-balance text-black text-center tracking-[-0.09px] w-full">
          Svakih minut i po, nekome je potrebna krv.
        </p>
        <p className="[word-break:break-word] font-['Archivo_Variable'] font-light leading-[1.3] relative shrink-0 text-[#a9a9a9] text-[32px] text-balance text-center tracking-[-0.72px] w-full" data-node-id="351:1125" style={vw}>
          Svakog dana u Srbiji potrebno je oko 1.000 jedinica krvi. Iza svake potrebe je osoba kojoj davalac poput tebe može da pomogne.
        </p>
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
          <Photo className="col-1 ml-0 mt-[90px] opacity-10 relative rounded-[1.75px] row-1 size-[21px]" src={`${A}imgRectangle766.jpg`} />
          <Photo className="col-1 ml-[10.5px] mt-[28px] opacity-40 relative rounded-[6.028px] row-1 size-[72.333px]" src={`${A}imgRectangle767.jpg`} />
          <Photo className="col-1 ml-[31.5px] mt-[14.25px] relative rounded-[6.028px] row-1 size-[72.333px]" src={`${A}imgFrame5.jpg`} />
          <div className="col-1 ml-[75.75px] mt-0 relative rounded-[3.25px] row-1 size-[39px] overflow-hidden bg-[#211e1e]">
            <img alt="" className="absolute max-w-none" src={`${A}imgFrame1.jpg`} style={{ height: '207.14%', left: '-111.12%', top: '-11.04%', width: '286.42%' }} />
          </div>
        </div>
      </div>

      {/* ---------- Put krvi ---------- */}
      <div className="content-stretch flex flex-col items-center px-[20px] py-[100px] relative shrink-0 w-full" data-node-id="351:1131">
        <div className="bg-white content-stretch flex flex-col gap-[64px] items-center p-[20px] relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[20px] items-center py-[20px] relative shrink-0 w-full">
            <Pill label="Put Krvi" />
            <p className="[word-break:break-word] font-['Archivo_Variable'] font-light leading-[1.2] relative shrink-0 text-[#483434] text-[32px] text-balance text-center tracking-[-0.72px] w-full" style={vw}>
              Tvoja krv nastavlja put.
            </p>
            <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[1.45] opacity-60 relative shrink-0 text-[#483434] text-[16px] text-balance text-center tracking-[-0.09px] w-full">
              Tvojim davanjem počinje put pomoći. Naš tim zatim obrađuje, testira i priprema krv kako bi stigla do onih kojima je potrebna.
            </p>
          </div>
          <StepsScrollMobile />
        </div>
      </div>

      {/* ---------- Tihi heroji ---------- */}
      <div className="content-stretch flex flex-col gap-[32px] items-start overflow-clip px-[20px] py-[56px] relative shrink-0 w-full" data-node-id="351:1156">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute bg-white inset-0" />
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[142.19%] left-0 max-w-none top-[-42.21%] w-full object-cover" src={`${A}imgFrame2131329957.jpg`} />
          </div>
        </div>
        <div className="bg-[#fffbe3] content-stretch flex flex-col gap-[20px] items-start px-[24px] py-[32px] relative rounded-[14px] shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start pb-[24px] relative shrink-0 w-full">
            <Pill label="Tihi Heroji" />
            <p className="[word-break:break-word] font-['Archivo_Variable'] font-light leading-[1.2] relative shrink-0 text-[#483434] text-[24px] tracking-[-0.72px] w-full" style={vw}>
              Iza svakog davanja su ljudi.
            </p>
            <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[1.45] opacity-60 relative shrink-0 text-[#483434] text-[16px] text-balance tracking-[-0.09px] w-full">
              Tihi heroji su ljudi poput tebe. Ljudi koji izdvoje vreme da pomognu nekome koga možda nikada neće upoznati. Ovde njihove priče susreću priče ljudi kojima krv pomaže.
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
            <HeroSlider mobile />
            <div className="shadow-[inset_0_1px_0_#e8e8e8] content-stretch flex flex-col items-center py-[16px] relative shrink-0 w-full">
              <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[24px] items-start relative shrink-0 text-black w-full">
                <p className="font-['DM_Sans_Variable'] leading-[1.45] opacity-60 relative shrink-0 text-[20px] text-balance w-full">Saznaj kome pomažeš</p>
                <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] flex flex-col font-['Archivo_Variable'] relative shrink-0 text-[24px] tracking-[-0.72px] w-full" style={vw}>
                  <p className="leading-[1.2] mb-0 text-balance">
                    Krv koju daješ pomaže ljudima tokom operacija, onkološkog lečenja, nakon povreda i u drugim situacijama u kojima je transfuzija deo lečenja.
                  </p>
                  <p className="leading-[1.2] text-balance">Iza svake od tih situacija je osoba kojoj tvoja pomoć mnogo znači.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Krv je potrebna svakog dana ---------- */}
      <div className="flex justify-center overflow-hidden relative shrink-0 w-full">
        <div className="bg-white content-stretch flex flex-col gap-[14.1px] h-[692.075px] items-center justify-center px-[49.35px] py-[25.85px] relative shrink-0 w-[1128px]" data-node-id="345:12595">
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-[372px]">
            <div className="content-stretch flex flex-col items-center p-[5.875px] relative shrink-0 w-full">
              <div className="[word-break:break-word] font-['Archivo_Variable'] font-light relative shrink-0 text-[#483434] text-[40px] text-center tracking-[-0.423px] whitespace-nowrap" style={vw}>
                <p className="leading-[1.2] mb-0 text-balance">Krv je potrebna</p>
                <p className="leading-[1.2] text-balance">svakog dana.</p>
              </div>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
              <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[1.4] opacity-70 relative shrink-0 text-[#483434] text-[14px] text-balance text-center tracking-[-0.0529px] w-[299px]">
                Svako davanje znači mnogo. Kada daješ krv redovno, pomažeš da ona bude dostupna kad god nekome zatreba. Neka tvoj prvi dolazak bude početak dobre navike.
              </p>
            </div>
          </div>
          <div data-orbit-frame className="absolute inset-0 pointer-events-none">
            <Photo className="absolute h-[41.691px] left-[181.31px] top-[253.24px] w-[65.257px]" src={`${A}imgRectangle26.jpg`} />
            <Photo className="absolute h-[61.642px] left-[824.25px] top-[286.2px] w-[96.486px]" src={`${A}imgRectangle10.jpg`} />
            <Photo className="absolute h-[90.756px] left-[358.04px] top-[100.92px] w-[142.057px]" src={`${A}imgRectangle755.jpg`} />
            <Photo className="absolute h-[56.944px] left-[163px] top-[384.26px] w-[89.133px]" src={`${A}imgRectangle26.jpg`} />
            <div className="absolute bg-[#d32027] h-[30.622px] left-[264.62px] top-[487.21px] w-[47.932px]" />
            <div className="absolute bg-[#d32027] h-[16.506px] left-[712.73px] top-[521.95px] w-[25.836px]" />
            <div className="absolute bg-[#d32027] h-[13.921px] left-[252.13px] top-[211.7px] w-[21.79px]" />
            <div className="absolute bg-[#d32027] h-[13.921px] left-[701.83px] top-[174.29px] w-[21.79px]" />
            <Photo className="absolute h-[56.944px] left-[397.23px] top-[528.49px] w-[89.133px]" src={`${A}imgRectangle26.jpg`} />
            <Photo className="absolute h-[33.123px] left-[747.35px] top-[487.21px] w-[51.846px]" src={`${A}imgRectangle26.jpg`} />
            <Photo className="absolute h-[74.507px] left-[814.24px] top-[409.21px] w-[51.846px]" src={`${A}imgRectangle25.jpg`} />
            <Photo className="absolute h-[84.136px] left-[521.02px] top-[521.95px] w-[89.133px]" src={`${A}imgRectangle25.jpg`} />
            <Photo className="absolute h-[37.279px] left-[736.99px] top-[195.3px] w-[58.351px]" src={`${A}imgRectangle27.jpg`} />
            <Photo className="absolute h-[64.915px] left-[519.98px] top-[120.93px] w-[101.608px]" src={`${A}imgRectangle27.jpg`} />
          </div>
        </div>
      </div>

      {/* ---------- Pokreni svoj kolektiv ---------- */}
      <div className="bg-white content-stretch flex flex-col gap-[32px] items-center overflow-clip px-[20px] py-[56px] relative shrink-0 w-full" data-node-id="351:1212">
        <div className="content-stretch flex flex-col gap-[20px] items-center p-[20px] relative shrink-0 w-full">
          <Pill label="Put Krvi" />
          <p className="[word-break:break-word] font-['Archivo_Variable'] font-light leading-[1.2] relative shrink-0 text-[#483434] text-[32px] text-center tracking-[-0.72px] w-full" style={vw}>
            Pokreni svoj kolektiv.
          </p>
          <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[1.45] opacity-60 relative shrink-0 text-[#483434] text-[16px] text-balance text-center tracking-[-0.09px] w-full">
            Dobra ideja dobija snagu kada joj se pridruže drugi. Okupi kolege, prijatelje ili svoju lokalnu zajednicu i zajedno podržite dobrovoljno davanje krvi.
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative shrink-0 w-full">
          {[
            { bg: 'bg-[#480c0c]', fg: 'text-white', title: 'Kompanije i ustanove', text: 'Pokreni inicijativu među kolegama. Poveži svoj kolektiv sa našim timom i saznaj kako možete da organizujete akciju davanja krvi.', cta: 'Uključi svoj kolektiv', icon: 'imgGroup70.svg', iconBox: 'h-[31.2px] w-[33.6px] mt-[4px]' },
            { bg: 'bg-[#fffbe3]', fg: 'text-[#480c0c]', title: 'Škole i fakulteti', text: 'Poveži svoju školu ili fakultet sa našim timom. Zajedno možemo da organizujemo edukaciju i pripremimo punoletne učenike i studente za davanje krvi.', cta: 'Uključi svoju školu ili fakultet', icon: 'imgGraduationCapLine.svg', iconBox: 'size-[40px]' },
          ].map((c) => (
            <div key={c.title} className={`${c.bg} content-stretch flex flex-col gap-[28px] items-start overflow-clip p-[28px] relative rounded-[20px] shrink-0 w-full`}>
              <div className="content-stretch flex gap-[15px] items-start relative shrink-0 w-full">
                <div className={`[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[15px] items-start min-w-px pt-[9px] relative text-balance ${c.fg}`}>
                  <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Archivo_Variable'] font-medium leading-[33.75px] relative shrink-0 text-[20px] tracking-[-0.54px] w-full" style={vw}>
                    {c.title}
                  </p>
                  <p className="font-['DM_Sans_Variable'] font-normal leading-[1.5] opacity-60 relative shrink-0 text-[14px] w-full">{c.text}</p>
                </div>
                <div className="content-stretch flex items-start justify-center relative shrink-0 size-[40px]">
                  <div className={`relative shrink-0 ${c.iconBox}`}>
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}${c.icon}`} />
                  </div>
                </div>
              </div>
              <div className="bg-[#d32027] content-stretch flex items-start px-[12px] py-[14px] relative rounded-[86px] shrink-0 w-full">
                <p className="flex-[1_0_0] font-['DM_Sans_Variable'] font-semibold leading-[1.45] min-w-px relative text-[14px] text-center text-white">{c.cta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Crveni krst ---------- */}
      <div className="bg-[#480c0c] content-stretch flex flex-col gap-[32px] items-start overflow-clip pb-[56px] pt-[124px] px-[20px] relative shrink-0 w-full" data-node-id="351:1241">
        <div data-orbit-frame className="absolute inset-0 pointer-events-none">
          <Photo className="absolute h-[114.285px] left-[390.72px] top-[213.67px] w-[178.886px]" src={`${A}imgRectangle10.jpg`} />
          <div className="absolute bg-[#d32027] h-[21.813px] left-[280px] top-[634.47px] w-[34.143px]" />
          <div className="absolute bg-[#d32027] h-[21.813px] left-[262.75px] top-[85.42px] w-[34.143px]" />
          <Photo className="absolute h-[43.772px] left-[340.48px] top-[578.92px] w-[68.515px]" src={`${A}imgRectangle26.jpg`} />
          <Photo className="absolute h-[98.462px] left-[428.87px] top-[409.05px] w-[68.515px]" src={`${A}imgRectangle25.jpg`} />
          <Photo className="absolute h-[49.264px] left-[326.78px] top-[97.99px] w-[77.111px]" src={`${A}imgRectangle27.jpg`} />
          <Photo className="absolute h-[85.785px] left-[40px] top-[-0.29px] w-[134.277px]" src={`${A}imgRectangle27.jpg`} />
        </div>
        <div className="content-stretch flex flex-col gap-[20px] items-start p-[20px] relative shrink-0 w-full">
          <div className="relative shrink-0 w-[56.876px] h-[68.92px]">
            <img alt="" className="absolute block left-0 top-0 size-[56.876px] max-w-none" src={`${A}imgUnion.png`} />
            <img alt="1876" className="absolute block h-[6.612px] left-[19px] top-[62.31px] w-[19.181px] max-w-none" src={`${A}img1876.svg`} />
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[20px] items-start relative shrink-0 text-balance text-white w-full">
            <p className="font-['DM_Sans_Variable'] leading-[1.45] opacity-60 relative shrink-0 text-[20px] w-full">Podrška je i u tvom mestu.</p>
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] font-['Archivo_Variable'] leading-[1.2] relative shrink-0 text-[28px] tracking-[-0.72px] w-full" style={vw}>
              Lokalni <span className="text-[#ff474e]">Crveni krst</span> je kontakt za pojedince, kompanije i organizacije koji žele da se uključe. Pomaže u organizovanju akcija i povezuje davaoce sa informacijama i aktivnostima u njihovoj sredini.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- FAQ ---------- */}
      <div className="bg-white content-stretch flex items-start overflow-clip px-[24px] py-[56px] relative shrink-0 w-full" data-node-id="351:1260">
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[64px] items-start min-w-px relative">
          <div className="content-stretch flex flex-col gap-[28px] items-center justify-center relative shrink-0 w-full">
            <div className="[word-break:break-word] content-stretch flex flex-col font-normal gap-[18px] items-center relative shrink-0 text-[#483434] text-balance text-center w-full">
              <p className="font-['Archivo_Variable'] leading-[1.2] relative shrink-0 text-[36px] tracking-[-0.54px] w-full" style={vw}>
                Iza svakog davanja su ljudi.
              </p>
              <p className="font-['DM_Sans_Variable'] leading-[1.5] opacity-70 relative shrink-0 text-[13.5px] tracking-[-0.0675px] w-full">
                Od pripreme do povratka svakodnevnim aktivnostima, ovde su odgovori na najčešće nedoumice.
              </p>
            </div>
            <div className="bg-[#d32027] content-stretch flex items-center px-[28px] py-[14px] relative rounded-[86px] shrink-0">
              <p className="font-['DM_Sans_Variable'] font-semibold leading-[1.45] relative shrink-0 text-[14px] text-white whitespace-nowrap">Pogledaj sva pitanja i odgovore</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            {FAQ.map(([q, a], i) => (
              <div key={q} className="[word-break:break-word] shadow-[inset_0_0.75px_0_#e8e8e8] content-stretch flex flex-col gap-[6px] items-center py-[16px] relative shrink-0 text-center text-balance w-full">
                <p className="font-['DM_Sans_Variable'] font-medium leading-[1.3] relative shrink-0 text-[#111] text-[16px] w-full">{q}</p>
                <p className={`font-['DM_Sans_Variable'] font-normal leading-[1.6] opacity-60 relative shrink-0 text-[#555] w-full ${i === 0 ? 'text-[14px]' : 'text-[11.25px]'}`}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <div className="bg-white content-stretch flex items-start overflow-clip p-[12px] relative shrink-0 w-full" data-node-id="345:17592">
        <div className="bg-[#fffbe3] content-stretch flex flex-[1_0_0] flex-col items-center min-w-px pt-[44px] px-[44px] relative rounded-[24px] overflow-clip">
          <div className="content-stretch flex flex-col items-start justify-center pb-[48px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
                <p className="[word-break:break-word] font-['Archivo_Variable'] font-normal leading-[1.2] relative shrink-0 text-[#0a142f] text-[26px] text-balance tracking-[-0.72px] w-full" style={vw}>
                  Tvoj sledeći korak može nekome mnogo da znači.
                </p>
                <p className="[word-break:break-word] font-['DM_Sans_Variable'] font-normal leading-[1.4] opacity-50 relative shrink-0 text-[#0a142f] text-[14px] text-balance w-full">
                  Pronađi mesto i termin koji ti odgovaraju i pridruži se tihim herojima. Bilo da dolaziš prvi put ili nastavljaš svoju dobru naviku, radujemo se tvom dolasku.
                </p>
                <div className="bg-[#d32027] content-stretch flex items-start px-[28px] py-[14px] relative rounded-[86px] shrink-0">
                  <p className="font-['DM_Sans_Variable'] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Gde mogu da dam krv?</p>
                </div>
              </div>
              <Photo className="h-[123px] relative shrink-0 w-[184px] bg-[#d9d9d9]" src={`${A}imgRectangle778.jpg`} />
            </div>
          </div>
          <div className="shadow-[inset_0_1px_0_rgba(0,0,0,0.08)] content-stretch flex flex-col gap-[32px] items-start pt-[32px] relative shrink-0 w-full">
            <div className="[word-break:break-word] content-start flex flex-wrap gap-[28px_20px] items-start leading-[21px] relative shrink-0 text-[#0a142f] w-full">
              {FOOTER.map(([h, items]) => (
                <div key={h} className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 text-[16px] w-full">
                  <p className="font-['DM_Sans_Variable'] font-bold relative shrink-0 w-full">{h}</p>
                  <div className="content-stretch flex flex-col font-['DM_Sans_Variable'] font-normal gap-[8px] items-start relative shrink-0 w-full">
                    {items.map((t) => (
                      <p key={t} className={`opacity-50 relative shrink-0 w-full ${t === 'Kontakt' ? 'text-[14px]' : ''}`}>
                        {t}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="shadow-[inset_0_1px_0_rgba(0,0,0,0.08)] content-stretch flex flex-col gap-[24px] items-center pt-[32px] relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[24px] items-center justify-center relative shrink-0">
                <div className="content-stretch flex font-['DM_Sans_Variable'] font-normal gap-[28px] items-start leading-[28px] relative shrink-0 text-[#0a142f] text-[14px] whitespace-nowrap">
                  <p className="relative shrink-0">Terms</p>
                  <p className="relative shrink-0">Privacy</p>
                  <p className="relative shrink-0">Cookies</p>
                </div>
                <div className="content-stretch flex gap-[15px] items-start relative shrink-0">
                  {['imgLinkedin.svg', 'imgFacebook.svg', 'imgTwitter.svg'].map((s) => (
                    <div key={s} className="relative shrink-0 size-[35px]">
                      <div className="absolute inset-[-2.14%]">
                        <img alt="" className="block max-w-none size-full" src={`${A}${s}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white content-stretch flex items-center p-[30.769px] relative rounded-tl-[106.383px] rounded-tr-[106.383px] shrink-0">
                <div className="relative shrink-0 size-[138.462px]">
                  <img alt="Zavod za transfuziju krvi Vojvodine" className="absolute block inset-0 max-w-none size-full" src={`${A}imgVector3.png`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

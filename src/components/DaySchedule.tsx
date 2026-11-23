import { useState } from 'react'

/**
 * "Na terenskoj akciji" — day tabs with the list of field blood drives.
 * Click a day to see its locations. At most 5 are shown; days can have fewer.
 *
 * Monday is from the design. Tuesday–Sunday are PLACEHOLDER rows to be
 * replaced with the real schedule.
 */

type Row = { city: string; place: string; time: string; warning?: boolean }

const DAYS: { label: string; rows: Row[] }[] = [
  {
    label: 'Pon',
    rows: [
      { city: 'Begeč', place: 'Prostorije udruženja Begečka Nana', time: '09:00 – 11:00' },
      { city: 'Inđija', place: 'Dom Zdravlja', time: '09:00 – 11:00', warning: true },
      { city: 'Sombor', place: 'Crveni krst', time: '09:00 – 11:00' },
      { city: 'Sremska Mitrovica', place: 'KPZ', time: '09:00 – 11:00' },
      { city: 'Pančevo', place: 'Crveni krst', time: '09:00 – 11:00' },
    ],
  },
  // PLACEHOLDER days below
  {
    label: 'Uto',
    rows: [
      { city: 'Novi Sad', place: 'Fakultet tehničkih nauka', time: '09:00 – 12:00' },
      { city: 'Vrbas', place: 'Dom zdravlja', time: '08:30 – 11:30' },
      { city: 'Kikinda', place: 'Crveni krst', time: '09:00 – 11:00' },
    ],
  },
  {
    label: 'Sre',
    rows: [
      { city: 'Subotica', place: 'Gradska kuća', time: '09:00 – 12:00' },
      { city: 'Zrenjanin', place: 'Crveni krst', time: '09:00 – 11:00' },
      { city: 'Bačka Palanka', place: 'Dom kulture', time: '10:00 – 12:00' },
      { city: 'Ruma', place: 'Dom zdravlja', time: '09:00 – 11:00', warning: true },
      { city: 'Vršac', place: 'Crveni krst', time: '09:00 – 11:00' },
    ],
  },
  {
    label: 'Čet',
    rows: [
      { city: 'Temerin', place: 'Mesna zajednica', time: '09:00 – 11:00' },
      { city: 'Bečej', place: 'Crveni krst', time: '09:00 – 11:00' },
    ],
  },
  {
    label: 'Pet',
    rows: [
      { city: 'Novi Sad', place: 'Spens', time: '10:00 – 14:00' },
      { city: 'Šid', place: 'Dom zdravlja', time: '09:00 – 11:00' },
      { city: 'Senta', place: 'Crveni krst', time: '09:00 – 11:00' },
      { city: 'Kula', place: 'Dom kulture', time: '09:00 – 11:00' },
    ],
  },
  {
    label: 'Sub',
    rows: [{ city: 'Novi Sad', place: 'Trg slobode', time: '10:00 – 13:00' }],
  },
  { label: 'Ned', rows: [] },
]

const MAX_ROWS = 5

export default function DaySchedule() {
  const [day, setDay] = useState(0)
  const rows = DAYS[day].rows.slice(0, MAX_ROWS)

  return (
    <div data-no-split className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="503:1685">
      <div role="tablist" aria-label="Dani u nedelji" className="content-stretch flex h-[64px] items-center relative shrink-0 w-full" data-node-id="503:1686">
        {DAYS.map((d, i) => {
          const active = i === day
          return (
            <button
              key={d.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setDay(i)}
              className={`day-tab content-stretch flex flex-[1_0_0] h-full items-center justify-center min-w-px px-[24px] relative cursor-pointer bg-transparent ${
                active ? 'is-active' : ''
              }`}
            >
              <span
                className={`[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['DM_Sans_Variable'] leading-[normal] relative shrink-0 text-[20px] whitespace-nowrap ${
                  active ? 'font-bold text-[#333c43]' : 'font-normal opacity-30 text-[#5d6266]'
                }`}
              >
                {d.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="503:1694">
        <div className="[word-break:break-word] content-stretch flex font-['DM_Sans_Variable'] font-semibold gap-[12px] h-[32px] items-center justify-center leading-[normal] px-[8px] py-[12px] relative shrink-0 text-[#bfc8d0] text-[11px] tracking-[2px] uppercase w-full">
          <p className="flex-[1_0_0] min-w-px relative">Mesto / lokacija</p>
          <p className="relative shrink-0 text-right w-[120px]">Vreme</p>
        </div>

        <div key={day} className="day-rows contents" role="tabpanel" data-row-count={rows.length}>
          {rows.length === 0 && (
            <div className="day-row bg-white shadow-[inset_0_1px_0_rgba(191,200,208,0.3)] flex h-[56px] items-center px-[8px] w-full">
              <p className="font-['DM_Sans_Variable'] font-normal text-[#888] text-[16px]">Nema akcija za ovaj dan.</p>
            </div>
          )}
          {rows.map((r, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
              className="day-row [word-break:break-word] bg-white shadow-[inset_0_1px_0_rgba(191,200,208,0.3)] content-stretch flex gap-[10px] h-[56px] items-center justify-center leading-[normal] px-[8px] py-[16px] relative shrink-0 text-[16px] w-full"
            >
              {r.warning && (
                <div className="bg-[#d32027] content-stretch flex items-center justify-center p-[3.25px] relative rounded-[69.875px] shrink-0">
                  <div className="relative shrink-0 size-[19.5px]">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src="./assets/imgErrorWarningFill.svg" />
                  </div>
                </div>
              )}
              <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative whitespace-nowrap">
                <p className="font-['DM_Sans_Variable'] font-medium relative shrink-0 text-[#111]">{r.city}</p>
                <p className="font-['DM_Sans_Variable'] font-normal relative shrink-0 text-[#888]">{r.place}</p>
              </div>
              <p className="font-['DM_Sans_Variable'] font-normal relative shrink-0 text-[#444] text-right w-[120px]">{r.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

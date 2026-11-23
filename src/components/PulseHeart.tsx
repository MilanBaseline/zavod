import { useId } from 'react'

/**
 * Heart icon from the design: a solid red heart with a soft 20% red halo.
 * The inner heart stays still; only the halo pulses.
 * Two sizes exist in the design (hero "Tihi heroj" card and the location cards).
 */

const VARIANTS = {
  large: {
    w: 28,
    h: 25.6667,
    stroke: 11.6667,
    mask: { x: -0.166667, y: -0.166663, w: 29, h: 26 },
    d: 'M17.6458 5.83334C16.1401 5.83334 14.8218 6.48099 14 7.57573C13.1782 6.48099 11.8599 5.83334 10.3542 5.83334C9.15558 5.83469 8.00647 6.31154 7.15895 7.15926C6.31142 8.00699 5.83468 9.15637 5.83333 10.3552C5.83333 15.4606 13.4014 19.5931 13.7236 19.7637C13.8086 19.8094 13.9035 19.8333 14 19.8333C14.0964 19.8333 14.1914 19.8094 14.2764 19.7637C14.5986 19.5931 22.1667 15.4606 22.1667 10.3552C22.1653 9.15637 21.6886 8.00699 20.841 7.15926C19.9935 6.31154 18.8444 5.83469 17.6458 5.83334Z',
  },
  small: {
    w: 26.3333,
    h: 24,
    stroke: 10,
    mask: { x: 0, y: 0, w: 27, h: 24 },
    d: 'M16.8125 5C15.3068 5 13.9884 5.64765 13.1667 6.7424C12.3449 5.64765 11.0266 5 9.52083 5C8.32225 5.00135 7.17314 5.4782 6.32561 6.32593C5.47809 7.17366 5.00135 8.32304 5 9.52191C5 14.6273 12.568 18.7597 12.8903 18.9304C12.9753 18.9761 13.0702 19 13.1667 19C13.2631 19 13.3581 18.9761 13.443 18.9304C13.7653 18.7597 21.3333 14.6273 21.3333 9.52191C21.3319 8.32304 20.8552 7.17366 20.0077 6.32593C19.1602 5.4782 18.0111 5.00136 16.8125 5Z',
  },
}

export default function PulseHeart({ variant }: { variant: keyof typeof VARIANTS }) {
  const v = VARIANTS[variant]
  const maskId = `heart-halo-${useId().replace(/:/g, '')}`
  return (
    <svg
      className="block size-full"
      viewBox={`0 0 ${v.w} ${v.h}`}
      preserveAspectRatio="none"
      overflow="visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        {/* Halo only outside the heart; the mask stays still while the halo scales */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x={-v.w} y={-v.h} width={v.w * 3} height={v.h * 3}>
          <rect x={-v.w} y={-v.h} width={v.w * 3} height={v.h * 3} fill="white" />
          <path d={v.d} fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <path className="heart-halo" d={v.d} stroke="#D32027" strokeOpacity={0.2} strokeWidth={v.stroke} />
      </g>
      <path d={v.d} fill="#D32027" />
    </svg>
  )
}

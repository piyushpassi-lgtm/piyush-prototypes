import type { ReactNode } from 'react'

// Outline icons on a 24pt grid, standing in for the Tala icon library (§9).

export type IconProps = { size?: 16 | 24 | 32 | 40 | 48; className?: string; strokeWidth?: number }
export type Icon = (props: IconProps) => ReactNode

function icon(paths: ReactNode): Icon {
  return function TalaIcon({ size = 24, className, strokeWidth = 2 }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {paths}
      </svg>
    )
  }
}

export const ArrowLeft = icon(<path d="M19 12H5M12 19l-7-7 7-7" />)
export const ChevronLeft = icon(<path d="m15 18-6-6 6-6" />)
export const ChevronRight = icon(<path d="m9 18 6-6-6-6" />)
export const ChevronDown = icon(<path d="m6 9 6 6 6-6" />)
export const Close = icon(<path d="M18 6 6 18M6 6l12 12" />)
export const Plus = icon(<path d="M12 5v14M5 12h14" />)
export const Check = icon(<path d="M20 6 9 17l-5-5" />)
export const Menu = icon(<path d="M4 7h16M4 12h16M4 17h16" />)
export const Help = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.6c0 1.7-2.4 2.2-2.4 3.4M12 17h.01" />
  </>,
)
export const Person = icon(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
  </>,
)
export const Home = icon(<path d="M3 10.5 12 3l9 7.5V21h-6v-5a3 3 0 0 0-6 0v5H3z" />)
export const Coin = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.5 9.3c-.4-.9-1.3-1.5-2.5-1.5-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.5 5 4.2 0 1.1-1.1 1.9-2.5 1.9-1.2 0-2.2-.6-2.6-1.5M12 6.3v1.5M12 16.2v1.5" />
  </>,
)
export const Wallet = icon(
  <>
    <rect x="3" y="6" width="18" height="14" rx="3" />
    <path d="M3 10h18M16 15h2" />
  </>,
)
export const Gift = icon(
  <>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M5 12v9h14v-9M12 8v13M12 8S10.5 3.5 8 4.2 8.5 8 12 8Zm0 0s1.5-4.5 4-3.8S15.5 8 12 8Z" />
  </>,
)
export const Clock = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
)
export const Bank = icon(<path d="M3 10h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M12 3l9 5H3z" />)
export const Alert = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5M12 16h.01" />
  </>,
)
export const Info = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </>,
)
export const Calendar = icon(
  <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </>,
)
export const Pause = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 9v6M14 9v6" />
  </>,
)
export const Power = icon(<path d="M12 3v9M18.4 6.6a9 9 0 1 1-12.8 0" />)
export const Refresh = icon(<path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5M20 4v4.5h-4.5" />)
export const File = icon(<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5" />)
export const Shield = icon(<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4" />)
export const Bell = icon(<path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16zM10 21h4" />)
export const Notes = icon(<path d="M8 6h12M8 12h12M8 18h8M4 6h.01M4 12h.01M4 18h.01" />)
export const Lock = icon(
  <>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </>,
)
export const Globe = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 3.5 5.7 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.7-3.5-9s1-6.5 3.5-9Z" />
  </>,
)
export const TextSize = icon(<path d="M3 6h9M7.5 6v12M13 11h7M16.5 11v7" />)
export const Logout = icon(<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8M17 8l4 4-4 4M21 12H10" />)

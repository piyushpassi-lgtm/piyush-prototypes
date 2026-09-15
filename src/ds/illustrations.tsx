import { motion } from 'framer-motion'

// Placeholder spot illustrations (§13) — drawn with DS tokens until final artwork is approved.

type ArtProps = { className?: string }

export function AutoPayArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 160 110" fill="none" className={className} aria-hidden="true">
      <circle cx="22" cy="30" r="3" fill="var(--color-teal-50)" />
      <circle cx="16" cy="54" r="2" fill="var(--color-orange-30)" />
      <circle cx="146" cy="92" r="3" fill="var(--color-teal-50)" />
      <rect x="40" y="14" width="64" height="80" rx="8" fill="var(--color-bone-0)" stroke="var(--color-teal-70)" strokeWidth="3" />
      <rect x="52" y="28" width="40" height="6" rx="3" fill="var(--color-teal-30)" />
      <rect x="52" y="42" width="28" height="5" rx="2.5" fill="var(--color-bone-50)" />
      <rect x="52" y="54" width="34" height="5" rx="2.5" fill="var(--color-bone-50)" />
      <rect x="52" y="68" width="40" height="10" rx="5" fill="var(--color-orange-50)" />
      <circle cx="112" cy="30" r="18" fill="var(--color-green-10)" />
      <path d="m104 30 6 6 11-12" stroke="var(--color-green-90)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M131 72a19 19 0 1 1-7-15" stroke="var(--color-teal-50)" strokeWidth="4" strokeLinecap="round" />
      <path d="M126 47v11h-11" stroke="var(--color-teal-50)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PaperPlaneArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 100" fill="none" className={className} aria-hidden="true">
      <path d="M10 52 104 14 72 88 56 62Z" fill="var(--color-teal-50)" />
      <path d="M56 62 104 14 46 57Z" fill="var(--color-teal-70)" />
      <path d="m56 62-4 22 16-14" fill="var(--color-teal-90)" />
      <circle cx="110" cy="8" r="2.5" fill="var(--color-orange-50)" />
      <path d="M114 22h6M117 19v6" stroke="var(--color-teal-50)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SuccessArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="36" fill="var(--color-green-10)" />
      <path d="m34 51 11 11 22-24" stroke="var(--color-green-90)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="24" r="3" fill="var(--color-teal-50)" />
      <circle cx="90" cy="20" r="2.5" fill="var(--color-orange-50)" />
      <path d="M86 80h8M90 76v8" stroke="var(--color-teal-50)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function AlertArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="36" fill="var(--color-red-10)" />
      <path d="M50 32v22" stroke="var(--color-red-50)" strokeWidth="7" strokeLinecap="round" />
      <circle cx="50" cy="67" r="4.5" fill="var(--color-red-50)" />
    </svg>
  )
}

export function CalendarArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 100" fill="none" className={className} aria-hidden="true">
      <rect x="22" y="18" width="70" height="66" rx="10" fill="var(--color-bone-0)" stroke="var(--color-teal-70)" strokeWidth="3" />
      <path d="M22 38h70" stroke="var(--color-teal-70)" strokeWidth="3" />
      <path d="M40 12v14M74 12v14" stroke="var(--color-teal-70)" strokeWidth="3" strokeLinecap="round" />
      <rect x="34" y="48" width="10" height="10" rx="2" fill="var(--color-bone-50)" />
      <rect x="52" y="48" width="10" height="10" rx="2" fill="var(--color-orange-50)" />
      <rect x="70" y="48" width="10" height="10" rx="2" fill="var(--color-bone-50)" />
      <rect x="34" y="64" width="10" height="10" rx="2" fill="var(--color-bone-50)" />
      <circle cx="92" cy="72" r="16" fill="var(--color-green-10)" />
      <path d="m85 72 5 5 9-10" stroke="var(--color-green-90)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PlantArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <path d="M40 58V30" stroke="var(--color-green-90)" strokeWidth="3" />
      <circle cx="40" cy="24" r="9" fill="var(--color-green-50)" stroke="var(--color-green-90)" strokeWidth="3" />
      <circle cx="28" cy="40" r="6" fill="var(--color-green-50)" stroke="var(--color-green-90)" strokeWidth="2.5" />
      <path d="M22 18c4-6 10-6 13-3" stroke="var(--color-teal-50)" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 56h36l-4 18H26Z" fill="var(--color-orange-90)" />
      <rect x="18" y="52" width="44" height="7" rx="2" fill="var(--color-orange-70)" />
    </svg>
  )
}

/** "Setting up" loader — the three Tala shapes bouncing in turn. */
export function ShapesLoader() {
  const shapes = [
    <path key="a" d="M2 22a10 10 0 0 1 20 0Z" fill="var(--color-teal-50)" />,
    <path key="b" d="M12 4 22 22H2Z" fill="var(--color-orange-50)" />,
    <path key="c" d="M2 22V4a18 18 0 0 1 18 18Z" fill="var(--color-green-50)" />,
  ]
  return (
    <div className="flex items-end gap-4" aria-label="Loading">
      {shapes.map((shape, i) => (
        <motion.svg
          key={i}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        >
          {shape}
        </motion.svg>
      ))}
    </div>
  )
}

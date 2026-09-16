import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cx } from '../lib/cx'
import { ArrowLeft, Close, Coin, Gift, Home, Person, Wallet } from './icons'

// ── Brand ─────────────────────────────────────────────────────────────────────

export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 24" fill="currentColor" className={className} aria-label="Tala">
      <path fillRule="evenodd" clipRule="evenodd" d="M77.0485 16.183V10.857C77.0485 7.00712 73.864 3.88642 69.9359 3.88642C66.0076 3.88642 62.8232 7.00712 62.8232 10.857V16.183H77.0485ZM77.0485 23.9999V19.0409H62.8232V23.9999H59.8721V10.7516C59.8721 5.30288 64.3803 0.88645 69.9402 0.888795C75.4965 0.890945 79.9997 5.3062 79.9997 10.7516V23.9999H77.0485Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M24.8372 16.0014H34.4725L29.5383 6.3127L24.8372 16.0014ZM23.4847 18.7199L20.846 24H17.502L29.4958 0L42.0051 24H38.6383L35.8861 18.7199H23.4847Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M20.1276 0.888794H0V3.80473H8.58867V23.9999H11.5389V3.80473H20.1276V0.888794Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M47.5897 21.0836V0.888794H44.6309V23.9958V23.9999H56.8825V21.0836H47.5897Z" />
    </svg>
  )
}

// ── Device status bar (desktop phone frame only) ──────────────────────────────

export function StatusBar({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  return (
    <div
      className={cx(
        'type-label-1 hidden h-11 shrink-0 items-center justify-between px-8 pt-1 lg:flex',
        tone === 'dark' ? 'text-dark-green-70' : 'text-bone-0',
        className,
      )}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
          <path d="M24 4v4c.8-.3 1.3-1.1 1.3-2S24.8 4.3 24 4Z" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  )
}

// ── Navigation (§7.5) ─────────────────────────────────────────────────────────

export function TopNavHome({ onProfile }: { onProfile?: () => void }) {
  return (
    <header className="flex shrink-0 items-center justify-between bg-bone-10 px-4 pb-2 pt-4">
      <Wordmark className="h-5 w-auto text-teal-50" />
      <div className="flex items-center gap-2">
        <span className="type-label-2 rounded-full border border-bone-50 px-4 py-2 text-dark-green-70">Help</span>
        <button type="button" onClick={onProfile} aria-label="Profile" className="grid size-8 place-items-center text-dark-green-50">
          <Person />
        </button>
      </div>
    </header>
  )
}

export function TopNav({ title, onBack, onClose }: { title: string; onBack?: () => void; onClose?: () => void }) {
  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center gap-2 bg-bone-0 px-2 shadow-surface-2-down">
      {onBack && (
        <button type="button" onClick={onBack} aria-label="Back" className="grid size-10 place-items-center rounded-full text-dark-green-70 active:bg-bone-20">
          <ArrowLeft />
        </button>
      )}
      <h1 className={cx('type-subheader-1 flex-1 truncate text-dark-green-70', !onBack && 'pl-2')}>{title}</h1>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full text-dark-green-70 active:bg-bone-20">
          <Close />
        </button>
      )}
    </header>
  )
}

export function CloseBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-end px-2">
      <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full text-dark-green-70 active:bg-bone-20">
        <Close />
      </button>
    </div>
  )
}

const TABS = [
  { id: 'home', label: 'Home', TabIcon: Home },
  { id: 'credit', label: 'Credit', TabIcon: Coin },
  { id: 'wallet', label: 'Wallet', TabIcon: Wallet },
  { id: 'growth', label: 'Growth', TabIcon: Gift },
] as const

export function BottomNav({ active = 'home' }: { active?: (typeof TABS)[number]['id'] }) {
  return (
    <nav className="relative z-10 grid h-16 shrink-0 grid-cols-4 bg-bone-0 shadow-surface-2-up">
      {TABS.map(({ id, label, TabIcon }) => {
        const on = id === active
        return (
          <div key={id} className={cx('flex flex-col items-center justify-center gap-1', on ? 'type-label-1 text-teal-50' : 'type-label-2 text-dark-green-30')}>
            <TabIcon strokeWidth={on ? 2.5 : 2} />
            <span>{label}</span>
          </div>
        )
      })}
    </nav>
  )
}

// ── Layout ────────────────────────────────────────────────────────────────────

export function ScreenLayout({
  header,
  footer,
  overlay,
  statusClassName = 'bg-bone-10',
  children,
}: {
  header?: ReactNode
  footer?: ReactNode
  overlay?: ReactNode
  statusClassName?: string
  children: ReactNode
}) {
  return (
    <div className="absolute inset-0 flex flex-col bg-bone-10">
      <StatusBar className={statusClassName} />
      {header}
      <div className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto">{children}</div>
      {footer}
      {overlay}
    </div>
  )
}

/** Sticky button zone — 24px top/bottom, 40px sides (§4). */
export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 flex shrink-0 flex-col gap-2 bg-bone-0 px-10 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 shadow-surface-2-up">
      {children}
    </div>
  )
}

export function BottomSheet({ children, onDismiss }: { children: ReactNode; onDismiss?: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <motion.div className="absolute inset-0 bg-dark-green-70/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onDismiss} />
      <motion.div
        className="relative rounded-t-lg bg-bone-0 px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-2 shadow-surface-2-up"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 32, stiffness: 320, delay: 0.1 }}
      >
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-bone-50" />
        {children}
      </motion.div>
    </div>
  )
}

export function Modal({ children, onDismiss }: { children: ReactNode; onDismiss?: () => void }) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center px-6">
      <motion.div className="absolute inset-0 bg-dark-green-70/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onDismiss} />
      <motion.div
        className="relative w-full overflow-hidden rounded-lg bg-bone-0 shadow-surface-2-up"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

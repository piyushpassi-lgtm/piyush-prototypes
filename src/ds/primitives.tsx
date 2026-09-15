import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Check, ChevronRight, type Icon } from './icons'

// ── Button (§7.1) ─────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
type ButtonColor = 'orange' | 'teal' | 'dark-green'

const BUTTON_COLORS: Record<ButtonColor, Record<ButtonVariant, string>> = {
  orange: {
    primary: 'bg-orange-50 text-bone-0 active:bg-orange-70',
    secondary: 'bg-bone-0 border-2 border-orange-50 text-orange-50 active:bg-orange-10',
    tertiary: 'text-orange-50 active:text-orange-70',
  },
  teal: {
    primary: 'bg-teal-50 text-bone-0 active:bg-teal-70',
    secondary: 'bg-bone-0 border-2 border-teal-50 text-teal-50 active:bg-teal-10',
    tertiary: 'text-teal-50 active:text-teal-70',
  },
  'dark-green': {
    primary: 'bg-dark-green-70 text-bone-0',
    secondary: 'bg-bone-0 border-2 border-dark-green-70 text-dark-green-70',
    tertiary: 'text-dark-green-30',
  },
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  color?: ButtonColor
  fullWidth?: boolean
}

export function Button({ variant = 'primary', color = 'orange', fullWidth = true, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        'type-label-1 inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 transition-colors disabled:cursor-not-allowed',
        variant === 'primary' ? 'disabled:bg-dark-green-30' : 'disabled:border-dark-green-30 disabled:text-dark-green-30',
        BUTTON_COLORS[color][variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function TextLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="type-action-link inline-flex items-center gap-1 text-orange-50">
      {children}
      <ChevronRight size={16} strokeWidth={2.5} />
    </button>
  )
}

// ── Surfaces ──────────────────────────────────────────────────────────────────

export function Card({ tone = 'white', className, children }: { tone?: 'white' | 'bone'; className?: string; children: ReactNode }) {
  return (
    <div className={cx('rounded-md', tone === 'white' ? 'bg-bone-0 shadow-surface-1' : 'bg-bone-30', className)}>{children}</div>
  )
}

type Tone = 'neutral' | 'teal' | 'orange' | 'success' | 'error'

const TAG_TONES: Record<Tone, string> = {
  neutral: 'bg-bone-30 text-dark-green-70',
  teal: 'bg-teal-10 text-teal-90',
  orange: 'bg-orange-10 text-orange-90',
  success: 'bg-green-10 text-dark-green-70',
  error: 'bg-red-10 text-red-90',
}

export function Tag({ tone = 'neutral', icon: TagIcon, children }: { tone?: Tone; icon?: Icon; children: ReactNode }) {
  return (
    <span className={cx('type-caption inline-flex items-center gap-1 rounded-sm px-2 py-1', TAG_TONES[tone])}>
      {TagIcon && <TagIcon size={16} />}
      {children}
    </span>
  )
}

type CalloutTone = 'info' | 'warning' | 'success' | 'error'

const CALLOUT_TONES: Record<CalloutTone, { box: string; icon: string }> = {
  info: { box: 'bg-teal-10/50 border-teal-50', icon: 'text-teal-90' },
  warning: { box: 'bg-orange-10 border-orange-50', icon: 'text-orange-70' },
  success: { box: 'bg-green-10/50 border-green-90', icon: 'text-green-90' },
  error: { box: 'bg-red-10/50 border-red-50', icon: 'text-red-50' },
}

export function Callout({ tone = 'info', icon: CalloutIcon, children }: { tone?: CalloutTone; icon?: Icon; children: ReactNode }) {
  const styles = CALLOUT_TONES[tone]
  return (
    <div className={cx('flex w-full gap-2 rounded-sm border-l-4 p-4 text-left', styles.box)}>
      {CalloutIcon && (
        <span className={cx('shrink-0', styles.icon)}>
          <CalloutIcon size={16} />
        </span>
      )}
      <p className="type-label-2 text-dark-green-70">{children}</p>
    </div>
  )
}

// ── Rows ──────────────────────────────────────────────────────────────────────

export function DetailRow({
  label,
  value,
  sub,
  action,
  last,
}: {
  label: ReactNode
  value: ReactNode
  sub?: ReactNode
  action?: ReactNode
  last?: boolean
}) {
  return (
    <div className={cx('flex gap-4 py-4', !last && 'border-b border-bone-50')}>
      <span className="type-body-1 shrink-0 text-dark-green-50">{label}</span>
      <span className="flex min-w-0 flex-1 flex-col items-end gap-1 text-right">
        <span className="type-label-1 text-dark-green-70">{value}</span>
        {sub && <span className="type-caption text-dark-green-50">{sub}</span>}
        {action}
      </span>
    </div>
  )
}

export function ListRow({
  icon: RowIcon,
  title,
  subtitle,
  onClick,
  tone = 'teal',
}: {
  icon?: Icon
  title: ReactNode
  subtitle?: ReactNode
  onClick?: () => void
  tone?: 'teal' | 'neutral'
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 px-4 py-4 text-left active:bg-bone-20">
      {RowIcon && (
        <span
          className={cx(
            'grid size-10 shrink-0 place-items-center rounded-full',
            tone === 'teal' ? 'bg-teal-10 text-teal-90' : 'bg-bone-20 text-dark-green-70',
          )}
        >
          <RowIcon />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="type-label-1 text-dark-green-70">{title}</span>
        {subtitle && <span className="type-body-2 text-dark-green-50">{subtitle}</span>}
      </span>
      <ChevronRight className="shrink-0 text-dark-green-50" />
    </button>
  )
}

// ── Selection controls (§7.2g, §7.2h) ─────────────────────────────────────────

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (next: boolean) => void; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cx(
          'grid size-6 shrink-0 place-items-center rounded-sm border-2 border-orange-50 transition-colors',
          checked ? 'bg-orange-50 text-bone-0' : 'bg-bone-0',
        )}
      >
        {checked && <Check size={16} strokeWidth={3} />}
      </button>
      <div className="type-body-1 select-none pt-1 text-dark-green-70" onClick={() => onChange(!checked)}>
        {children}
      </div>
    </div>
  )
}

export function Radio({ checked }: { checked: boolean }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-orange-50 bg-bone-0">
      {checked && <span className="size-3 rounded-full bg-orange-50" />}
    </span>
  )
}

export function RadioRow({
  checked,
  onSelect,
  title,
  subtitle,
  tag,
  last,
}: {
  checked: boolean
  onSelect: () => void
  title: ReactNode
  subtitle?: ReactNode
  tag?: ReactNode
  last?: boolean
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cx('flex w-full items-start gap-4 py-4 text-left', !last && 'border-b border-bone-50')}
    >
      <Radio checked={checked} />
      <span className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-1">
        <span className="type-label-1 text-dark-green-70">{title}</span>
        {subtitle && <span className="type-body-2 text-dark-green-50">{subtitle}</span>}
        {tag}
      </span>
    </button>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<[T, string]>
  value: T
  onChange: (next: T) => void
}) {
  return (
    <div className="grid grid-flow-col auto-cols-fr rounded-full bg-bone-30 p-1">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cx(
            'type-label-2 h-8 rounded-full transition-colors',
            value === id ? 'bg-bone-0 text-dark-green-70 shadow-surface-1' : 'text-dark-green-50',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

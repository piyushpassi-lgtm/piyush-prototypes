import type { ReactNode } from 'react'
import { BottomNav, ScreenLayout, TopNavHome } from '../../../ds/chrome'
import { Bank, Refresh } from '../../../ds/icons'
import { AutoPayArt } from '../../../ds/illustrations'
import { Button } from '../../../ds/primitives'
import { cx } from '../../../lib/cx'
import type { Account } from '../data'

export function HomeShell({ go, children, overlay }: { go: (id: string) => void; children: ReactNode; overlay?: ReactNode }) {
  return (
    <ScreenLayout header={<TopNavHome onProfile={() => go('profile')} />} footer={<BottomNav active="home" />} overlay={overlay}>
      {children}
    </ScreenLayout>
  )
}

/** Curved bottom edge of a hero section (public/Arc.svg, public/Arc with pattern.svg). */
export function ArcFooter({ pattern = true }: { pattern?: boolean }) {
  return (
    <img
      src={pattern ? 'Arc%20with%20pattern.svg' : 'Arc.svg'}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 w-full select-none"
    />
  )
}

function InstalmentRing({ n, total }: { n: number; total: number }) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  return (
    <span className="relative grid size-11 shrink-0 place-items-center">
      <svg viewBox="0 0 44 44" className="absolute inset-0 size-11 -rotate-90">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="var(--color-orange-30)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="var(--color-orange-50)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - n / total)}
        />
      </svg>
      <span className="type-caption relative text-dark-green-70">{n}</span>
    </span>
  )
}

/** Block 1 — repayment state of the home screen primary card (§7.3). */
export function RepaymentHero({
  title,
  amount,
  instalment,
  total,
  cta = 'Make payment',
  children,
}: {
  title: ReactNode
  amount: string
  instalment?: number
  total?: number
  cta?: string | null
  children?: ReactNode
}) {
  return (
    <section className="relative bg-bone-10 px-4 pb-20 pt-2">
      <div className="flex flex-col items-center gap-4">
        <h2 className="type-header-1 text-dark-green-70">{title}</h2>
        <div className="flex items-center gap-4">
          {instalment && total && <InstalmentRing n={instalment} total={total} />}
          <p className="type-display text-dark-green-70">{amount}</p>
        </div>
        {cta && (
          <Button fullWidth={false} className="px-16">
            {cta}
          </Button>
        )}
        {children}
      </div>
      <ArcFooter />
    </section>
  )
}

type StatusTone = 'on' | 'attention' | 'error'

const STATUS_TONES: Record<StatusTone, string> = {
  on: 'bg-green-10',
  attention: 'bg-orange-10',
  error: 'bg-red-10',
}

/** Auto-pay status on the repayment card: title, one line of detail, and a way into settings. */
export function AutoPayStatusCard({
  tone = 'on',
  title,
  body,
  onSettings,
  action,
}: {
  tone?: StatusTone
  title: string
  body: ReactNode
  onSettings?: () => void
  action?: ReactNode
}) {
  return (
    <div className={cx('flex w-full flex-col gap-4 rounded-md p-4 text-left', STATUS_TONES[tone])}>
      <div className="flex items-start gap-4">
        <span className="shrink-0 text-dark-green-70">
          <Refresh size={32} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="type-subheader-1 text-dark-green-70">{title}</span>
          <span className="type-body-1 text-dark-green-70">{body}</span>
        </div>
        {onSettings && (
          <button type="button" onClick={onSettings} className="type-action-link shrink-0 text-orange-50">
            Settings
          </button>
        )}
      </div>
      {action}
    </div>
  )
}

/** Block 2 — promo slot under the repayment card. */
export function PromoCard({
  title,
  body,
  linkLabel,
  onClick,
  art,
}: {
  title: string
  body: string
  linkLabel: string
  onClick?: () => void
  art: ReactNode
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-4 px-4 py-8 text-left">
      <span className="flex flex-1 flex-col items-start gap-2">
        <span className="type-subheader-1 text-dark-green-70">{title}</span>
        <span className="type-body-2 text-dark-green-50">{body}</span>
        <span className="type-action-link text-orange-50">{linkLabel}</span>
      </span>
      <span className="grid size-28 shrink-0 place-items-center rounded-md bg-teal-10">{art}</span>
    </button>
  )
}

export function AutoPayPromo({ onStart }: { onStart: () => void }) {
  return (
    <PromoCard
      title="Put your loans on auto-pilot"
      body="Never miss a due date. We collect each payment on its due date, and you can cancel any time."
      linkLabel="Set up Autopay"
      onClick={onStart}
      art={<AutoPayArt className="w-24" />}
    />
  )
}

export function AccountChip({ account }: { account: Account }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid size-6 place-items-center rounded-sm bg-teal-10 text-teal-90">
        <Bank size={16} />
      </span>
      <span className="type-label-1 text-dark-green-70">
        {account.bank} · {account.kind} ····{account.last4}
      </span>
    </span>
  )
}

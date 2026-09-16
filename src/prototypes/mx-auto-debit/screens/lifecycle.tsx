import type { ReactNode } from 'react'
import { ScreenLayout, TopNav } from '../../../ds/chrome'
import { Alert, Check, Clock, Plus, Refresh } from '../../../ds/icons'
import { PlantArt } from '../../../ds/illustrations'
import { Card, DetailRow, Tag, TextLink } from '../../../ds/primitives'
import { cx } from '../../../lib/cx'
import type { ScreenProps } from '../../types'
import { DUES, LOAN, accountLong, accountOf, accountShort } from '../data'
import { AutoPayStatusCard, HomeShell, PromoCard, RepaymentHero } from './shared'

function CashbackPromo() {
  return (
    <PromoCard
      title="Ready to start earning cashback?"
      body="Pay on time and earn cashback on your next loan."
      linkLabel="Learn more"
      art={<PlantArt className="w-20" />}
    />
  )
}

// ── Home card states around a debit ───────────────────────────────────────────

export function HomeAutoPayOn({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell go={go}>
      <RepaymentHero title={`Due ${DUES[0].date}`} amount={LOAN.instalment} instalment={1} total={LOAN.count}>
        <AutoPayStatusCard
          title="Autopay is on"
          body={`We'll collect it from ${accountShort(account)} on ${DUES[0].date}.`}
          onSettings={() => go('autopay-settings')}
        />
      </RepaymentHero>
      <CashbackPromo />
    </HomeShell>
  )
}

export function HomeNextPayment({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell go={go}>
      <RepaymentHero title={`Due ${DUES[1].date}`} amount={LOAN.instalment} instalment={2} total={LOAN.count}>
        <AutoPayStatusCard
          title="Autopay is on"
          body={`We'll collect it from ${accountShort(account)} on ${DUES[1].date}.`}
          onSettings={() => go('autopay-settings')}
        />
      </RepaymentHero>
      <CashbackPromo />
    </HomeShell>
  )
}

export function HomeReminder({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell go={go}>
      <RepaymentHero title="Due tomorrow" amount={LOAN.instalment} instalment={1} total={LOAN.count}>
        <AutoPayStatusCard
          tone="attention"
          title="Autopay runs tomorrow"
          body={`Keep ${LOAN.instalment} in ${accountShort(account)} so the payment goes through.`}
          onSettings={() => go('autopay-settings')}
        />
      </RepaymentHero>
      <CashbackPromo />
    </HomeShell>
  )
}

export function HomeProcessing({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell go={go}>
      <RepaymentHero title="Due today" amount={LOAN.instalment} instalment={1} total={LOAN.count}>
        <AutoPayStatusCard
          tone="attention"
          title="Autopay is in progress"
          body={`${account.bank} collects ${LOAN.instalment} between 6pm and midnight today. Please don't pay manually — you could be charged twice.`}
          onSettings={() => go('autopay-settings')}
        />
      </RepaymentHero>
      <CashbackPromo />
    </HomeShell>
  )
}

export function HomeFailed({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell go={go}>
      <RepaymentHero title={`Due ${DUES[0].date}`} amount={LOAN.instalment} instalment={1} total={LOAN.count}>
        <AutoPayStatusCard
          tone="error"
          title="Autopay didn't go through"
          body={`${account.bank} couldn't send ${LOAN.instalment}, often because the balance was too low. Pay by ${LOAN.graceUntil} to avoid a late fee.`}
          onSettings={() => go('autopay-settings')}
        />
      </RepaymentHero>
      <CashbackPromo />
    </HomeShell>
  )
}

// ── Payment history ───────────────────────────────────────────────────────────

type EntryStatus = 'paid' | 'scheduled' | 'fee' | 'refund' | 'disbursed'

type LoanEntry = { date: string; title: string; detail: string; amount?: string; status: EntryStatus; to?: string }

const STATUS_STYLES: Record<EntryStatus, { box: string; icon: typeof Check }> = {
  disbursed: { box: 'bg-teal-10 text-teal-90', icon: Check },
  paid: { box: 'bg-green-10 text-green-90', icon: Check },
  scheduled: { box: 'border-2 border-bone-50 bg-bone-10 text-dark-green-50', icon: Clock },
  fee: { box: 'bg-red-10 text-red-50', icon: Alert },
  refund: { box: 'bg-bone-30 text-dark-green-70', icon: Plus },
}

function EntryRow({ entry, last, onOpen }: { entry: LoanEntry; last: boolean; onOpen?: () => void }) {
  const style = STATUS_STYLES[entry.status]
  const Marker = style.icon
  const Row = entry.to ? 'button' : 'div'
  return (
    <li className="flex gap-3">
      <span className="relative flex w-6 shrink-0 justify-center">
        {!last && <span className="absolute bottom-0 top-8 w-px bg-bone-50" />}
        <span className={cx('relative mt-4 grid size-6 place-items-center rounded-full', style.box)}>
          <Marker size={16} strokeWidth={2.5} />
        </span>
      </span>
      <Row
        {...(entry.to ? { type: 'button' as const, onClick: onOpen } : {})}
        className={cx('flex flex-1 items-start justify-between gap-2 py-4 text-left', !last && 'border-b border-bone-50')}
      >
        <span className="flex flex-col gap-1">
          <span className="type-label-1 text-dark-green-70">{entry.title}</span>
          <span className="type-body-2 text-dark-green-50">{entry.detail}</span>
          <span className="type-caption text-dark-green-50">{entry.date}</span>
        </span>
        {entry.amount && (
          <span className={cx('type-label-1 shrink-0', entry.status === 'scheduled' ? 'text-dark-green-50' : 'text-dark-green-70')}>
            {entry.amount}
          </span>
        )}
      </Row>
    </li>
  )
}

const ACTIVE_LOAN: LoanEntry[] = [
  { date: '15 Sep 2026', title: 'Payment 1 of 6', detail: 'Paid by Autopay', amount: LOAN.instalment, status: 'paid', to: 'debit-detail' },
  ...DUES.slice(1).map(
    (d): LoanEntry => ({
      date: `${d.full}`,
      title: `Payment ${d.n} of 6`,
      detail: `Autopay collects it on ${d.date}`,
      amount: LOAN.instalment,
      status: 'scheduled',
    }),
  ),
  { date: '1 Sep 2026', title: 'Loan received', detail: 'Sent to BBVA ····8367', amount: `+${LOAN.amount}`, status: 'disbursed' },
]

const CLOSED_LOAN: LoanEntry[] = [
  { date: '12 Jun 2026', title: 'Payment 4 of 4', detail: 'Paid at OXXO', amount: '$520.00', status: 'paid' },
  { date: '29 May 2026', title: 'Late fee', detail: 'Payment 3 was 2 days late', amount: '$50.00', status: 'fee' },
  { date: '31 May 2026', title: 'Payment 3 of 4', detail: 'Paid in the app', amount: '$520.00', status: 'paid' },
  { date: '15 May 2026', title: 'Refund', detail: 'Duplicate payment returned to you', amount: '+$520.00', status: 'refund' },
  { date: '15 Mar 2026', title: 'Loan received', detail: 'Sent to BBVA ····8367', amount: '+$2,000.00', status: 'disbursed' },
]

function LoanCard({
  title,
  subtitle,
  tag,
  entries,
  header,
  onOpenEntry,
}: {
  title: string
  subtitle: string
  tag: ReactNode
  entries: LoanEntry[]
  header?: ReactNode
  onOpenEntry?: (id: string) => void
}) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="type-subheader-1 text-dark-green-70">{title}</h3>
          <p className="type-body-2 text-dark-green-50">{subtitle}</p>
        </div>
        {tag}
      </div>
      {header}
      <ol className="flex flex-col">
        {entries.map((entry, i) => (
          <EntryRow
            key={`${entry.title}-${entry.date}`}
            entry={entry}
            last={i === entries.length - 1}
            onOpen={entry.to && onOpenEntry ? () => onOpenEntry(entry.to!) : undefined}
          />
        ))}
      </ol>
    </Card>
  )
}

export function LoanTimeline({ go, back, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <ScreenLayout statusClassName="bg-bone-0" header={<TopNav title="Payment history" onBack={back} />}>
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
        <LoanCard
          title={`Loan · ${LOAN.amount}`}
          subtitle={`Taken 1 September 2026 · ${LOAN.count} payments`}
          tag={<Tag tone="teal">Active</Tag>}
          entries={ACTIVE_LOAN}
          onOpenEntry={(id) => go(id)}
          header={
            <div className="flex flex-col gap-3">
              <div className="h-2 overflow-hidden rounded-full bg-bone-30">
                <div className="h-full w-1/6 rounded-full bg-teal-50" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Tag tone="teal" icon={Refresh}>
                  Autopay · {accountShort(account)}
                </Tag>
                <button type="button" onClick={() => go('autopay-settings')} className="type-action-link text-orange-50">
                  Manage
                </button>
              </div>
            </div>
          }
        />

        <LoanCard
          title="Loan · $2,000.00"
          subtitle="March – June 2026 · Paid in full"
          tag={<Tag tone="neutral">Closed</Tag>}
          entries={CLOSED_LOAN}
        />
      </div>
    </ScreenLayout>
  )
}

export function DebitDetail({ back, state }: ScreenProps) {
  const account = accountOf(state)
  const steps = [
    { title: `Request sent to ${account.bank}`, time: 'Tue 15 Sep, 2:30pm' },
    { title: 'Money left your account', time: 'Tue 15 Sep, 6pm – 12am' },
    { title: 'Tala confirmed your payment', time: 'Wed 16 Sep, 11:48am' },
  ]
  return (
    <ScreenLayout statusClassName="bg-bone-0" header={<TopNav title="Payment 1 of 6" onBack={back} />}>
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-green-10 text-green-90">
            <Check size={32} strokeWidth={2.5} />
          </span>
          <p className="type-display text-dark-green-70">{LOAN.instalment}</p>
          <Tag tone="success">Paid by Autopay</Tag>
        </div>

        <Card className="flex flex-col gap-4 p-4">
          <h3 className="type-subheader-2 text-dark-green-70">How it went</h3>
          <ol className="flex flex-col">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="relative flex w-6 justify-center">
                  {i < steps.length - 1 && <span className="absolute bottom-0 top-6 w-px bg-teal-50" />}
                  <span className="relative grid size-6 place-items-center rounded-full bg-teal-50 text-bone-0">
                    <Check size={16} strokeWidth={3} />
                  </span>
                </span>
                <span className={cx('flex flex-col gap-1', i < steps.length - 1 && 'pb-4')}>
                  <span className="type-label-1 text-dark-green-70">{step.title}</span>
                  <span className="type-caption text-dark-green-50">{step.time}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="px-4">
          <DetailRow label="From" value={accountLong(account)} />
          <DetailRow label="On your statement" value="TALA" />
          <DetailRow label="For" value={`${DUES[0].date} payment`} />
          <DetailRow label="Reference" value="TL-MX-0915-48213" last />
        </Card>

        <Card tone="bone" className="flex flex-col items-start gap-2 p-4">
          <h3 className="type-subheader-1 text-dark-green-70">Don't recognise this charge?</h3>
          <p className="type-body-2 text-dark-green-70">Talk to us before contacting your bank. We can check it and sort it out faster.</p>
          <TextLink>Contact support</TextLink>
        </Card>
      </div>
    </ScreenLayout>
  )
}

import { ScreenLayout, TopNav } from '../../../ds/chrome'
import { Alert, Check, Clock, Info, Refresh } from '../../../ds/icons'
import { Button, Callout, Card, DetailRow, Tag, TextLink } from '../../../ds/primitives'
import { cx } from '../../../lib/cx'
import type { ScreenProps } from '../../types'
import { DUES, LOAN, accountLong, accountOf, accountShort } from '../data'
import { HomeShell, LoanLinks, RepaymentHero } from './shared'

// ── Home card states around a debit ───────────────────────────────────────────

export function HomeAutoPayOn({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell>
      <RepaymentHero top={<Tag tone="teal" icon={Refresh}>Auto-pay on</Tag>} title={`Due ${DUES[0].date}`} amount={LOAN.instalment}>
        <p className="type-body-2 text-dark-green-50">
          We'll collect it from {accountShort(account)} on {DUES[0].date}. Nothing to do.
        </p>
        <Button variant="tertiary" fullWidth={false}>
          Pay manually instead
        </Button>
      </RepaymentHero>
      <LoanLinks go={go} account={account} />
    </HomeShell>
  )
}

export function HomeReminder({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell>
      <RepaymentHero top={<Tag tone="teal" icon={Refresh}>Auto-pay tomorrow</Tag>} title="Due tomorrow" amount={LOAN.instalment}>
        <Callout tone="warning" icon={Clock}>
          Keep {LOAN.instalment} in {accountShort(account)} tonight. We send the request to your bank this afternoon.
        </Callout>
        <Button variant="tertiary" fullWidth={false} onClick={() => go('pause-sheet')}>
          Skip this collection
        </Button>
      </RepaymentHero>
      <LoanLinks go={go} account={account} />
    </HomeShell>
  )
}

function ProgressSteps({ current }: { current: number }) {
  const steps = ['Requested', 'Bank sending', 'Confirmed']
  return (
    <ol className="grid w-full grid-cols-3">
      {steps.map((label, i) => (
        <li key={label} className="relative flex flex-col items-center gap-2">
          {i > 0 && <span className={cx('absolute right-1/2 top-2 h-1 w-full', i <= current ? 'bg-teal-50' : 'bg-bone-50')} />}
          <span
            className={cx(
              'relative grid size-5 place-items-center rounded-full',
              i < current && 'bg-teal-50 text-bone-0',
              i === current && 'bg-bone-0 ring-4 ring-teal-50',
              i > current && 'bg-bone-50',
            )}
          >
            {i < current && <Check size={16} strokeWidth={3} />}
          </span>
          <span className={cx('type-caption', i <= current ? 'text-dark-green-70' : 'text-dark-green-50')}>{label}</span>
        </li>
      ))}
    </ol>
  )
}

export function HomeProcessing({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell>
      <RepaymentHero top={<Tag tone="teal" icon={Clock}>Auto-pay in progress</Tag>} title="Due today" amount={LOAN.instalment}>
        <ProgressSteps current={1} />
        <Callout tone="warning" icon={Info}>
          No need to pay now. If you pay manually as well, you could be charged twice.
        </Callout>
        <p className="type-caption text-dark-green-50">
          {account.bank} is sending the money. We'll confirm by 12pm today.
        </p>
      </RepaymentHero>
      <LoanLinks go={go} account={account} />
    </HomeShell>
  )
}

export function HomePaid({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell>
      <RepaymentHero top={<Tag tone="success" icon={Check}>Paid by auto-pay</Tag>} title={`Next due ${DUES[1].date}`} amount={LOAN.instalment}>
        <p className="type-body-2 text-dark-green-50">
          We collected {LOAN.instalment} for {DUES[0].date}. Auto-pay will collect your next payment too.
        </p>
        <TextLink onClick={() => go('debit-detail')}>View payment</TextLink>
      </RepaymentHero>
      <LoanLinks go={go} account={account} />
    </HomeShell>
  )
}

export function HomeFailed({ go, state }: ScreenProps) {
  const account = accountOf(state)
  return (
    <HomeShell>
      <RepaymentHero
        top={<span className="type-label-1 flex items-center gap-1 text-red-50"><Alert size={16} />Auto-pay didn't go through</span>}
        title={`Due ${DUES[0].date}`}
        amount={LOAN.instalment}
      >
        <p className="type-body-2 text-dark-green-70">
          {account.bank} couldn't send the money, often because the balance was too low. Pay by {LOAN.graceUntil} to avoid a late fee.
        </p>
        <div className="flex flex-col items-center gap-2">
          <Button fullWidth={false} className="px-16">
            Make payment
          </Button>
          <Button variant="tertiary" fullWidth={false}>
            Help with payment?
          </Button>
        </div>
      </RepaymentHero>
      <LoanLinks go={go} account={account} />
    </HomeShell>
  )
}

// ── Payment history ───────────────────────────────────────────────────────────

type EventStatus = 'done' | 'paid' | 'scheduled'

export function LoanTimeline({ go, back, state }: ScreenProps) {
  const account = accountOf(state)
  const events: Array<{ date: string; title: string; detail: string; status: EventStatus; amount?: string; to?: string }> = [
    { date: '1 Sep', title: 'Loan received', detail: `Sent to ${accountShort(account)}`, status: 'done', amount: `+${LOAN.amount}` },
    { date: '3 Sep', title: 'Auto-pay turned on', detail: `Collecting from ${accountShort(account)}`, status: 'done' },
    { date: DUES[0].short, title: 'Payment 1 of 6', detail: 'Paid by auto-pay', status: 'paid', amount: LOAN.instalment, to: 'debit-detail' },
    ...DUES.slice(1).map((d) => ({
      date: d.short,
      title: `Payment ${d.n} of 6`,
      detail: `Auto-pay requests it on ${d.request}`,
      status: 'scheduled' as const,
      amount: LOAN.instalment,
    })),
  ]

  return (
    <ScreenLayout statusClassName="bg-bone-0" header={<TopNav title="Your loan" onBack={back} />}>
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
        <Card className="flex flex-col gap-4 p-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="type-body-2 text-dark-green-50">Paid so far</span>
              <span className="type-header-1 text-dark-green-70">{LOAN.instalment}</span>
            </div>
            <span className="type-body-2 text-dark-green-50">of {LOAN.total}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bone-30">
            <div className="h-full w-1/6 rounded-full bg-teal-50" />
          </div>
          <button type="button" onClick={() => go('autopay-settings')} className="flex items-center justify-between gap-2 text-left">
            <Tag tone="teal" icon={Refresh}>Auto-pay on</Tag>
            <span className="type-action-link text-orange-50">Manage</span>
          </button>
        </Card>

        <ol className="flex flex-col">
          {events.map((event, i) => {
            const Row = event.to ? 'button' : 'div'
            return (
              <li key={event.title} className="flex gap-4">
                <span className="type-caption w-12 shrink-0 pt-4 text-right text-dark-green-50">{event.date}</span>
                <span className="relative flex w-6 shrink-0 justify-center">
                  {i < events.length - 1 && <span className="absolute bottom-0 top-8 w-px bg-bone-50" />}
                  <span
                    className={cx(
                      'relative mt-4 grid size-6 place-items-center rounded-full',
                      event.status === 'done' && 'bg-teal-10 text-teal-90',
                      event.status === 'paid' && 'bg-green-10 text-green-90',
                      event.status === 'scheduled' && 'border-2 border-bone-50 bg-bone-10 text-dark-green-50',
                    )}
                  >
                    {event.status === 'scheduled' ? <Clock size={16} /> : <Check size={16} strokeWidth={3} />}
                  </span>
                </span>
                <Row
                  {...(event.to ? { type: 'button' as const, onClick: () => go(event.to!) } : {})}
                  className="flex flex-1 items-start justify-between gap-2 border-b border-bone-50 py-4 text-left"
                >
                  <span className="flex flex-col gap-1">
                    <span className="type-label-1 text-dark-green-70">{event.title}</span>
                    <span className="type-body-2 text-dark-green-50">{event.detail}</span>
                  </span>
                  {event.amount && (
                    <span className={cx('type-label-1', event.status === 'scheduled' ? 'text-dark-green-50' : 'text-dark-green-70')}>
                      {event.amount}
                    </span>
                  )}
                </Row>
              </li>
            )
          })}
        </ol>
      </div>
    </ScreenLayout>
  )
}

export function DebitDetail({ back, state }: ScreenProps) {
  const account = accountOf(state)
  const steps = [
    { title: `Request sent to ${account.bank}`, time: 'Mon 14 Sep, 2:30pm' },
    { title: 'Money left your account', time: 'Mon 14 Sep, evening' },
    { title: 'Tala confirmed your payment', time: 'Tue 15 Sep, 11:48am' },
  ]
  return (
    <ScreenLayout statusClassName="bg-bone-0" header={<TopNav title="Payment 1 of 6" onBack={back} />}>
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-green-10 text-green-90">
            <Check size={32} strokeWidth={2.5} />
          </span>
          <p className="type-display text-dark-green-70">{LOAN.instalment}</p>
          <Tag tone="success">Paid by auto-pay</Tag>
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

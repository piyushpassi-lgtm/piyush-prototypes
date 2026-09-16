import { useState } from 'react'
import { CloseBar, Modal, ScreenLayout, StickyFooter, TopNav } from '../../../ds/chrome'
import { Bank, Close, Refresh } from '../../../ds/icons'
import { AutoPayArt, SuccessArt } from '../../../ds/illustrations'
import { Button, Card, DetailRow, Switch, Tag } from '../../../ds/primitives'
import type { ScreenProps } from '../../types'
import { ACCOUNTS, CUSTOMER, DUES, LOAN, accountShort } from '../data'
import { AutoPayPromo, HomeShell, RepaymentHero } from './shared'

const DueHero = () => <RepaymentHero title={`Due ${DUES[0].date}`} amount={LOAN.instalment} instalment={1} total={LOAN.count} />

function BankSummary() {
  const bbva = ACCOUNTS.bbva
  return (
    <Card tone="bone" className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-bone-0 text-teal-90">
          <Bank size={16} />
        </span>
        <span className="type-subheader-1 flex-1 text-dark-green-70">{bbva.bankFull}</span>
        <span className="type-action-link text-orange-50">Edit</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="type-body-1 text-dark-green-50">CLABE</span>
        <span className="type-label-1 text-dark-green-70">{bbva.number}</span>
      </div>
      <div className="flex justify-between gap-4 border-t border-bone-50 pt-4">
        <span className="type-subheader-1 text-dark-green-70">You'll receive</span>
        <span className="type-subheader-1 text-dark-green-70">{LOAN.amount}</span>
      </div>
    </Card>
  )
}

// ── Entry point 1 — at disbursement (new to Autopay) ──────────────────────────

export function DisbursementReview({ go, back, setState }: ScreenProps) {
  return (
    <ScreenLayout
      statusClassName="bg-bone-0"
      header={<TopNav title="Receive $3,000" onBack={back} />}
      footer={
        <StickyFooter>
          <Button
            onClick={() => {
              setState({ source: 'disbursement', account: 'bbva' })
              go('consent')
            }}
          >
            Confirm
          </Button>
        </StickyFooter>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
        <h2 className="type-header-1 text-dark-green-70">Review your details</h2>
        <Card className="px-4">
          <DetailRow label="Name" value={CUSTOMER.name} />
          <DetailRow label="Mobile number" value={CUSTOMER.phone} last />
        </Card>
        <BankSummary />
      </div>
    </ScreenLayout>
  )
}

// ── Entry point 1b — at disbursement, returning customer ──────────────────────

export function DisbursementReturning({ go, back, setState }: ScreenProps) {
  const [autopay, setAutopay] = useState(true)
  const account = ACCOUNTS.bbva

  return (
    <ScreenLayout
      statusClassName="bg-bone-0"
      header={<TopNav title="Receive $3,000" onBack={back} />}
      footer={
        <StickyFooter>
          <Button
            onClick={() => {
              setState({ source: 'disbursement', account: 'bbva' })
              go(autopay ? 'setting-up' : 'money-on-way')
            }}
          >
            Confirm
          </Button>
        </StickyFooter>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
        <h2 className="type-header-1 text-dark-green-70">Review your details</h2>
        <Card className="px-4">
          <DetailRow label="Name" value={CUSTOMER.name} />
          <DetailRow label="Mobile number" value={CUSTOMER.phone} last />
        </Card>
        <BankSummary />

        <Card className="flex flex-col gap-4 p-4">
          <div className="flex items-start gap-4">
            <span className="shrink-0 text-teal-90">
              <Refresh size={32} />
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <span className="type-subheader-1 text-dark-green-70">Repay this loan automatically</span>
              <span className="type-body-2 text-dark-green-50">
                {LOAN.instalment} from {accountShort(account)} on each due date, starting {DUES[0].date}.
              </span>
            </div>
            <Switch checked={autopay} onChange={setAutopay} ariaLabel="Repay this loan automatically" />
          </div>
          <button
            type="button"
            onClick={() => {
              setState({ source: 'disbursement', account: 'bbva' })
              go('consent')
            }}
            className="type-action-link self-start text-orange-50"
          >
            See the details
          </button>
        </Card>
      </div>
    </ScreenLayout>
  )
}

// ── Entry point 2 — home screen card ──────────────────────────────────────────

export function HomeCardEntry({ go, setState }: ScreenProps) {
  const start = () => {
    setState({ source: 'home-card' })
    go('consent')
  }
  return (
    <HomeShell go={go}>
      <DueHero />
      <AutoPayPromo onStart={start} />
    </HomeShell>
  )
}

// ── Entry point 3 — in-app message ────────────────────────────────────────────

export function InAppMessage({ go, setState }: ScreenProps) {
  const dismiss = () => go('home-card', { replace: true })
  return (
    <HomeShell
      go={go}
      overlay={
        <Modal onDismiss={dismiss}>
          <div className="relative grid h-40 place-items-center bg-teal-10">
            <AutoPayArt className="w-40" />
            <button
              type="button"
              aria-label="Close"
              onClick={dismiss}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-bone-0/70 text-dark-green-70"
            >
              <Close size={16} />
            </button>
          </div>
          <div className="flex flex-col items-center gap-2 px-6 pb-6 pt-6 text-center">
            <Tag tone="neutral">Autopay</Tag>
            <h2 className="type-header-2 text-dark-green-70">Never miss a due date again</h2>
            <p className="type-body-1 text-dark-green-50">
              Let us collect your {LOAN.instalment} on {DUES[0].date}, and every due date after. We'll tell you the day before.
              Cancel whenever you like.
            </p>
            <div className="flex w-full flex-col gap-2 pt-4">
              <Button
                onClick={() => {
                  setState({ source: 'in-app' })
                  go('consent')
                }}
              >
                Set up Autopay
              </Button>
              <Button variant="tertiary" onClick={dismiss}>
                Maybe later
              </Button>
            </div>
          </div>
        </Modal>
      }
    >
      <DueHero />
    </HomeShell>
  )
}

// ── Entry point 5 — after a manual payment (exploration) ──────────────────────

export function PostPaymentUpsell({ go, setState }: ScreenProps) {
  const done = () => go('home-card')
  return (
    <ScreenLayout
      header={<CloseBar onClose={done} />}
      footer={
        <StickyFooter>
          <Button onClick={done}>Done</Button>
        </StickyFooter>
      }
    >
      <div className="flex flex-col gap-8 px-6 pb-8 pt-2">
        <div className="flex flex-col items-center gap-4 text-center">
          <SuccessArt className="size-24" />
          <div className="flex flex-col gap-2">
            <h1 className="type-header-1 text-dark-green-70">Payment received</h1>
            <p className="type-display text-dark-green-70">{LOAN.instalment}</p>
            <p className="type-body-1 text-dark-green-50">
              Thanks, {CUSTOMER.firstName}. Your next payment is {LOAN.instalment} on {DUES[1].date}.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-md bg-teal-10 p-4">
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bone-0 text-teal-90">
              <Refresh />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="type-subheader-1 text-dark-green-70">Make the next one automatic?</h3>
              <p className="type-body-2 text-dark-green-70">
                Turn on Autopay and we'll collect {LOAN.instalment} on {DUES[1].date}. Cancel any time.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setState({ source: 'post-payment' })
              go('consent')
            }}
          >
            Set up Autopay
          </Button>
        </div>
      </div>
    </ScreenLayout>
  )
}

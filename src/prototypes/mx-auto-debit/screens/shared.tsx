import type { ReactNode } from 'react'
import { BottomNav, ScreenLayout, TopNavHome } from '../../../ds/chrome'
import { Bank, Clock, Refresh } from '../../../ds/icons'
import { PlantArt } from '../../../ds/illustrations'
import { Card, ListRow } from '../../../ds/primitives'
import type { Account } from '../data'
import { accountShort } from '../data'

export function HomeShell({ children, overlay }: { children: ReactNode; overlay?: ReactNode }) {
  return (
    <ScreenLayout header={<TopNavHome />} footer={<BottomNav active="home" />} overlay={overlay}>
      {children}
      <CashbackPromo />
    </ScreenLayout>
  )
}

/** Block 1 — repayment state of the home screen primary card (§7.3). */
export function RepaymentHero({
  top,
  title,
  amount,
  children,
}: {
  top?: ReactNode
  title: ReactNode
  amount: string
  children?: ReactNode
}) {
  return (
    <section className="flex flex-col items-center gap-2 rounded-b-xl bg-bone-20 px-4 pb-8 pt-6 text-center">
      {top}
      <h2 className="type-header-1 text-dark-green-70">{title}</h2>
      <p className="type-display text-dark-green-70">{amount}</p>
      {children && <div className="mt-2 flex w-full flex-col items-center gap-4">{children}</div>}
    </section>
  )
}

export function CashbackPromo() {
  return (
    <div className="flex items-center gap-4 px-4 py-8">
      <div className="flex flex-1 flex-col items-start gap-2">
        <h3 className="type-subheader-1 text-dark-green-70">Ready to start earning cashback?</h3>
        <p className="type-body-2 text-dark-green-50">Pay on time and earn cashback on your next loan.</p>
        <span className="type-action-link text-orange-50">Learn more</span>
      </div>
      <div className="grid size-28 shrink-0 place-items-center rounded-md bg-teal-10">
        <PlantArt className="w-20" />
      </div>
    </div>
  )
}

export function LoanLinks({ go, account }: { go: (id: string) => void; account: Account }) {
  return (
    <div className="px-4 pt-6">
      <Card className="divide-y divide-bone-50">
        <ListRow icon={Clock} title="Payment history" subtitle="Every payment and auto-pay attempt" onClick={() => go('loan-timeline')} />
        <ListRow icon={Refresh} title="Auto-pay settings" subtitle={`${accountShort(account)} · each due date`} onClick={() => go('autopay-settings')} />
      </Card>
    </div>
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

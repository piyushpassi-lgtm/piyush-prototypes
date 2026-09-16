import type { ReactNode } from 'react'
import { ScreenLayout, TopNav } from '../../../ds/chrome'
import { Check, Clock, Gift, Globe, Help, Lock, Logout, Refresh, Shield, TextSize } from '../../../ds/icons'
import { Card, ListRow, Tag } from '../../../ds/primitives'
import type { ScreenProps } from '../../types'
import { CUSTOMER, accountLong, accountOf } from '../data'
import { ArcFooter } from './shared'

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col">
      <span className="type-body-1 px-4 pt-4 text-dark-green-50">{label}</span>
      <div className="divide-y divide-bone-50">{children}</div>
    </Card>
  )
}

export function Profile({ go, back, state }: ScreenProps) {
  const account = accountOf(state)

  return (
    <ScreenLayout statusClassName="bg-bone-0" header={<TopNav title="Profile & settings" onBack={back} />}>
      <section className="relative flex flex-col items-center gap-1 bg-teal-10 px-6 pb-20 pt-6 text-center">
        <span className="type-header-1 grid size-24 place-items-center rounded-full bg-teal-30 text-teal-90">LS</span>
        <span className="type-header-2 mt-3 flex items-center gap-2 text-dark-green-70">
          {CUSTOMER.name}
          <span className="grid size-5 place-items-center rounded-full bg-teal-50 text-bone-0">
            <Check size={16} strokeWidth={3} />
          </span>
        </span>
        <span className="type-body-1 text-dark-green-70">with Tala since 2025</span>
        <span className="type-label-1 text-teal-90">{CUSTOMER.phone}</span>
        <button type="button" className="type-action-link text-orange-50">
          Edit profile
        </button>
        <ArcFooter pattern={false} />
      </section>

      <div className="flex flex-col gap-4 px-4 pb-8 pt-2">
        <Group label="Your account">
          <ListRow
            icon={Shield}
            title="Identity verification"
            subtitle="Valid till Jan 2027"
            trailing={<Tag tone="success">Verified</Tag>}
          />
          <ListRow icon={Lock} title="Security & login" subtitle="Manage password and biometrics" />
        </Group>

        <Group label="Payments">
          <ListRow
            icon={Refresh}
            title="Autopay"
            subtitle={accountLong(account)}
            trailing={<Tag tone="success">Active</Tag>}
            onClick={() => go('autopay-settings')}
          />
          <ListRow
            icon={Clock}
            title="Payment history"
            subtitle="All your payments, fees and refunds"
            onClick={() => go('loan-timeline')}
          />
        </Group>

        <Group label="Preferences">
          <ListRow icon={TextSize} title="Display" subtitle="Text size and theme" />
          <ListRow icon={Globe} title="Language" subtitle="English" />
        </Group>

        <Group label="Earnings">
          <ListRow icon={Gift} title="Invite your friends to Tala" subtitle="Refer a friend and earn $100" />
        </Group>

        <Group label="Support">
          <ListRow icon={Help} title="Get help" subtitle="Talk to us" />
        </Group>

        <Card>
          <ListRow tone="error" icon={Logout} title="Log out" />
        </Card>
      </div>
    </ScreenLayout>
  )
}

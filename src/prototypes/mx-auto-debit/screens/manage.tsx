import { useState } from 'react'
import { BottomSheet, CloseBar, ScreenLayout, StickyFooter, TopNav } from '../../../ds/chrome'
import { Bank, Calendar, Clock, File, Info, Pause, Power, Refresh } from '../../../ds/icons'
import { Button, Callout, Card, DetailRow, ListRow, RadioRow, Tag } from '../../../ds/primitives'
import type { ScreenProps } from '../../types'
import { DUES, LOAN, accountLong, accountOf, accountShort } from '../data'

function SettingsBody({ go, state }: Pick<ScreenProps, 'go' | 'state'>) {
  const account = accountOf(state)
  return (
    <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
      <Card className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <Tag tone="teal" icon={Refresh}>On</Tag>
          <span className="type-caption text-dark-green-50">Since 3 September</span>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="type-header-2 text-dark-green-70">Next collection</h2>
          <p className="type-body-1 text-dark-green-50">
            {LOAN.instalment} for {DUES[1].date}, requested on {DUES[1].request}
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        <h3 className="type-label-2 px-1 text-dark-green-50">Details</h3>
        <Card className="divide-y divide-bone-50">
          <ListRow icon={Bank} title="Collect from" subtitle={accountLong(account)} onClick={() => go('choose-account')} />
          <ListRow icon={Calendar} title="Collection day" subtitle="On each due date" onClick={() => go('change-date')} />
          <ListRow icon={File} title="Your agreement" subtitle={`Up to ${LOAN.instalment} per payment, this loan only`} onClick={() => go('agreement')} />
          <ListRow icon={Clock} title="Payment history" subtitle="1 of 6 paid" onClick={() => go('loan-timeline')} />
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="type-label-2 px-1 text-dark-green-50">Controls</h3>
        <Card className="divide-y divide-bone-50">
          <ListRow tone="neutral" icon={Pause} title="Skip next collection" subtitle={`Pay ${DUES[1].date} yourself`} onClick={() => go('pause-sheet')} />
          <ListRow tone="neutral" icon={Power} title="Turn off auto-pay" subtitle="Free, any time" onClick={() => go('cancel-sheet')} />
        </Card>
      </div>
    </div>
  )
}

export function AutoPaySettings({ go, back, state }: ScreenProps) {
  return (
    <ScreenLayout statusClassName="bg-bone-0" header={<TopNav title="Auto-pay" onBack={back} />}>
      <SettingsBody go={go} state={state} />
    </ScreenLayout>
  )
}

export function ChangeDate({ back }: ScreenProps) {
  const [choice, setChoice] = useState<'due' | 'early' | 'payday'>('due')
  return (
    <ScreenLayout
      statusClassName="bg-bone-0"
      header={<TopNav title="Collection day" onBack={back} />}
      footer={
        <StickyFooter>
          <Button onClick={back}>Save</Button>
        </StickyFooter>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
        <div className="flex flex-col gap-2">
          <h2 className="type-header-2 text-dark-green-70">When should we collect?</h2>
          <p className="type-body-1 text-dark-green-50">Pick the day that works best with when you get paid.</p>
        </div>
        <Card className="px-4">
          <RadioRow
            checked={choice === 'due'}
            onSelect={() => setChoice('due')}
            title="On each due date"
            subtitle={`We send the request the day before — next on ${DUES[1].request}`}
            tag={<Tag tone="teal">Recommended</Tag>}
          />
          <RadioRow
            checked={choice === 'early'}
            onSelect={() => setChoice('early')}
            title="2 days before each due date"
            subtitle="Good if your pay arrives a few days early"
          />
          <RadioRow
            checked={choice === 'payday'}
            onSelect={() => setChoice('payday')}
            title="On payday"
            subtitle="The 15th and the last day of the month, when that's before your due date"
            last
          />
        </Card>
        <Callout tone="info" icon={Info}>
          Late fees still follow your due dates, even if you pick a different collection day.
        </Callout>
      </div>
    </ScreenLayout>
  )
}

export function PauseSheet({ go, back, state }: ScreenProps) {
  const account = accountOf(state)
  const close = () => go('autopay-settings', { replace: true })
  return (
    <ScreenLayout
      statusClassName="bg-bone-0"
      header={<TopNav title="Auto-pay" onBack={back} />}
      overlay={
        <BottomSheet onDismiss={close}>
          <div className="flex flex-col gap-2">
            <h2 className="type-header-2 text-dark-green-70">Skip the {DUES[1].date} collection?</h2>
            <p className="type-body-1 text-dark-green-50">
              We won't request {LOAN.instalment} from {accountShort(account)}. You'll need to pay it yourself by {DUES[1].date}.
              Auto-pay starts again on {DUES[2].date}.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-6">
            <Button onClick={close}>Skip this collection</Button>
            <Button variant="tertiary" onClick={close}>
              Keep auto-pay
            </Button>
          </div>
        </BottomSheet>
      }
    >
      <SettingsBody go={go} state={state} />
    </ScreenLayout>
  )
}

export function CancelSheet({ go, back, state }: ScreenProps) {
  const account = accountOf(state)
  const close = () => go('autopay-settings', { replace: true })
  return (
    <ScreenLayout
      statusClassName="bg-bone-0"
      header={<TopNav title="Auto-pay" onBack={back} />}
      overlay={
        <BottomSheet onDismiss={close}>
          <div className="flex flex-col gap-2">
            <h2 className="type-header-2 text-dark-green-70">Turn off auto-pay?</h2>
            <p className="type-body-1 text-dark-green-50">
              We'll stop collecting from {accountShort(account)}. You'll need to pay {LOAN.instalment} by {DUES[1].date}, and each
              payment after, yourself. You can turn it back on any time.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-6">
            <Button onClick={() => go('autopay-off', { replace: true })}>Turn off auto-pay</Button>
            <Button variant="tertiary" onClick={close}>
              Keep auto-pay
            </Button>
          </div>
        </BottomSheet>
      }
    >
      <SettingsBody go={go} state={state} />
    </ScreenLayout>
  )
}

export function AutoPayOff({ go, state, setState }: ScreenProps) {
  const account = accountOf(state)
  const done = () => go('home-card')
  return (
    <ScreenLayout
      header={<CloseBar onClose={done} />}
      footer={
        <StickyFooter>
          <Button onClick={done}>Done</Button>
          <Button
            variant="tertiary"
            onClick={() => {
              setState({ source: 'home-card', consentChecked: false })
              go('consent')
            }}
          >
            Turn auto-pay back on
          </Button>
        </StickyFooter>
      }
    >
      <div className="flex flex-col gap-6 px-6 pb-8 pt-2">
        <span className="grid size-16 place-items-center rounded-full bg-bone-30 text-dark-green-70">
          <Power size={32} />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="type-header-1 text-dark-green-70">Auto-pay is off</h1>
          <p className="type-body-1 text-dark-green-50">We won't collect any more payments from {accountShort(account)}.</p>
        </div>
        <Card className="px-4">
          <DetailRow label="Next payment" value={LOAN.instalment} />
          <DetailRow label="Due" value={DUES[1].full} last />
        </Card>
      </div>
    </ScreenLayout>
  )
}

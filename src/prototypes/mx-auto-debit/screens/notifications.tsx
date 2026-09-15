import type { ReactNode } from 'react'
import { StatusBar } from '../../../ds/chrome'
import type { ScreenProps } from '../../types'
import { DUES, LOAN, accountShort, ACCOUNTS } from '../data'

// Lock-screen push notifications — OS chrome, so sizes here sit outside the Tala type scale.

type Push = { title: string; body: string; clock: string; day: string; to: string }

const bbva = accountShort(ACCOUNTS.bbva)

export const PUSHES = {
  nudge: {
    title: 'Stop worrying about your due date',
    body: `Turn on auto-pay and we'll collect your ${LOAN.instalment} on ${DUES[0].date}. Cancel any time.`,
    clock: '10:30',
    day: 'Thursday, 3 September',
    to: 'consent',
  },
  setupSuccess: {
    title: 'Auto-pay is on',
    body: `We'll collect ${LOAN.instalment} from ${bbva} on ${DUES[0].date}. We'll remind you the day before.`,
    clock: '10:32',
    day: 'Thursday, 3 September',
    to: 'autopay-settings',
  },
  setupFailed: {
    title: "We couldn't set up auto-pay",
    body: 'Your bank couldn’t confirm the account. Your loan isn’t affected — tap to try another account.',
    clock: '10:32',
    day: 'Thursday, 3 September',
    to: 'setup-failed',
  },
  reminder: {
    title: `Your ${LOAN.instalment} payment is due tomorrow`,
    body: `Auto-pay collects it from ${bbva} tonight. Keep the money in your account.`,
    clock: '9:00',
    day: 'Monday, 14 September',
    to: 'home-reminder',
  },
  processing: {
    title: `We've asked your bank for ${LOAN.instalment}`,
    body: "BBVA sends it tonight and we'll confirm by 12pm tomorrow. No need to pay manually.",
    clock: '2:35',
    day: 'Monday, 14 September',
    to: 'home-processing',
  },
  paid: {
    title: 'Your payment is in',
    body: `Auto-pay collected ${LOAN.instalment} for ${DUES[0].date}. Next payment: ${DUES[1].date}.`,
    clock: '11:48',
    day: 'Tuesday, 15 September',
    to: 'debit-detail',
  },
  failed: {
    title: "Auto-pay didn't go through",
    body: `BBVA couldn't send ${LOAN.instalment}. Pay by ${LOAN.graceUntil} to avoid a late fee.`,
    clock: '11:48',
    day: 'Tuesday, 15 September',
    to: 'home-failed',
  },
  cancelled: {
    title: 'Auto-pay is off',
    body: `We won't collect any more payments. Your next ${LOAN.instalment} is due ${DUES[1].date}.`,
    clock: '6:12',
    day: 'Wednesday, 16 September',
    to: 'autopay-off',
  },
} satisfies Record<string, Push>

type PushKey = keyof typeof PUSHES

function LockScreen({ clock, day, hint, children }: { clock: string; day: string; hint: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-dark-green-70 via-teal-90 to-teal-70 text-bone-0">
      <StatusBar tone="light" />
      <div className="flex flex-col items-center gap-1 pt-12 lg:pt-4">
        <p className="text-[80px] font-light leading-none tracking-tight">{clock}</p>
        <p className="type-subheader-2 text-bone-0/80">{day}</p>
      </div>
      <div className="no-scrollbar mt-8 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 pb-4">{children}</div>
      <p className="type-caption shrink-0 pb-8 pt-2 text-center text-bone-0/70">{hint}</p>
    </div>
  )
}

function NotificationCard({ push, time, onOpen }: { push: Push; time: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full flex-col gap-1 rounded-lg bg-bone-20/95 p-4 text-left text-dark-green-70 shadow-surface-1 backdrop-blur transition-transform active:scale-[0.98]"
    >
      <span className="flex items-center gap-2">
        <span className="type-caption grid size-5 place-items-center rounded-sm bg-teal-50 text-bone-0">T</span>
        <span className="type-caption flex-1 tracking-wide">TALA</span>
        <span className="type-caption text-dark-green-50">{time}</span>
      </span>
      <span className="type-label-1 mt-1">{push.title}</span>
      <span className="type-body-1">{push.body}</span>
    </button>
  )
}

function pushScreen(key: PushKey) {
  return function PushScreen({ go, setState }: ScreenProps) {
    const push = PUSHES[key]
    const open = () => {
      if (key === 'nudge') setState({ source: 'push', consentChecked: false })
      go(push.to)
    }
    return (
      <LockScreen clock={push.clock} day={push.day} hint="Tap the notification to open">
        <NotificationCard push={push} time="now" onOpen={open} />
      </LockScreen>
    )
  }
}

export const PushNudge = pushScreen('nudge')
export const PushSetupSuccess = pushScreen('setupSuccess')
export const PushSetupFailed = pushScreen('setupFailed')
export const PushReminder = pushScreen('reminder')
export const PushProcessing = pushScreen('processing')
export const PushPaid = pushScreen('paid')
export const PushFailed = pushScreen('failed')
export const PushCancelled = pushScreen('cancelled')

const TIMELINE: Array<{ label: string; keys: PushKey[] }> = [
  { label: 'Thursday, 3 September', keys: ['nudge', 'setupSuccess'] },
  { label: 'Monday, 14 September', keys: ['reminder', 'processing'] },
  { label: 'Tuesday, 15 September', keys: ['paid'] },
  { label: 'Other outcomes', keys: ['setupFailed', 'failed', 'cancelled'] },
]

export function NotificationCentre({ go, setState }: ScreenProps) {
  return (
    <LockScreen clock="9:41" day="The full auto-pay journey" hint="Tap any notification to see where it leads">
      {TIMELINE.map((group) => (
        <div key={group.label} className="flex flex-col gap-2 pb-2">
          <p className="type-caption px-2 pt-2 text-bone-0/70">{group.label}</p>
          {group.keys.map((key) => (
            <NotificationCard
              key={key}
              push={PUSHES[key]}
              time={PUSHES[key].clock}
              onOpen={() => {
                if (key === 'nudge') setState({ source: 'push', consentChecked: false })
                go(PUSHES[key].to)
              }}
            />
          ))}
        </div>
      ))}
    </LockScreen>
  )
}

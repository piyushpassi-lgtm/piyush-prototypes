import type { Prototype, ScreenNotes } from '../types'
import * as Consent from './screens/consent'
import * as Entry from './screens/entry'
import * as Lifecycle from './screens/lifecycle'
import * as Manage from './screens/manage'
import * as Push from './screens/notifications'
import { Profile } from './screens/profile'

// Sources: docs/MX AutoDebit Experiment- Brief.md (PRD v4.0), the Piyush / Arun call on 2 Sep 2026
// and the Auto-Debits UX review on 15 Sep 2026.

const T_MINUS_ONE =
  'Submit on T-1 or on the due date? The team is leaning towards charging on the target date between 6pm and midnight; the decision is due in the weekly sync.'

const NAMING = 'What are we calling this feature — "AutoPay", "auto-pay", or something else?'

// Both consent variants carry the same notes — the skip question is what separates them.
const consentNotes: ScreenNotes = {
  assumptions: [
    'Consent is given by the CTA itself. There is no checkbox, and the direct debit form is one tap away from this screen.',
    'Consent is per loan and does not carry over to the next loan (Legal, ZG).',
    'Skipping never blocks disbursement. Banxico rules do not allow consent to be mandatory for disbursement.',
    'No incentive is offered in Q3.',
  ],
  openQuestions: [
    NAMING,
    'Will we allow skip? Compare the two variants of this screen.',
    "Should we allow picking a 'from' account, as shown in the prototype?",
    'Is consent through the CTA enough for Legal? Scenario 3 (a standalone step with active consent) was rated lowest CONDUSEF/LPDUSF risk.',
    T_MINUS_ONE,
    'How does the 3-day grace period interact with the ~12-hour confirmation gap? Should we pause penalties?',
    'Maximum amount on the form: exactly the instalment, or a cap that covers late fees?',
  ],
  answeredQuestions: [
    'Should the weekend and holiday case be explained here? No — this screen only sells the consent. Weekend handling is communicated on the days around the debit.',
    'Do we need a user agreement link? Yes — the direct debit form is linked from this screen, in the standard Tala way.',
  ],
  designInputs: [
    'Must show: amount, date of debit (target date), and the account (disbursement account by default).',
    'Fixes the 2025 test gaps: gives a reason, reassures on amount and timing, and says clearly that you can cancel.',
  ],
}

export const mxAutoDebit: Prototype = {
  id: 'mx-auto-debit',
  title: 'MX Auto-Debit',
  market: 'Mexico',
  flag: '🇲🇽',
  status: 'Draft v1',
  updated: '16 Sep 2026',
  summary: 'End-to-end auto-debit for Mexico: consent from every entry point, registration, debit lifecycle, history and management.',
  initialState: { source: 'home-card', account: 'bbva' },

  sections: [
    {
      id: 'entry',
      label: 'Entry points',
      kind: 'entry',
      screens: ['disb-review', 'disb-returning', 'home-card', 'home-modal', 'pn-nudge', 'payment-upsell'],
    },
    {
      id: 'consent',
      label: 'Consent & registration',
      kind: 'flow',
      screens: ['consent', 'consent-no-skip', 'agreement', 'choose-account', 'setting-up', 'setup-success', 'setup-failed', 'money-on-way'],
    },
    {
      id: 'outcomes',
      label: 'Disbursement outcomes',
      kind: 'flow',
      screens: ['disb-fail-autopay-on', 'disb-ok-autopay-fail', 'both-fail'],
    },
    {
      id: 'lifecycle',
      label: 'Around a debit',
      kind: 'flow',
      screens: ['home-autopay-on', 'home-next-payment', 'home-reminder', 'home-processing', 'home-failed'],
    },
    {
      id: 'history',
      label: 'Payment history',
      kind: 'flow',
      screens: ['loan-timeline', 'debit-detail'],
    },
    {
      id: 'manage',
      label: 'Profile & manage',
      kind: 'flow',
      screens: ['profile', 'autopay-settings', 'change-date', 'pause-sheet', 'cancel-sheet', 'autopay-off'],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      kind: 'notifications',
      screens: ['pn-all', 'pn-nudge', 'pn-setup-success', 'pn-setup-failed', 'pn-reminder', 'pn-processing', 'pn-paid', 'pn-failed', 'pn-cancelled'],
    },
  ],

  screens: {
    // ── Entry points ──────────────────────────────────────────────────────────
    'disb-review': {
      title: 'At disbursement',
      description: 'Customer confirms where their loan goes. Tapping Confirm leads to the consent step when they are in the test group.',
      component: Entry.DisbursementReview,
      notes: {
        information: [
          'Assignment Service puts the customer in test or control when they tap Confirm. Control goes straight to disbursement.',
        ],
        openQuestions: [
          'Should debit-card disbursements see consent, or only CLABE? Only CLABE lets us show TALA on the statement.',
          'Do we exclude customers whose first due date falls on a Friday, Saturday, Sunday or holiday? To discuss with the team, along with how we communicate it when that happens.',
          'Question for Monato: what banks are supported for auto-debit?',
        ],
        engineeringQuestions: [
          'PRD Option 2: consent is collected in the Tala app at disbursement. Option 1 (Braze-only consent) was rejected.',
          'Can we reuse the existing Belvo consent collection front end and back end?',
        ],
      },
    },
    'disb-returning': {
      title: 'At disbursement — returning customer',
      description: 'Someone who has used Autopay before gets a toggle on the disbursement screen instead of the full consent step.',
      component: Entry.DisbursementReturning,
      notes: {
        information: [
          'Consent cannot carry over between loans, so a new mandate is still registered — the toggle is a shortcut through the same flow.',
        ],
        openQuestions: [
          'Is the toggle on or off by default for a returning customer?',
          'Is a Details link enough for the returning case, or must the full form be shown again each loan?',
          'What counts as "returning": any past mandate, or only one that collected successfully?',
        ],
      },
    },
    'home-card': {
      title: 'Home screen card',
      description: 'Always-on card for test customers who skipped consent. Reaches people mid-loan and is the fastest route to volume.',
      component: Entry.HomeCardEntry,
      notes: {
        assumptions: [
          'Only shown to test customers who skipped consent at disbursement or whose registration failed.',
          'Show other block 2s if this is turned on during disbursement or later.',
        ],
        openQuestions: [
          'What is the cut-off? How many days before a due date does a mid-loan mandate still catch that payment? This helps teams know when to show this messaging.',
        ],
        designInputs: [
          'Everything leads to the same consent screen. Consent is exposed as an API any team can call.',
          'Home card entry is optional scope in the PRD, and it sends a Braze attribute to power push notifications.',
        ],
      },
    },
    'home-modal': {
      title: 'In-app message',
      description: 'Braze in-app message over Home. It deep-links into the same Tala consent screen.',
      component: Entry.InAppMessage,
      backTo: 'home-card',
      notes: {
        assumptions: [
          'There is no incentive in Q3, so the pitch rests on reassurance: amount, date, a reminder and "cancel whenever you like".',
        ],
        openQuestions: [
          'Frequency cap: how many times do we show this before we stop?',
          'Tapping on "Maybe later" should continue to show the Block 2 for setup',
        ],
      },
    },
    'pn-nudge': {
      title: 'Push — consent nudge',
      description: 'Reaches customers outside the app. It is the only channel we can time, for example just after payday.',
      component: Push.PushNudge,
      notes: {
        openQuestions: [
          'What is the best send time relative to payday and the due date?',
          'If the push is opened after the cut-off, should consent start from the next payment?',
        ],
        designInputs: [
          'Future: an agent on a collections call triggers this push so the customer can consent in real time, possibly with an interest waiver.',
        ],
      },
    },
    'payment-upsell': {
      title: 'After a manual payment',
      description: 'Exploration: offer Autopay for the next payment right after a successful manual one.',
      component: Entry.PostPaymentUpsell,
      notes: {
        assumptions: ['Not in v1 scope. Shown to help plan entry points for Q4.'],
      },
    },

    // ── Consent & registration ────────────────────────────────────────────────
    consent: {
      title: 'Consent — with skip',
      description: 'The single consent screen every entry point leads to. Consent is given by the CTA itself, and the customer can skip.',
      component: Consent.Consent,
      backTo: 'home-card',
      notes: consentNotes,
    },
    'consent-no-skip': {
      title: 'Consent — no skip',
      description: 'The same screen without a skip action: the customer either turns on Autopay or leaves with the back arrow.',
      component: Consent.ConsentNoSkip,
      backTo: 'home-card',
      notes: consentNotes,
    },
    agreement: {
      title: 'Direct debit form',
      description: "Monato's domiciliación template, pre-filled, with a plain-English summary underneath.",
      component: Consent.Agreement,
      backTo: 'consent',
      notes: {},
    },
    'choose-account': {
      title: 'Choose account',
      description: 'Change which account is debited when consenting. Also used to retry after a failed registration.',
      component: Consent.ChooseAccount,
      backTo: 'consent',
      notes: {
        assumptions: ['Monato accepts CLABE and debit card as instruments. The default is the account receiving the loan.'],
        openQuestions: [
          'PRD mentions "I can edit the bank account from which Tala debits, at point of consent." - which accounts can be added here?',
          'Does selecting different accounts show the debit as coming from Monato or Tala on the statement?',
        ],
      },
    },
    'setting-up': {
      title: 'Setting up (penny drop)',
      description: 'Registers the customer and account with Monato. Moves to success after 3 s. Tap the shapes to simulate a failed check.',
      component: Consent.SettingUp,
      backTo: 'consent',
      notes: {
        assumptions: [
          'On confirm: POST /customers, then POST /instruments. Monato runs a penny drop to check the account owner.',
          'The mandate is registered only after a successful check.',
        ],
        openQuestions: ['Which failure reasons does Monato return, and which can we safely show customers?'],
        answeredQuestions: [
          'How long does penny validation take? About 2–5 seconds, so a short loading state is enough.',
          'Do we need to wait for disbursement to succeed before confirming Autopay? No — consent is collected, so we confirm straight away.',
        ],
      },
    },
    'setup-success': {
      title: 'Autopay is on',
      description: 'Confirmation. At disbursement it doubles as "your money is on the way"; from other entry points it shows a summary.',
      component: Consent.SetupSuccess,
      notes: {
        openQuestions: ['Should we also send the signed form by email or SMS?'],
        designInputs: [
          'Telling people where to manage Autopay lowers the "I didn\'t agree to this" risk (Risks table).',
          'One success screen instead of two: money on the way is the hero, Autopay confirmation sits under it.',
        ],
      },
    },
    'setup-failed': {
      title: 'Registration failed',
      description: "Penny validation failed. The loan isn't affected, and the customer can try another account or continue.",
      component: Consent.SetupFailed,
      notes: {
        designInputs: ['Disbursement continues as normal. The customer can try another account or continue without Autopay.'],
      },
    },
    'money-on-way': {
      title: 'Skipped at disbursement',
      description: 'Normal disbursement confirmation after skipping, with a button to turn Autopay on straight from the card.',
      component: Consent.MoneyOnWay,
      notes: {
        assumptions: ['Skipping keeps the customer in the test cohort, so later entry points can reach them.'],
        designInputs: [
          'The skip label "my money still comes through" makes skipping feel safe, so consent stays freely given.',
          'The card carries its own CTA rather than sending people to look for it on Home.',
        ],
      },
    },

    // ── Disbursement outcomes ─────────────────────────────────────────────────
    'disb-fail-autopay-on': {
      title: 'Disbursement failed · Autopay on',
      description: 'Disbursement has failed, but we only learn that ~15 minutes later, so the customer still sees money on the way.',
      component: Consent.DisbFailAutopayOn,
      notes: {
        information: [
          'Disbursement in Mexico takes about 15 minutes, so at this moment neither Tala nor the customer knows it failed.',
          'Autopay registration is independent of disbursement, so the mandate really is active.',
        ],
        openQuestions: [
          'When the disbursement failure comes back, how do we tell the customer, and does the mandate stay registered for the retried disbursement?',
        ],
      },
    },
    'disb-ok-autopay-fail': {
      title: 'Disbursement fine · Autopay failed',
      description: 'The money is on its way, but the mandate could not be registered. The customer can try again from the card.',
      component: Consent.DisbOkAutopayFail,
      notes: {
        openQuestions: [
          'Should we allow the customer to set up Autopay again immediately after a failure, or wait until the money has landed?',
          'How many attempts do we allow in one session before we stop offering it?',
        ],
        designInputs: ['Disbursement stays the hero; the Autopay failure is secondary and never blocks the loan.'],
      },
    },
    'both-fail': {
      title: 'Both failed',
      description: 'Identical to the screen above — at this point the disbursement failure is not known yet.',
      component: Consent.BothFail,
      notes: {
        information: [
          'Because the disbursement result arrives ~15 minutes later, this case is indistinguishable from "disbursement fine, Autopay failed" at the moment of the screen.',
        ],
        openQuestions: ['Do we need a combined message later, or do the two failures get communicated separately?'],
      },
    },

    // ── Around a debit ────────────────────────────────────────────────────────
    'home-autopay-on': {
      title: 'Home — Autopay on',
      description: 'The repayment card shows the next payment, with Autopay status and a link into settings.',
      component: Lifecycle.HomeAutoPayOn,
      notes: {
        assumptions: ['Manual payment stays available; Autopay never locks the repayment flow.'],
        openQuestions: ['If the customer pays manually before the collection, do we cancel that instruction automatically?'],
        designInputs: [
          'Status sits in a title + one-line card with Settings on the right, so every Autopay state on Home reads the same way.',
          'Second loan onwards, this card is how the customer knows Autopay is active — the "verified badge" idea from the 15 Sep review.',
        ],
      },
    },
    'home-next-payment': {
      title: 'Home — next payment',
      description: 'After a payment, Home moves on to the next one. We talk about what is coming, not what has already been paid.',
      component: Lifecycle.HomeNextPayment,
      notes: {
        designInputs: ['Past payments live in payment history, so Home stays focused on the next due date.'],
      },
    },
    'home-reminder': {
      title: 'Home — day before',
      description: 'The day before the collection: keep enough balance in the account.',
      component: Lifecycle.HomeReminder,
      notes: {
        openQuestions: [
          T_MINUS_ONE,
          'Should the reminder let customers skip this one collection (e.g. salary is late)?',
        ],
        designInputs: [
          'Q3 learning: do customers cancel or move money out in the 24 hours after this warning? Log timestamps against it.',
          'Timing debits to payday improves success by 4–7 percentage points.',
        ],
      },
    },
    'home-processing': {
      title: 'Home — debit in progress',
      description: 'On the debit day: the bank collects between 6pm and midnight, so the card warns against paying twice.',
      component: Lifecycle.HomeProcessing,
      notes: {
        information: [
          'The bank executes between 6pm and midnight on the day, and Monato confirms to Tala by 12pm the next day.',
          'For Santander, the bank responds on T+0, so this state is shorter.',
        ],
        openQuestions: [
          'If a customer pays manually in this window and the debit also succeeds, how quickly do we refund?',
          'When the due date falls on a Friday or a weekend, the status only updates on Monday or Tuesday — what exactly do we say on those days?',
        ],
        designInputs: [
          'Today, nothing on screen changes on the debit day — only an SMS goes out. This state closes that gap.',
          'Explicit timing ("between 6pm and midnight") plus "don\'t pay manually" was the ask from the 15 Sep review.',
        ],
      },
    },
    'home-failed': {
      title: 'Home — debit failed',
      description: 'The debit failed, usually for lack of funds. The customer is asked to pay manually within the grace period.',
      component: Lifecycle.HomeFailed,
      notes: {
        information: ['Mexico has no automatic retry for now — retries are expensive, so recovery is manual.'],
        openQuestions: [
          'Which reason codes can we show (insufficient funds, account closed, mandate revoked at the bank)?',
          'Do we also need a one-off popup on the next app open, like the success and failure cards discussed for CICO?',
        ],
        designInputs: [
          '2025 test: 58% success, and 41% of failures were insufficient funds. Debits over $1,000 fail more often.',
          'Voice and tone: empathetic, never blaming.',
        ],
      },
    },

    // ── Payment history ───────────────────────────────────────────────────────
    'loan-timeline': {
      title: 'Payment history',
      description: 'Every loan with its payments inside it — Autopay collections, manual payments, fees and refunds.',
      component: Lifecycle.LoanTimeline,
      backTo: 'profile',
      notes: {
        information: ['Gen 3 has borrowing history but no transaction history, so this is a new surface.'],
        answeredQuestions: [
          'Where does this live in the app? In the payment history section of the profile page.',
          'Should it also show manual payments, fees and refunds? Yes — everything that moved money on the loan.',
        ],
        openQuestions: ['How far back do we show closed loans, and do we paginate?'],
        designInputs: ['Payments sit inside their loan card, so a customer with several loans can tell them apart.'],
      },
    },
    'debit-detail': {
      title: 'Autopay payment detail',
      description: 'One debit, end to end: when it was requested, collected and confirmed, plus how it appears on the statement.',
      component: Lifecycle.DebitDetail,
      backTo: 'loan-timeline',
      notes: {
        openQuestions: [
          'Confirm the statement descriptor for each bank with Monato.',
          'How does the CARE counter-part of payment history and automatic payments look like?',
        ],
        designInputs: [
          'Chargeback risk: customers who don\'t recognise "Monato" dispute the charge before Tala confirms it.',
          '"Talk to us first" gives customers a faster route than a bank dispute.',
        ],
      },
    },

    // ── Profile & manage ──────────────────────────────────────────────────────
    profile: {
      title: 'Profile & settings',
      description: 'Autopay and payment history live here, alongside the existing account, preferences and support sections.',
      component: Profile,
      backTo: 'home-autopay-on',
      notes: {
        openQuestions: ['Will our profile page be ready to support AutoPay for launch?'],
      },
    },
    'autopay-settings': {
      title: 'Autopay settings',
      description: 'Status, next collection, account, collection day, agreement, and controls to skip or turn off.',
      component: Manage.AutoPaySettings,
      backTo: 'profile',
    },
    'change-date': {
      title: 'Collection day',
      description: 'Exploration: collect on the due date, a little earlier, or on payday.',
      component: Manage.ChangeDate,
      backTo: 'autopay-settings',
      notes: {
        assumptions: ['v2 configurability. Not in v1.'],
      },
    },
    'pause-sheet': {
      title: 'Skip next collection',
      description: 'Skip one collection while keeping the mandate for later payments.',
      component: Manage.PauseSheet,
      backTo: 'autopay-settings',
      notes: {
        assumptions: ['Skipping one collection keeps the mandate active.'],
        openQuestions: ['What is the latest time to skip? Probably before the submission on the collection day.'],
      },
    },
    'cancel-sheet': {
      title: 'Turn off Autopay',
      description: 'Honest consequences, no guilt. Turning off is free and immediate.',
      component: Manage.CancelSheet,
      backTo: 'autopay-settings',
      notes: {
        assumptions: ['Turning off revokes the mandate on Monato immediately, at no cost to the customer.'],
        openQuestions: ['If turned off after the instruction has been submitted, can the in-flight charge still be stopped?'],
      },
    },
    'autopay-off': {
      title: 'Autopay is off',
      description: 'Confirms that nothing more will be collected and shows the next payment the customer owes.',
      component: Manage.AutoPayOff,
      notes: {
        designInputs: ['Keeps a one-tap way back in. Consent must still be given again through the full consent screen.'],
      },
    },

    // ── Notifications ─────────────────────────────────────────────────────────
    'pn-all': {
      title: 'All notifications',
      description: 'Every Autopay push in journey order. Tap one to open where it leads.',
      component: Push.NotificationCentre,
      notes: {
        assumptions: ['Pushes are sent through Braze and triggered by mandate and charge events from the auto-debit framework.'],
        openQuestions: [
          'Fallback for customers with notifications turned off: SMS or WhatsApp?',
          'Do we send Care or LCM messages for failures too, or only in-app plus push?',
        ],
        designInputs: ['Full lifecycle comms, so no debit ever surprises the customer.'],
      },
    },
    'pn-setup-success': {
      title: 'Push — Autopay on',
      description: 'Sent after the mandate is registered, especially when validation finishes after the customer leaves.',
      component: Push.PushSetupSuccess,
    },
    'pn-setup-failed': {
      title: 'Push — registration failed',
      description: 'Sent when penny validation fails after the customer has left the flow.',
      component: Push.PushSetupFailed,
    },
    'pn-reminder': {
      title: 'Push — day before',
      description: 'Sent the day before the collection: keep the money in the account.',
      component: Push.PushReminder,
      notes: {
        openQuestions: [T_MINUS_ONE],
        designInputs: ['This is the "warning notification" the brief measures cancellations and money movement against.'],
      },
    },
    'pn-processing': {
      title: 'Push — request sent',
      description: 'Sent at submission so the bank debit that evening is expected.',
      component: Push.PushProcessing,
      notes: {
        designInputs: ['Covers the gap where money leaves the account before Tala can confirm it — the main chargeback trigger.'],
      },
    },
    'pn-paid': {
      title: 'Push — payment received',
      description: 'Sent once Monato confirms success, by 12pm the day after the collection.',
      component: Push.PushPaid,
      notes: { designInputs: ['PRD: "On successful debit, a payment collection notification is sent to the user."'] },
    },
    'pn-failed': {
      title: 'Push — debit failed',
      description: 'Sent when Monato reports a failure. Gives a pay-by date inside the grace period.',
      component: Push.PushFailed,
      notes: {
        designInputs: ['PRD: "On failed debit, we do not retry auto-debits. We send across a debit-failed notification."'],
      },
    },
    'pn-cancelled': {
      title: 'Push — Autopay off',
      description: 'Confirms a cancellation, including one made at the bank rather than in the app.',
      component: Push.PushCancelled,
      notes: {
        openQuestions: ['Will Monato tell us when a customer revokes the mandate directly with their bank?'],
      },
    },
  },
}

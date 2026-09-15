import type { Prototype } from '../types'
import * as Consent from './screens/consent'
import * as Entry from './screens/entry'
import * as Lifecycle from './screens/lifecycle'
import * as Manage from './screens/manage'
import * as Push from './screens/notifications'

// Sources: docs/MX AutoDebit Experiment- Brief.md (PRD v4.0) and the Piyush / Arun call on 2 Sep 2026.

const T_MINUS_ONE =
  'Submit on T-1 or on the due date? The copy assumes T-1 ("a day early"); the decision is still open with the team.'

export const mxAutoDebit: Prototype = {
  id: 'mx-auto-debit',
  title: 'MX Auto-Debit',
  market: 'Mexico',
  flag: '🇲🇽',
  status: 'Draft v1',
  updated: '15 Sep 2026',
  summary: 'End-to-end auto-debit for Mexico: consent from four entry points, registration, debit lifecycle, history and management.',
  initialState: { source: 'home-card', account: 'bbva', consentChecked: false },

  sections: [
    {
      id: 'entry',
      label: 'Entry points',
      kind: 'entry',
      screens: ['disb-review', 'home-card', 'home-modal', 'pn-nudge', 'payment-upsell'],
    },
    {
      id: 'consent',
      label: 'Consent & registration',
      kind: 'flow',
      screens: ['consent', 'agreement', 'choose-account', 'setting-up', 'setup-success', 'setup-failed', 'money-on-way'],
    },
    {
      id: 'lifecycle',
      label: 'Around a debit',
      kind: 'flow',
      screens: ['home-autopay-on', 'home-reminder', 'home-processing', 'home-paid', 'home-failed'],
    },
    {
      id: 'history',
      label: 'Payment history',
      kind: 'flow',
      screens: ['loan-timeline', 'debit-detail'],
    },
    {
      id: 'manage',
      label: 'Manage auto-pay',
      kind: 'flow',
      screens: ['autopay-settings', 'change-date', 'pause-sheet', 'cancel-sheet', 'autopay-off'],
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
        assumptions: [
          'Assignment Service puts the customer in test or control when they tap Confirm. Control goes straight to disbursement.',
          'Only customers disbursing to a supported bank are eligible (Actinver, Afirme, Banamex, BanBajío … Santander, Scotiabank).',
          'Customers whose first due date falls on a Friday, Saturday, Sunday or holiday are excluded from the experiment.',
        ],
        openQuestions: [
          'Should debit-card disbursements see consent, or only CLABE? Only CLABE lets us show TALA on the statement.',
          'Can we reuse the existing Belvo consent collection front end and back end?',
        ],
        designInputs: [
          'PRD Option 2: consent is collected in the Tala app at disbursement. Option 1 (Braze-only consent) was rejected.',
          'This is a happy moment: the customer is about to get money, so the ask looks ahead instead of competing with a payment.',
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
          'Hidden once auto-pay is on, or when the next due date is too close to register a mandate in time.',
        ],
        openQuestions: [
          'What is the cut-off? How many days before a due date does a mid-loan mandate still catch that payment?',
          'Should take rate be reported per entry point? It would tell us which moment converts best, a Q3 question.',
        ],
        designInputs: [
          'Arun: "everything leads to the same consent screen" — consent is exposed as an API any team can call.',
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
          'Braze only delivers the message. Tala records the consent, not Braze.',
          'There is no incentive in Q3, so the pitch rests on reassurance: amount, date, a reminder and "cancel whenever you like".',
        ],
        openQuestions: [
          'Frequency cap: how many times do we show this before we stop?',
          'Does "Maybe later" also hide the Home card for a while?',
        ],
        designInputs: [
          '2025 Santander test: 30% clicked but only 10% of those gave permission. The screen gave "no reason to sign up".',
          'Arun: "We cannot sell it as a convenience. You need to give them something more." Incentives are planned for Q4.',
        ],
      },
    },
    'pn-nudge': {
      title: 'Push — consent nudge',
      description: 'Reaches customers outside the app. It is the only channel we can time, for example just after payday.',
      component: Push.PushNudge,
      notes: {
        assumptions: ['Sent through Braze to test customers who have not consented, using the attribute set at disbursement.'],
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
      description: 'Exploration: offer auto-pay for the next payment right after a successful manual one.',
      component: Entry.PostPaymentUpsell,
      notes: {
        assumptions: ['Not in v1 scope. Shown to help plan entry points for Q4.'],
        openQuestions: ['Does this cannibalise manual channels that cost about a quarter as much per transaction?'],
        designInputs: [
          'Auto-debit offered as a cash-in option only reached a 3% take rate: it asked people to wait at the moment they wanted to pay.',
          'Arun: "Thank you for the payment. Do you want your next payment to be on auto-debit? That\'s a slick experience."',
        ],
      },
    },

    // ── Consent & registration ────────────────────────────────────────────────
    consent: {
      title: 'Consent',
      description: 'The single consent screen every entry point leads to: how it works, exactly what is set up, and an active authorisation.',
      component: Consent.Consent,
      backTo: 'home-card',
      notes: {
        assumptions: [
          'The checkbox starts unticked. A standalone step with active consent has the lowest CONDUSEF/LPDUSF risk (scenario 3).',
          'Consent is per loan and does not carry over to the next loan (Legal, ZG).',
          'Skipping never blocks disbursement. Banxico rules do not allow consent to be mandatory for disbursement.',
          'No incentive is offered in Q3.',
        ],
        openQuestions: [
          T_MINUS_ONE,
          'How does the 3-day grace period interact with the ~12-hour confirmation gap? Should we pause penalties?',
          'Maximum amount on the form: exactly the instalment, or a cap that covers late fees?',
          'Which account can be debited: only the disbursement account, or any account in the customer\'s name?',
        ],
        designInputs: [
          'Must show: amount, date of debit (target date), and the account (disbursement account by default).',
          'Fixes the 2025 test gaps: gives a reason, reassures on amount and timing, and says clearly that you can cancel.',
          'Arun: "you have the ability to pause, manage and view everything — you are in control, not Tala".',
          'Showing the statement descriptor up front reduces chargebacks from customers who "don\'t remember agreeing".',
        ],
      },
    },
    agreement: {
      title: 'Direct debit form',
      description: "Monato's domiciliación template, pre-filled, with a plain-language English version.",
      component: Consent.Agreement,
      backTo: 'consent',
      notes: {
        assumptions: [
          'Periodicity is each instalment date, and the authorisation ends on the last instalment date because consent is per loan.',
          'The customer\'s electronic acceptance (checkbox + CTA) counts as the signature.',
        ],
        openQuestions: [
          'Does Legal need the full Spanish form in the app, or is a link to a PDF enough?',
          'Do we store a timestamped copy for disputes and chargebacks?',
          'Is the Cobros Domiciliados S.A. de C.V. name required when Tala is the provider?',
        ],
        designInputs: [
          'PRD: "Create a new agreement template to match the proposed Monato template."',
          'Dates in Spanish follow the LATAM style with lowercase months (e.g. 15 de septiembre de 2026).',
        ],
      },
    },
    'choose-account': {
      title: 'Choose account',
      description: 'Change which account is debited when consenting. Also used to retry after a failed registration.',
      component: Consent.ChooseAccount,
      backTo: 'consent',
      notes: {
        assumptions: ['Monato accepts CLABE and debit card as instruments. The default is the account receiving the loan.'],
        openQuestions: [
          'Does penny validation work for debit cards, or only CLABE?',
          'Does Risk treat a collection account different from the disbursement account differently?',
        ],
        designInputs: [
          'Design request 2b: "I can edit the bank account from which Tala debits, at point of consent."',
          'CLABE shows TALA on the statement, so the screen gently nudges towards CLABE to cut chargebacks.',
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
        openQuestions: [
          'How long does penny validation take? If it takes more than ~5 s, do we disburse first and confirm auto-pay by push?',
          'Which failure reasons does Monato return, and which can we safely show customers?',
        ],
        designInputs: ['Arun: "there\'s a failure state over here as well… think through the design for that."'],
      },
    },
    'setup-success': {
      title: 'Auto-pay is on',
      description: 'Confirmation. At disbursement it doubles as "your money is on the way"; from other entry points it shows a summary.',
      component: Consent.SetupSuccess,
      notes: {
        assumptions: ['Mandate status is saved to the mandate table, so the customer is eligible for the next target due date.'],
        openQuestions: ['Should we also send the signed form by email or SMS?'],
        designInputs: [
          'Telling people where to manage auto-pay lowers the "I didn\'t agree to this" risk (Risks table).',
          'Content changes with state.source. Try both by entering from disbursement and from the Home card.',
        ],
      },
    },
    'setup-failed': {
      title: 'Registration failed',
      description: "Penny validation failed. The loan isn't affected, and the customer can try another account or continue.",
      component: Consent.SetupFailed,
      notes: {
        assumptions: ['Disbursement continues whatever the registration outcome.'],
        openQuestions: [
          'After a failure, should the Home card invite them again the next day or stay hidden?',
          'Can "Try another account" re-run validation without restarting disbursement?',
        ],
        designInputs: [
          'Arun: "so sorry, mandate is not registered because of reason — but we\'re sending your money anyway."',
          'PRD: "If penny validation fails, tell user that the auto-debit registration failed. Proceed with disbursement."',
        ],
      },
    },
    'money-on-way': {
      title: 'Skipped at disbursement',
      description: 'Normal disbursement confirmation after skipping, with a low-pressure pointer to set up auto-pay later.',
      component: Consent.MoneyOnWay,
      notes: {
        assumptions: ['Skipping keeps the customer in the test cohort, so later entry points can reach them.'],
        designInputs: ['The skip label "my money still comes through" makes skipping feel safe, so consent stays freely given.'],
      },
    },

    // ── Around a debit ────────────────────────────────────────────────────────
    'home-autopay-on': {
      title: 'Home — auto-pay on',
      description: 'The repayment card shows auto-pay status. Manual payment stays available but is not the lead action.',
      component: Lifecycle.HomeAutoPayOn,
      notes: {
        assumptions: ['Auto-pay never locks the manual repayment flow.'],
        openQuestions: ['If the customer pays manually before 2:30pm on T-1, do we cancel that day\'s instruction automatically?'],
        designInputs: ['PRD: show auto-debit status "via a callout on the repayment home card".'],
      },
    },
    'home-reminder': {
      title: 'Home — day before',
      description: 'Warning on T-1 before the 2:30pm submission: keep the money in the account tonight.',
      component: Lifecycle.HomeReminder,
      notes: {
        assumptions: ['Reminder push and card go out the morning of T-1, before Tala submits to Monato at 2:30pm.'],
        openQuestions: [
          T_MINUS_ONE,
          'Should the reminder let customers skip this one collection (e.g. salary is late)?',
        ],
        designInputs: [
          'Q3 learning: do customers cancel or move money out in the 24 hours after this warning? Log timestamps against it.',
          'Brief: the day of notice "is a nudge to fund the account, and it is a window to move money out".',
          'Timing debits to payday improves success by 4–7 percentage points.',
        ],
      },
    },
    'home-processing': {
      title: 'Home — debit in progress',
      description: 'Between submission and confirmation. Discourages a double payment during the ~12-hour gap before Tala hears back.',
      component: Lifecycle.HomeProcessing,
      notes: {
        assumptions: [
          'Tala submits at 2:30pm T-1, Monato submits to the bank by 6pm, the bank executes 6pm–12am, and Tala hears by 12pm on T.',
          'For Santander, the bank responds on T+0, so this state is shorter.',
          'Friday–Sunday due dates are excluded because confirmation would take until Monday or Tuesday.',
        ],
        openQuestions: [
          'If a customer pays manually in this window and the debit also succeeds, how quickly do we refund?',
          'Do late fees and collections calls pause until the confirmation arrives?',
        ],
        designInputs: [
          'Arun\'s insurance example: "your auto-debit is scheduled, we suggest you don\'t make any online payment".',
          'The customer sees money leave their bank before Tala knows. This state closes that information gap.',
        ],
      },
    },
    'home-paid': {
      title: 'Home — paid by auto-pay',
      description: 'Success state after Monato confirms. Shows the next due date, with auto-pay still on.',
      component: Lifecycle.HomePaid,
      notes: {
        openQuestions: ['Are collections calls and messages suppressed as soon as the debit is confirmed?'],
        designInputs: [
          'Brief: "the calls actually have to stop" — suppression is where the value comes from.',
          'Every payment is tagged as auto-pay or self-pay (required instrumentation).',
        ],
      },
    },
    'home-failed': {
      title: 'Home — debit failed',
      description: 'The debit failed, usually for lack of funds. The customer is asked to pay manually within the grace period.',
      component: Lifecycle.HomeFailed,
      notes: {
        assumptions: [
          'v1 does not retry failed debits (PRD). Customers pay manually within the 3-day grace period.',
          'The mandate stays active for the next instalment.',
        ],
        openQuestions: [
          'Are retries configurable per market in the framework? If yes, add "We\'ll try again on …".',
          'Which reason codes can we show (insufficient funds, account closed, mandate revoked at the bank)?',
        ],
        designInputs: [
          '2025 test: 58% success, and 41% of failures were insufficient funds. Debits over $1,000 fail more often.',
          'Voice and tone: empathetic, never blaming. Red is used only for the status label.',
        ],
      },
    },

    // ── History ───────────────────────────────────────────────────────────────
    'loan-timeline': {
      title: 'Loan timeline',
      description: 'New transaction history: disbursement, auto-pay on, and every instalment with its auto-pay status.',
      component: Lifecycle.LoanTimeline,
      backTo: 'home-autopay-on',
      notes: {
        assumptions: ['Gen 3 has borrowing history but no transaction history, so this is a new surface.'],
        openQuestions: [
          'Where does this live in the app: the Credit tab, loan details, or Profile?',
          'Should it also show manual payments, fees and refunds?',
        ],
        designInputs: [
          'Arun: a timeline of instalment dates showing whether auto-pay is in progress, succeeded, and when the next attempt is.',
          '"For auto-debits to be successful trust is important — the only way to gain trust is transparency and control."',
        ],
      },
    },
    'debit-detail': {
      title: 'Auto-pay payment detail',
      description: 'One debit, end to end: when it was requested, collected and confirmed, plus how it appears on the statement.',
      component: Lifecycle.DebitDetail,
      backTo: 'loan-timeline',
      notes: {
        assumptions: ['With CLABE the statement shows TALA. Some banks may show Monato or Cobros Domiciliados instead.'],
        openQuestions: [
          'Confirm the statement descriptor for each bank with Monato.',
          'Should Care agents see this exact view? (Brady to design Care visibility.)',
        ],
        designInputs: [
          'Chargeback risk: customers who don\'t recognise "Monato" dispute the charge before Tala confirms it.',
          '"Talk to us first" gives customers a faster route than a bank dispute.',
        ],
      },
    },

    // ── Manage ────────────────────────────────────────────────────────────────
    'autopay-settings': {
      title: 'Auto-pay settings',
      description: 'Status, next collection, account, collection day, agreement, and controls to skip or turn off.',
      component: Manage.AutoPaySettings,
      backTo: 'home-autopay-on',
      notes: {
        assumptions: ['Customer management is Q4 on the roadmap. It is designed now to shape the API contracts.'],
        openQuestions: ['Where is the entry point: the Home card link, the Credit tab, or Profile?'],
        designInputs: [
          'Design requests: pause or cancel the mandate, edit the account, manage the debit date, transaction history.',
          'Banxico: customers can revoke consent at any time.',
        ],
      },
    },
    'change-date': {
      title: 'Collection day',
      description: 'Exploration: collect on the due date, a little earlier, or on payday.',
      component: Manage.ChangeDate,
      backTo: 'autopay-settings',
      notes: {
        assumptions: ['v2 configurability. Not in v1.'],
        openQuestions: [
          'Can the collection day fall after the due date, inside the grace period?',
          'Does changing the day need a new mandate or instruction on Monato?',
        ],
        designInputs: [
          'Paydays in MX are the 15th and 30th. There are payment spikes 2–3 days before the 15th when payday falls on a weekend.',
          'Arun: letting customers move the date "will indirectly solve" the weekend and holiday problem.',
        ],
      },
    },
    'pause-sheet': {
      title: 'Skip next collection',
      description: 'Skip one collection while keeping the mandate for later payments.',
      component: Manage.PauseSheet,
      backTo: 'autopay-settings',
      notes: {
        assumptions: ['Skipping one collection keeps the mandate active.'],
        openQuestions: ['What is the latest time to skip? Probably before the 2:30pm T-1 submission.'],
        designInputs: ['Customer management request: pause.'],
      },
    },
    'cancel-sheet': {
      title: 'Turn off auto-pay',
      description: 'Honest consequences, no guilt. Turning off is free and immediate.',
      component: Manage.CancelSheet,
      backTo: 'autopay-settings',
      notes: {
        assumptions: ['Turning off revokes the mandate on Monato immediately, at no cost to the customer.'],
        openQuestions: ['If turned off after the 2:30pm T-1 submission, can the in-flight instruction still be stopped?'],
        designInputs: [
          'Q3 behaviour metrics: how many cancel, how fast, and how cancellations line up with the reminder notification.',
          'Guardrail: consent revocation rate.',
        ],
      },
    },
    'autopay-off': {
      title: 'Auto-pay is off',
      description: 'Confirms that nothing more will be collected and shows the next payment the customer owes.',
      component: Manage.AutoPayOff,
      notes: {
        designInputs: ['Keeps a one-tap way back in. Consent must still be given again through the full consent screen.'],
      },
    },

    // ── Notifications ─────────────────────────────────────────────────────────
    'pn-all': {
      title: 'All notifications',
      description: 'Every auto-pay push in journey order. Tap one to open where it leads.',
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
      title: 'Push — auto-pay on',
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
      description: 'Morning of T-1: payment due tomorrow, keep the money in the account tonight.',
      component: Push.PushReminder,
      notes: {
        openQuestions: [T_MINUS_ONE],
        designInputs: ['This is the "warning notification" the brief measures cancellations and money movement against.'],
      },
    },
    'pn-processing': {
      title: 'Push — request sent',
      description: 'Sent at submission (2:30pm T-1) so the bank debit that evening is expected.',
      component: Push.PushProcessing,
      notes: {
        designInputs: ['Covers the gap where money leaves the account before Tala can confirm it — the main chargeback trigger.'],
      },
    },
    'pn-paid': {
      title: 'Push — payment received',
      description: 'Sent once Monato confirms success (by 12pm on T).',
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
      title: 'Push — auto-pay off',
      description: 'Confirms a cancellation, including one made at the bank rather than in the app.',
      component: Push.PushCancelled,
      notes: {
        openQuestions: ['Will Monato tell us when a customer revokes the mandate directly with their bank?'],
      },
    },
  },
}

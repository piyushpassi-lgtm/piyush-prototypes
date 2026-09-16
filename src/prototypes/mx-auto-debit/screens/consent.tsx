import { useEffect, useState, type ReactNode } from 'react'
import { CloseBar, ScreenLayout, StickyFooter, TopNav } from '../../../ds/chrome'
import { Bank, Bell, Check, Clock, File, Info, Plus, Refresh, Shield, type Icon } from '../../../ds/icons'
import { AlertArt, CalendarArt, PaperPlaneArt, ShapesLoader } from '../../../ds/illustrations'
import { Button, Callout, Card, DetailRow, ListRow, RadioRow, Segmented, Tag } from '../../../ds/primitives'
import type { ScreenProps } from '../../types'
import { ACCOUNTS, CUSTOMER, DUES, LOAN, accountIdOf, accountOf, accountShort, firstDueFor, sourceOf, type AccountId } from '../data'
import { AccountChip } from './shared'

// ── Consent ───────────────────────────────────────────────────────────────────

const VALUE_PROPS: Array<{ icon: Icon; title: string }> = [
  { icon: Bell, title: 'We remind you the day before' },
  { icon: Bank, title: 'We collect from your bank' },
  { icon: Shield, title: "You're in control" },
]

/** Consent is given by the CTA itself — there is no separate checkbox. */
function consentScreen(allowSkip: boolean) {
  return function Consent({ go, back, state }: ScreenProps) {
    const source = sourceOf(state)
    const account = accountOf(state)
    const due = firstDueFor(state)
    const atDisbursement = source === 'disbursement'

    return (
      <ScreenLayout
        statusClassName="bg-bone-0"
        header={<TopNav title="Auto-pay your loan" onBack={back} />}
        footer={
          <StickyFooter>
            <p className="type-caption text-center text-dark-green-50">
              By turning on auto-pay you accept the direct debit form.
            </p>
            <Button onClick={() => go('setting-up')}>Turn on auto-pay</Button>
            {allowSkip && (
              <Button variant="tertiary" onClick={() => go(atDisbursement ? 'money-on-way' : 'home-card')}>
                {atDisbursement ? 'Skip — my money still comes through' : 'Not now'}
              </Button>
            )}
          </StickyFooter>
        }
      >
        <div className="flex flex-col gap-8 px-4 pb-8 pt-6">
          <section className="flex flex-col gap-4">
            <h3 className="type-subheader-1 text-dark-green-70">How it works</h3>
            <div className="grid grid-cols-3 gap-2">
              {VALUE_PROPS.map(({ icon: PropIcon, title }) => (
                <div key={title} className="flex flex-col items-center gap-2 text-center">
                  <span className="grid size-12 place-items-center rounded-full bg-teal-10 text-teal-90">
                    <PropIcon />
                  </span>
                  <span className="type-label-2 text-dark-green-70">{title}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="type-subheader-1 text-dark-green-70">What you're setting up</h3>
            <Card className="px-4">
              <DetailRow label="Amount" value={`${LOAN.instalment} MXN`} sub="Per payment" />
              <DetailRow label="First collection" value={due.full} sub="Then every due date until your loan is repaid" />
              <DetailRow
                label="From"
                value={<AccountChip account={account} />}
                sub={atDisbursement && accountIdOf(state) === 'bbva' ? "The same account we're sending your money to" : undefined}
                action={
                  <button type="button" onClick={() => go('choose-account')} className="type-action-link text-orange-50">
                    Change
                  </button>
                }
                last
              />
            </Card>
            <Callout tone="warning" icon={Clock}>
              Please maintain sufficient balance for a successful payment on {due.date}.
            </Callout>
          </section>

          <Card className="overflow-hidden">
            <ListRow
              icon={File}
              title="Direct debit form"
              subtitle={`Up to ${LOAN.instalment} per payment, this loan only`}
              onClick={() => go('agreement')}
            />
          </Card>
        </div>
      </ScreenLayout>
    )
  }
}

export const Consent = consentScreen(true)
export const ConsentNoSkip = consentScreen(false)

// ── Agreement ─────────────────────────────────────────────────────────────────

function Filled({ children }: { children: ReactNode }) {
  return <span className="rounded-sm bg-bone-30 px-1 font-semibold text-dark-green-70">{children}</span>
}

export function Agreement({ back, state }: ScreenProps) {
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const account = accountOf(state)
  const due = firstDueFor(state)
  const last = DUES[DUES.length - 1]
  const isCard = account.kind === 'Debit card'

  return (
    <ScreenLayout
      statusClassName="bg-bone-0"
      header={<TopNav title="Direct debit form" onBack={back} />}
      footer={
        <StickyFooter>
          <Button onClick={back}>Back to auto-pay</Button>
        </StickyFooter>
      }
    >
      <div className="flex flex-col gap-4 px-4 pb-8 pt-4">
        <Segmented
          options={[
            ['es', 'Español'],
            ['en', 'English'],
          ]}
          value={lang}
          onChange={setLang}
        />
        <p className="type-caption px-1 text-dark-green-50">
          {lang === 'es' ? 'The official form, filled in with your details.' : 'A plain-language version of the same form.'}
        </p>

        {lang === 'es' ? (
          <Card className="type-body-1 flex flex-col gap-4 p-4 text-dark-green-70">
            <h3 className="type-label-1 text-center">FORMATO PARA SOLICITAR LA DOMICILIACIÓN</h3>
            <p className="type-caption text-right text-dark-green-50">Ciudad de México, 3 de septiembre de 2026</p>
            <p>
              Por medio de la presente, solicito y autorizo que <Filled>Tala</Filled> por cuenta propia o a través de terceros,
              incluyendo a Cobros Domiciliados S.A. de C.V., sus filiales y/o partes relacionadas, realicen cargos periódicos en mi
              cuenta conforme a la siguiente información:
            </p>
            <ol className="flex list-decimal flex-col gap-2 pl-6">
              <li>
                Nombre del proveedor del crédito: <Filled>Tala</Filled>
              </li>
              <li>
                Crédito a pagar: <Filled>Préstamo personal Tala</Filled>
              </li>
              <li>
                Periodicidad del pago: <Filled>quincenal, a partir del {due.es}</Filled>
              </li>
              <li>
                Banco: <Filled>{account.bankFull}</Filled>
              </li>
              <li>
                {isCard ? 'Número de tarjeta de débito (16 dígitos)' : 'CLABE (18 dígitos)'}: <Filled>{account.number}</Filled>
              </li>
              <li>
                Monto máximo fijo por periodo: <Filled>{LOAN.instalment} MXN</Filled>
              </li>
              <li>
                Esta autorización vence el: <Filled>{last.es}</Filled>
              </li>
            </ol>
            <p>
              Estoy enterado de que en cualquier momento podré solicitar la cancelación de la presente domiciliación sin costo a
              mi cargo.
            </p>
            <div className="flex flex-col items-center gap-1 border-t border-bone-50 pt-4">
              <span className="type-body-2">Atentamente,</span>
              <span className="type-label-1">{CUSTOMER.name}</span>
              <span className="type-caption text-dark-green-50">Firma electrónica al activar el pago automático</span>
            </div>
          </Card>
        ) : (
          <Card className="px-4">
            <DetailRow label="Who collects" value="Tala, through Cobros Domiciliados S.A. de C.V." />
            <DetailRow label="What for" value="Your Tala personal loan" />
            <DetailRow label="How often" value="Every 2 weeks" sub={`From ${due.full}`} />
            <DetailRow label="From" value={account.bankFull} sub={`${account.kind} ${account.number}`} />
            <DetailRow label="Most we'll take" value={`${LOAN.instalment} per payment`} />
            <DetailRow label="Ends" value={last.full} sub="When your loan is repaid" />
            <DetailRow label="Cancel" value="Any time, at no cost" last />
          </Card>
        )}
      </div>
    </ScreenLayout>
  )
}

// ── Choose account ────────────────────────────────────────────────────────────

export function ChooseAccount({ go, back, state, setState }: ScreenProps) {
  const [picked, setPicked] = useState<AccountId>(accountIdOf(state))
  const ids = Object.keys(ACCOUNTS) as AccountId[]

  const confirm = () => {
    setState({ account: picked, fromFailure: false })
    if (state.fromFailure) go('consent', { replace: true })
    else back()
  }

  return (
    <ScreenLayout
      statusClassName="bg-bone-0"
      header={<TopNav title="Collect from" onBack={back} />}
      footer={
        <StickyFooter>
          <Button onClick={confirm}>Use this account</Button>
        </StickyFooter>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6">
        <div className="flex flex-col gap-2">
          <h2 className="type-header-2 text-dark-green-70">Which account should we collect from?</h2>
          <p className="type-body-1 text-dark-green-50">It must be in your name. We check this with your bank before turning on auto-pay.</p>
        </div>
        <Card className="px-4">
          {ids.map((id, i) => {
            const a = ACCOUNTS[id]
            return (
              <RadioRow
                key={id}
                checked={picked === id}
                onSelect={() => setPicked(id)}
                title={a.bankFull}
                subtitle={`${a.kind} ····${a.last4}`}
                tag={id === 'bbva' ? <Tag tone="teal">Receiving your loan</Tag> : undefined}
                last={i === ids.length - 1}
              />
            )
          })}
        </Card>
        <button type="button" className="type-label-1 flex items-center gap-2 px-1 text-orange-50">
          <Plus />
          Add a CLABE or debit card
        </button>
        <Callout tone="info" icon={Info}>
          CLABE accounts show TALA on your bank statement, so the charge is easy to recognise.
        </Callout>
      </div>
    </ScreenLayout>
  )
}

// ── Registration (penny drop) ─────────────────────────────────────────────────

export function SettingUp({ go, state }: ScreenProps) {
  const account = accountOf(state)
  const atDisbursement = sourceOf(state) === 'disbursement'

  useEffect(() => {
    const timer = window.setTimeout(() => go('setup-success', { replace: true }), 3000)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScreenLayout>
      <div className="flex h-full flex-col items-center justify-center gap-8 px-10 text-center">
        <button type="button" aria-label="Simulate a failed check" onClick={() => go('setup-failed', { replace: true })}>
          <ShapesLoader />
        </button>
        <div className="flex flex-col gap-2">
          <h2 className="type-header-2 text-dark-green-70">Setting up auto-pay</h2>
          <p className="type-body-1 text-dark-green-50">
            We're checking with {account.bank} that the account is yours. This takes a few seconds.
          </p>
          {atDisbursement && <p className="type-body-2 text-dark-green-50">Your money is sent right after.</p>}
        </div>
      </div>
    </ScreenLayout>
  )
}

export function SetupSuccess({ go, state }: ScreenProps) {
  const account = accountOf(state)
  const due = firstDueFor(state)
  const done = () => go('home-autopay-on')

  if (sourceOf(state) === 'disbursement') {
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
          <div className="flex flex-col gap-6">
            <h1 className="type-header-1 text-dark-green-70">Your money is on the way</h1>
            <PaperPlaneArt className="w-32 self-center" />
            <p className="type-body-1 text-dark-green-50">
              {LOAN.amount} is heading to {accountShort(ACCOUNTS.bbva)}. We'll let you know when it arrives.
            </p>
          </div>
          <Card className="flex gap-4 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green-10 text-green-90">
              <Check />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="type-subheader-1 text-dark-green-70">Auto-pay is on</h3>
              <p className="type-body-2 text-dark-green-70">
                We'll collect {LOAN.instalment} from {accountShort(account)} on {due.date}, and every due date after. We'll remind
                you the day before.
              </p>
            </div>
          </Card>
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout
      header={<CloseBar onClose={done} />}
      footer={
        <StickyFooter>
          <Button onClick={done}>Done</Button>
          <Button variant="tertiary" onClick={() => go('autopay-settings')}>
            View auto-pay settings
          </Button>
        </StickyFooter>
      }
    >
      <div className="flex flex-col gap-6 px-6 pb-8 pt-2">
        <CalendarArt className="w-32 self-center" />
        <div className="flex flex-col gap-2">
          <h1 className="type-header-1 text-dark-green-70">Auto-pay is on</h1>
          <p className="type-body-1 text-dark-green-50">
            There's nothing else to do. We'll remind you the day before each collection.
          </p>
        </div>
        <Card className="px-4">
          <DetailRow label="First collection" value={due.full} />
          <DetailRow label="Amount" value={LOAN.instalment} />
          <DetailRow label="From" value={<AccountChip account={account} />} last />
        </Card>
        <p className="type-caption text-dark-green-50">Change it or turn it off any time from Home › Auto-pay settings.</p>
      </div>
    </ScreenLayout>
  )
}

export function SetupFailed({ go, state, setState }: ScreenProps) {
  const account = accountOf(state)
  const due = firstDueFor(state)
  const atDisbursement = sourceOf(state) === 'disbursement'
  const leave = () => go(atDisbursement ? 'money-on-way' : 'home-card')

  return (
    <ScreenLayout
      header={<CloseBar onClose={leave} />}
      footer={
        <StickyFooter>
          <Button
            onClick={() => {
              setState({ fromFailure: true, consentChecked: false })
              go('choose-account')
            }}
          >
            Try another account
          </Button>
          <Button variant="tertiary" onClick={leave}>
            {atDisbursement ? 'Continue without auto-pay' : 'Not now'}
          </Button>
        </StickyFooter>
      }
    >
      <div className="flex flex-col items-start gap-6 px-6 pb-8 pt-2">
        <AlertArt className="size-20" />
        <div className="flex flex-col gap-2">
          <h1 className="type-header-1 text-dark-green-70">We couldn't set up auto-pay</h1>
          <p className="type-body-1 text-dark-green-50">
            {account.bank} couldn't confirm that account ····{account.last4} is in your name, so no payments have been set up.
          </p>
        </div>
        {atDisbursement ? (
          <Callout tone="success" icon={Check}>
            Your {LOAN.amount} is still on the way. This doesn't affect your loan.
          </Callout>
        ) : (
          <Callout tone="info" icon={Info}>
            Nothing changes with your loan. Pay {LOAN.instalment} by {due.date} as usual.
          </Callout>
        )}
      </div>
    </ScreenLayout>
  )
}

export function MoneyOnWay({ go }: ScreenProps) {
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
        <div className="flex flex-col gap-6">
          <h1 className="type-header-1 text-dark-green-70">Your money is on the way</h1>
          <PaperPlaneArt className="w-32 self-center" />
          <p className="type-body-1 text-dark-green-50">
            {LOAN.amount} is heading to {accountShort(ACCOUNTS.bbva)}. We'll let you know when it arrives.
          </p>
        </div>
        <Card tone="bone" className="flex gap-4 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bone-0 text-teal-90">
            <Refresh />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="type-subheader-1 text-dark-green-70">Auto-pay is here when you want it</h3>
            <p className="type-body-2 text-dark-green-70">Turn it on from Home any time before your first due date, {DUES[0].date}.</p>
          </div>
        </Card>
      </div>
    </ScreenLayout>
  )
}

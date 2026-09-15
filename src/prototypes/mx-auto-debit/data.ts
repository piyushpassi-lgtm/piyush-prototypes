import type { ProtoState } from '../types'

// Simulated customer and loan used across every MX Auto-Debit screen.

export type Source = 'disbursement' | 'home-card' | 'in-app' | 'push' | 'post-payment'

export const CUSTOMER = { name: 'Lauren Sian', firstName: 'Lauren', phone: '+52 56 8913 1818' }

export const LOAN = {
  amount: '$3,000.00',
  instalment: '$625.00',
  total: '$3,750.00',
  count: 6,
  graceUntil: '18 September',
}

// Bi-weekly Tuesdays — the experiment excludes due dates on Fri–Sun and holidays.
export const DUES = [
  { n: 1, date: '15 September', full: '15 September 2026', short: '15 Sep', request: '14 September', es: '15 de septiembre de 2026' },
  { n: 2, date: '29 September', full: '29 September 2026', short: '29 Sep', request: '28 September', es: '29 de septiembre de 2026' },
  { n: 3, date: '13 October', full: '13 October 2026', short: '13 Oct', request: '12 October', es: '13 de octubre de 2026' },
  { n: 4, date: '27 October', full: '27 October 2026', short: '27 Oct', request: '26 October', es: '27 de octubre de 2026' },
  { n: 5, date: '10 November', full: '10 November 2026', short: '10 Nov', request: '9 November', es: '10 de noviembre de 2026' },
  { n: 6, date: '24 November', full: '24 November 2026', short: '24 Nov', request: '23 November', es: '24 de noviembre de 2026' },
]

export const ACCOUNTS = {
  bbva: { bank: 'BBVA', bankFull: 'BBVA Bancomer', kind: 'CLABE', last4: '8367', number: '012 180 00123458836 7' },
  banorte: { bank: 'Banorte', bankFull: 'Banorte', kind: 'Debit card', last4: '4421', number: '5204 1180 0932 4421' },
}

export type AccountId = keyof typeof ACCOUNTS
export type Account = (typeof ACCOUNTS)[AccountId]

export const sourceOf = (state: ProtoState): Source => (state.source as Source | undefined) ?? 'home-card'
export const accountIdOf = (state: ProtoState): AccountId => (state.account === 'banorte' ? 'banorte' : 'bbva')
export const accountOf = (state: ProtoState): Account => ACCOUNTS[accountIdOf(state)]
export const accountShort = (a: Account) => `${a.bank} ····${a.last4}`
export const accountLong = (a: Account) => `${a.bank} · ${a.kind} ····${a.last4}`
export const firstDueFor = (state: ProtoState) => (sourceOf(state) === 'post-payment' ? DUES[1] : DUES[0])

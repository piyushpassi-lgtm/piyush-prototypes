import { mxAutoDebit } from './mx-auto-debit'
import type { Prototype } from './types'

// Add new prototypes here — the sidebar, routing and notes panel pick them up automatically.
export const PROTOTYPES: Prototype[] = [mxAutoDebit]

export function findPrototype(id?: string) {
  return PROTOTYPES.find((p) => p.id === id) ?? PROTOTYPES[0]
}

export function screenOrder(proto: Prototype) {
  return [...new Set(proto.sections.flatMap((s) => s.screens))]
}

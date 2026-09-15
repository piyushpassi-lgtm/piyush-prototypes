import type { ComponentType } from 'react'

/** Shared, per-prototype state that survives screen changes (e.g. which entry point started consent). */
export type ProtoState = Record<string, string | boolean | undefined>

export type GoOptions = { replace?: boolean }

export type ScreenProps = {
  go: (screenId: string, options?: GoOptions) => void
  back: () => void
  state: ProtoState
  setState: (patch: ProtoState) => void
}

export type ScreenNotes = {
  assumptions?: string[]
  openQuestions?: string[]
  designInputs?: string[]
}

export type ScreenDef = {
  title: string
  /** One or two lines — shown in the sidebar and at the top of the notes panel. */
  description: string
  component: ComponentType<ScreenProps>
  notes?: ScreenNotes
  /** Where "back" lands when the screen was opened directly from the sidebar. */
  backTo?: string
}

export type SectionKind = 'entry' | 'flow' | 'notifications'

export type Section = {
  id: string
  label: string
  kind: SectionKind
  screens: string[]
}

export type Prototype = {
  id: string
  title: string
  market: string
  flag: string
  status: string
  updated: string
  summary: string
  initialState: ProtoState
  sections: Section[]
  screens: Record<string, ScreenDef>
}

import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Notes } from '../ds/icons'
import { cx } from '../lib/cx'
import type { Prototype, ScreenDef } from '../prototypes/types'
import { countNotes } from './NotesPanel'

export function StageHeader({
  proto,
  screenId,
  screen,
  index,
  total,
  onStep,
  showNotesToggle,
  notesOpen,
  onToggleNotes,
}: {
  proto: Prototype
  screenId: string
  screen: ScreenDef
  index: number
  total: number
  onStep: (delta: number) => void
  showNotesToggle: boolean
  notesOpen: boolean
  onToggleNotes: () => void
}) {
  const section = proto.sections.find((s) => s.screens.includes(screenId))
  const notes = countNotes(screen)

  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center justify-between gap-4 px-6">
      <div className="min-w-0">
        <p className="truncate text-[10.5px] font-semibold uppercase tracking-[0.12em] text-dark-green-50">
          {proto.title} · {section?.label}
        </p>
        <h2 className="type-subheader-1 truncate text-dark-green-70">{screen.title}</h2>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="type-caption tabular-nums text-dark-green-50">
          {index + 1} / {total}
        </span>
        <StepButton label="Previous screen" disabled={index === 0} onClick={() => onStep(-1)}>
          <ChevronLeft size={16} />
        </StepButton>
        <StepButton label="Next screen" disabled={index === total - 1} onClick={() => onStep(1)}>
          <ChevronRight size={16} />
        </StepButton>
        {showNotesToggle && (
          <button
            type="button"
            onClick={onToggleNotes}
            className={cx(
              'type-label-2 ml-2 flex h-8 items-center gap-2 rounded-full border px-3 transition-colors',
              notesOpen ? 'border-dark-green-70 bg-dark-green-70 text-bone-0' : 'border-bone-50 bg-bone-0 text-dark-green-70 hover:border-dark-green-30',
            )}
          >
            <Notes size={16} />
            Notes
            {notes > 0 && <span className="rounded-full bg-orange-50 px-1.5 text-[10px] leading-4 text-bone-0">{notes}</span>}
          </button>
        )}
      </div>
    </header>
  )
}

function StepButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full border border-bone-50 bg-bone-0 text-dark-green-70 transition-colors hover:border-dark-green-30 disabled:opacity-40"
    >
      {children}
    </button>
  )
}

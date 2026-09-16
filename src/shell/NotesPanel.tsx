import { Close } from '../ds/icons'
import { cx } from '../lib/cx'
import type { ScreenDef, ScreenNotes } from '../prototypes/types'

const GROUPS: Array<{ key: keyof ScreenNotes; label: string; dot: string }> = [
  { key: 'information', label: 'Information', dot: 'bg-dark-green-50' },
  { key: 'assumptions', label: 'Assumptions', dot: 'bg-teal-50' },
  { key: 'openQuestions', label: 'Open questions', dot: 'bg-orange-50' },
  { key: 'engineeringQuestions', label: 'Engineering questions', dot: 'bg-green-90' },
  { key: 'designInputs', label: 'Design inputs', dot: 'bg-dark-green-70' },
]

export function countNotes(screen: ScreenDef) {
  return GROUPS.reduce((sum, g) => sum + (screen.notes?.[g.key]?.length ?? 0), 0)
}

export function NotesPanel({ screen, onClose }: { screen: ScreenDef; onClose?: () => void }) {
  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l border-bone-50 bg-bone-10">
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-dark-green-50">
          Screen notes · {countNotes(screen)}
        </span>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close notes" className="grid size-8 place-items-center rounded-full hover:bg-bone-30">
            <Close size={16} />
          </button>
        )}
      </div>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <NotesContent screen={screen} />
      </div>
    </aside>
  )
}

export function NotesContent({ screen }: { screen: ScreenDef }) {
  const total = countNotes(screen)
  return (
    <div className="flex flex-col gap-4 px-5 pb-8">
      <div className="flex flex-col gap-2">
        <h3 className="type-header-2 text-dark-green-70">{screen.title}</h3>
        <p className="text-[13px] leading-5 text-dark-green-50">{screen.description}</p>
      </div>
      {total === 0 ? (
        <div className="rounded-md border border-dashed border-bone-50 p-4 text-[13px] leading-5 text-dark-green-50">
          No assumptions, open questions or design inputs for this screen yet.
        </div>
      ) : (
        GROUPS.map((group) => {
          const items = screen.notes?.[group.key] ?? []
          if (items.length === 0) return null
          return (
            <section key={group.key} className="rounded-md bg-bone-0 p-4 shadow-surface-1">
              <header className="mb-3 flex items-center gap-2">
                <span className={cx('size-2 rounded-full', group.dot)} />
                <h4 className="type-label-1 text-dark-green-70">{group.label}</h4>
                <span className="type-caption ml-auto text-dark-green-50">{items.length}</span>
              </header>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item} className="flex gap-2 text-[13px] leading-5 text-dark-green-70">
                    <span className={cx('mt-2 size-1 shrink-0 rounded-full', group.dot)} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })
      )}
    </div>
  )
}

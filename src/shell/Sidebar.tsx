import { useState } from 'react'
import { Wordmark } from '../ds/chrome'
import { Bell, Check, ChevronDown } from '../ds/icons'
import { cx } from '../lib/cx'
import { screenOrder } from '../prototypes/registry'
import type { Prototype, SectionKind } from '../prototypes/types'

export type NavProps = {
  prototypes: Prototype[]
  proto: Prototype
  screenId: string
  onSelect: (protoId: string, screenId: string) => void
}

export function Sidebar(props: NavProps) {
  return (
    <aside className="flex h-full w-[296px] shrink-0 flex-col bg-shell-ink text-bone-0">
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <Wordmark className="h-4 w-auto text-teal-50" />
        <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40">Prototypes</span>
      </div>
      <PrototypeNav {...props} />
      <div className="border-t border-white/5 px-5 py-4 text-[11px] text-white/30">
        All data is simulated · Updated {props.proto.updated}
      </div>
    </aside>
  )
}

export function PrototypeNav({ prototypes, proto, screenId, onSelect }: NavProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => setPickerOpen((open) => !open)}
          className="flex w-full items-center gap-3 rounded-sm bg-white/5 px-3 py-2.5 text-left transition-colors hover:bg-white/10"
        >
          <span className="text-xl leading-none">{proto.flag}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold">{proto.title}</span>
            <span className="block truncate text-[11px] text-white/40">
              {proto.market} · {proto.status}
            </span>
          </span>
          <ChevronDown size={16} className={cx('text-white/40 transition-transform', pickerOpen && 'rotate-180')} />
        </button>
        {pickerOpen && (
          <div className="mt-1 flex flex-col gap-px rounded-sm border border-white/5 bg-shell-panel p-1">
            {prototypes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPickerOpen(false)
                  onSelect(p.id, screenOrder(p)[0])
                }}
                className="flex items-center gap-3 rounded-sm px-2 py-2 text-left hover:bg-white/5"
              >
                <span>{p.flag}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium">{p.title}</span>
                  <span className="line-clamp-2 block text-[11px] leading-snug text-white/35">{p.summary}</span>
                </span>
                {p.id === proto.id && <Check size={16} className="text-orange-50" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 pb-6">
        {proto.sections.map((section) => {
          const open = !collapsed[section.id]
          return (
            <div key={section.id}>
              <button
                type="button"
                onClick={() => setCollapsed((c) => ({ ...c, [section.id]: open }))}
                className="flex w-full items-center justify-between px-2 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/40 hover:text-white/70"
              >
                <span className="flex items-center gap-2">
                  {section.label}
                  <span className="rounded-full bg-white/5 px-1.5 text-[10px] tracking-normal">{section.screens.length}</span>
                </span>
                <ChevronDown size={16} className={cx('transition-transform', !open && '-rotate-90')} />
              </button>
              {open && (
                <ul className="mt-1 flex flex-col gap-px">
                  {section.screens.map((id, i) => {
                    const s = proto.screens[id]
                    const active = id === screenId
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => onSelect(proto.id, id)}
                          className={cx(
                            'flex w-full gap-3 rounded-sm px-2 py-2 text-left transition-colors',
                            active ? 'bg-orange-50/15' : 'hover:bg-white/5',
                          )}
                        >
                          <Marker kind={section.kind} index={i} active={active} />
                          <span className={cx('min-w-0 text-[12.5px] font-medium leading-tight', active ? 'text-bone-0' : 'text-white/70')}>
                            {s.title}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

function Marker({ kind, index, active }: { kind: SectionKind; index: number; active: boolean }) {
  if (kind === 'entry') {
    return (
      <span
        className={cx(
          'mt-px grid size-4 shrink-0 place-items-center rounded-full text-[9.5px] font-semibold',
          active ? 'bg-orange-50 text-bone-0' : 'bg-white/10 text-white/50',
        )}
      >
        {index + 1}
      </span>
    )
  }
  if (kind === 'notifications') {
    return (
      <span className={cx('mt-px shrink-0', active ? 'text-orange-50' : 'text-white/30')}>
        <Bell size={16} />
      </span>
    )
  }
  return (
    <span className="grid size-4 shrink-0 place-items-center">
      <span className={cx('mt-1 block size-1.5 rounded-full', active ? 'bg-orange-50' : 'bg-white/20')} />
    </span>
  )
}

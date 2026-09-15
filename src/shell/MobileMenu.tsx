import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Close, Menu } from '../ds/icons'
import { cx } from '../lib/cx'
import type { ScreenDef } from '../prototypes/types'
import { NotesContent, countNotes } from './NotesPanel'
import { PrototypeNav, type NavProps } from './Sidebar'

/** On phones the prototype runs full-screen; navigation and notes live behind an edge tab. */
export function MobileMenu({ screen, ...nav }: NavProps & { screen: ScreenDef }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'screens' | 'notes'>('screens')
  const notes = countNotes(screen)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open prototype menu"
        className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-sm bg-shell-ink/90 px-1.5 py-3 text-bone-0 shadow-surface-1"
      >
        <Menu size={16} />
        {notes > 0 && <span className="grid size-4 place-items-center rounded-full bg-orange-50 text-[9px] font-semibold">{notes}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-lg bg-shell-ink text-bone-0"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            >
              <div className="flex shrink-0 items-center gap-2 px-4 py-3">
                <div className="flex flex-1 rounded-full bg-white/5 p-1">
                  {(['screens', 'notes'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={cx(
                        'h-8 flex-1 rounded-full text-[12.5px] font-semibold transition-colors',
                        tab === t ? 'bg-orange-50 text-bone-0' : 'text-white/50',
                      )}
                    >
                      {t === 'screens' ? 'Screens' : `Notes · ${notes}`}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-full text-white/60">
                  <Close />
                </button>
              </div>
              {tab === 'screens' ? (
                <PrototypeNav
                  {...nav}
                  onSelect={(protoId, id) => {
                    setOpen(false)
                    nav.onSelect(protoId, id)
                  }}
                />
              ) : (
                <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto bg-bone-10 pt-5 text-dark-green-70">
                  <NotesContent screen={screen} />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

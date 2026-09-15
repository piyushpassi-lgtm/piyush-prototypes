import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { setRoute, useHashRoute } from '../lib/router'
import { useMediaQuery } from '../lib/useMediaQuery'
import { PROTOTYPES, findPrototype, screenOrder } from '../prototypes/registry'
import type { GoOptions, ProtoState } from '../prototypes/types'
import { MobileMenu } from './MobileMenu'
import { NotesPanel } from './NotesPanel'
import { PhoneDevice } from './PhoneDevice'
import { Sidebar } from './Sidebar'
import { StageHeader } from './StageHeader'

const slide = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
}

export function Shell() {
  const route = useHashRoute()
  const proto = findPrototype(route.protoId)
  const order = useMemo(() => screenOrder(proto), [proto])
  const screenId = route.screenId && proto.screens[route.screenId] ? route.screenId : order[0]
  const screen = proto.screens[screenId]
  const index = order.indexOf(screenId)

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isWide = useMediaQuery('(min-width: 1320px)')
  const [notesOpen, setNotesOpen] = useState(false)

  // Per-prototype shared state
  const [states, setStates] = useState<Record<string, ProtoState>>({})
  const state = states[proto.id] ?? proto.initialState
  const setState = (patch: ProtoState) =>
    setStates((all) => ({ ...all, [proto.id]: { ...(all[proto.id] ?? proto.initialState), ...patch } }))

  // Slide direction follows the screen order
  const key = `${proto.id}/${screenId}`
  const [nav, setNav] = useState({ key, dir: 1 })
  if (nav.key !== key) {
    const [prevProto, prevScreen] = nav.key.split('/')
    const prevIndex = prevProto === proto.id ? order.indexOf(prevScreen) : -1
    setNav({ key, dir: index >= prevIndex ? 1 : -1 })
  }

  useEffect(() => {
    if (route.protoId !== proto.id || route.screenId !== screenId) setRoute(proto.id, screenId, true)
  }, [route.protoId, route.screenId, proto.id, screenId])

  // In-flow history depth, so "back" never leaves the site
  const depth = useRef(0)
  const go = (id: string, options?: GoOptions) => {
    if (options?.replace) return setRoute(proto.id, id, true)
    depth.current += 1
    setRoute(proto.id, id)
  }
  const back = () => {
    if (depth.current > 0) {
      depth.current -= 1
      window.history.back()
      return
    }
    setRoute(proto.id, screen.backTo ?? order[Math.max(0, index - 1)])
  }
  const jump = (protoId: string, id: string) => {
    depth.current = 0
    setRoute(protoId, id)
  }
  const step = (delta: number) => {
    const next = order[index + delta]
    if (next) jump(proto.id, next)
  }

  useEffect(() => {
    if (!isDesktop) return
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.metaKey || event.ctrlKey) return
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const Screen = screen.component
  const screenNode = (
    <div className="relative h-full w-full overflow-hidden bg-bone-10">
      <AnimatePresence initial={false} custom={nav.dir}>
        <motion.div
          key={nav.key}
          custom={nav.dir}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <Screen go={go} back={back} state={state} setState={setState} />
        </motion.div>
      </AnimatePresence>
    </div>
  )

  const navProps = { prototypes: PROTOTYPES, proto, screenId, onSelect: jump }

  if (!isDesktop) {
    return (
      <div className="relative h-dvh w-full overflow-hidden bg-bone-10">
        {screenNode}
        <MobileMenu {...navProps} screen={screen} />
      </div>
    )
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <Sidebar {...navProps} />
      <main className="relative flex min-w-0 flex-1 flex-col bg-bone-20">
        <DotField />
        <StageHeader
          proto={proto}
          screenId={screenId}
          index={index}
          total={order.length}
          onStep={step}
          screen={screen}
          showNotesToggle={!isWide}
          notesOpen={notesOpen}
          onToggleNotes={() => setNotesOpen((open) => !open)}
        />
        <PhoneDevice>{screenNode}</PhoneDevice>
        <p className="relative pb-4 text-center text-[11px] text-dark-green-50/70">Use ← → to step through every screen</p>
        {!isWide && (
          <AnimatePresence>
            {notesOpen && (
              <motion.div
                className="absolute bottom-0 right-0 top-0 z-20 shadow-2xl"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 34, stiffness: 320 }}
              >
                <NotesPanel screen={screen} onClose={() => setNotesOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
      {isWide && <NotesPanel screen={screen} />}
    </div>
  )
}

function DotField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(var(--color-bone-50) 1.3px, transparent 1.3px)',
        backgroundSize: '20px 20px',
        maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 90%)',
      }}
    />
  )
}

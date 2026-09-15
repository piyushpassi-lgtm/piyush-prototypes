import { useEffect, useRef, useState, type ReactNode } from 'react'

const SCREEN_W = 360
const SCREEN_H = 780
const BEZEL = 12
const FRAME_W = SCREEN_W + BEZEL * 2
const FRAME_H = SCREEN_H + BEZEL * 2

/** Desktop-only device frame that scales down to fit the stage. */
export function PhoneDevice({ children }: { children: ReactNode }) {
  const areaRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const area = areaRef.current
    if (!area) return
    const fit = () => {
      const { width, height } = area.getBoundingClientRect()
      setScale(Math.min(1, (height - 16) / FRAME_H, (width - 32) / FRAME_W))
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(area)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={areaRef} className="relative flex min-h-0 w-full flex-1 items-center justify-center">
      <div style={{ width: FRAME_W * scale, height: FRAME_H * scale }}>
        <div
          className="relative rounded-[56px] bg-shell-frame shadow-[0_30px_80px_-20px_rgba(14,24,16,0.45)]"
          style={{ width: FRAME_W, height: FRAME_H, padding: BEZEL, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          <div className="relative overflow-hidden rounded-[44px] bg-bone-10" style={{ width: SCREEN_W, height: SCREEN_H }}>
            {children}
            <div className="pointer-events-none absolute left-1/2 top-2.5 z-50 h-7 w-24 -translate-x-1/2 rounded-full bg-shell-frame" />
          </div>
        </div>
      </div>
    </div>
  )
}

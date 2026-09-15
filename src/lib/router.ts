import { useEffect, useState } from 'react'

// Hash routes (#/<prototype>/<screen>) so GitHub Pages never 404s on refresh.

export type Route = { protoId?: string; screenId?: string }

function parse(): Route {
  const [protoId, screenId] = window.location.hash.replace(/^#\/?/, '').split('/')
  return { protoId: protoId || undefined, screenId: screenId || undefined }
}

export function useHashRoute() {
  const [route, setRouteState] = useState(parse)
  useEffect(() => {
    const onChange = () => setRouteState(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function setRoute(protoId: string, screenId: string, replace = false) {
  const hash = `#/${protoId}/${screenId}`
  if (replace) {
    window.history.replaceState(null, '', hash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = hash
  }
}

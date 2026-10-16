import { useCallback, useEffect, useState } from 'react'
import { useAdminAuth } from '../context/adminAuth.js'

// Loads an admin API path and reloads it when the path changes or the tab regains focus.
export function useAdminData(path) {
  const { call } = useAdminAuth()
  const [state, setState] = useState({ data: null, error: null, key: null })
  const [version, setVersion] = useState(0)
  const key = `${path}#${version}`

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    let cancelled = false
    call(path)
      .then((data) => !cancelled && setState({ data, error: null, key }))
      .catch((error) => !cancelled && setState((s) => ({ ...s, error, key })))
    return () => {
      cancelled = true
    }
  }, [call, path, key])

  useEffect(() => {
    window.addEventListener('focus', reload)
    return () => window.removeEventListener('focus', reload)
  }, [reload])

  // Lets a page show the server's answer after a change without loading again.
  const replace = useCallback((data) => setState({ data, error: null, key }), [key])

  // Loading while the latest request hasn't answered yet; the previous data stays on screen.
  return { data: state.data, error: state.error, loading: state.key !== key, reload, replace }
}

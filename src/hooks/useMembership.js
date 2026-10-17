import { useCallback, useEffect, useState } from 'react'
import { useAccount } from '../context/account.js'

// The signed-in customer's membership: { spent, tier, next, tiers, memberNo, memberSince }.
// status: 'guest' | 'loading' | 'ready' | 'error'. reload() fetches it again, e.g. after a price change.
export function useMembership() {
  const { signedIn, token, call } = useAccount()
  const [state, setState] = useState({ token: null, membership: null, failed: false })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!signedIn) return
    let cancelled = false
    call('/api/account/membership')
      .then((body) => !cancelled && setState({ token, membership: body.membership, failed: false }))
      .catch(() => !cancelled && setState({ token, membership: null, failed: true }))
    return () => {
      cancelled = true
    }
  }, [signedIn, token, call, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const current = signedIn && state.token === token ? state : null
  const status = !signedIn ? 'guest' : !current ? 'loading' : current.failed ? 'error' : 'ready'
  return { membership: current?.membership ?? null, status, reload }
}

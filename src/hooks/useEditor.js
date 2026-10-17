import { useRef, useState } from 'react'
import { useBlocker, useNavigate } from 'react-router'
import { useAdminAuth } from '../context/adminAuth.js'

// State for one admin editor: the form, field errors, the save message and an
// unsaved-changes guard. toForm/toBody convert between the API shape and form fields.
export function useEditor({ initial, notice, toForm = (x) => x, toBody = (x) => x }) {
  const { call } = useAdminAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(notice ? { type: 'ok', text: notice } : null) // { type: 'ok' | 'error', text }
  const [busy, setBusy] = useState(false)

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)
  // Set just before leaving on purpose (after adding or deleting), when there's nothing to lose.
  const leaving = useRef(false)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => dirty && !leaving.current && currentLocation.pathname !== nextLocation.pathname,
  )

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const setValue = (key, value) => setForm((f) => ({ ...f, [key]: typeof value === 'function' ? value(f[key]) : value }))

  // Sends the form. Returns the server's answer, or null when it was refused.
  async function save(path, method, pick) {
    setBusy(true)
    setMessage(null)
    try {
      const body = await call(path, { method, body: JSON.stringify(toBody(form)) })
      const next = toForm(pick(body))
      setErrors({})
      setForm(next)
      setSaved(next)
      return body
    } catch (err) {
      setErrors(err.body?.fields ?? {})
      setMessage({ type: 'error', text: err.body?.fields ? 'Please fix the highlighted fields.' : err.message })
      return null
    } finally {
      setBusy(false)
    }
  }

  async function remove(path, thenGo) {
    setBusy(true)
    try {
      await call(path, { method: 'DELETE' })
      leaving.current = true
      navigate(thenGo, { replace: true })
      return true
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
      setBusy(false)
      return false
    }
  }

  function leave(to, options) {
    leaving.current = true
    navigate(to, options)
  }

  return { form, setForm, set, setValue, errors, message, setMessage, busy, dirty, blocker, save, remove, leave }
}

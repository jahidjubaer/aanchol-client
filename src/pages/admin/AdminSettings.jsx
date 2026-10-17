import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Field, LoadError, Loading, Section, ToggleRow } from '../../components/admin/FormParts.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminAuth } from '../../context/adminAuth.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { formatPrice } from '../../utils/formatPrice.js'

const MAX_TIERS = 6

function Message({ message }) {
  if (!message) return null
  return (
    <p role={message.type === 'error' ? 'alert' : 'status'} className={`mt-3 text-sm ${message.type === 'error' ? 'text-error' : 'text-accent'}`}>
      {message.text}
    </p>
  )
}

// Levels by spend on delivered orders. Saved as a whole list.
function Tiers({ initial, onSaved }) {
  const { call } = useAdminAuth()
  const [rows, setRows] = useState(() => initial.map((t) => ({ ...t, min: String(t.min), percent: String(t.percent) })))
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  const set = (i, key) => (e) => setRows((list) => list.map((r, j) => (j === i ? { ...r, [key]: e.target.value } : r)))

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const body = { memberTiers: rows.map((r) => ({ name: r.name, min: Number(r.min), percent: Number(r.percent) })) }
      const { settings } = await call('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(body) })
      setRows(settings.memberTiers.map((t) => ({ ...t, min: String(t.min), percent: String(t.percent) })))
      onSaved(settings)
      setMessage({ type: 'ok', text: 'Saved. Checkout uses the new levels straight away.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.body?.fields?.memberTiers ?? err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Section title="Membership levels">
      <form onSubmit={save}>
        <p className="mb-4 text-sm opacity-70">
          A customer reaches a level by what they've spent on <strong className="font-normal">delivered</strong> orders, all time. The discount comes off every order, on top of
          sale prices.
        </p>
        <div className="grid gap-3">
          <div className="hidden grid-cols-[1fr_9rem_6rem_2.5rem] gap-3 text-xs uppercase tracking-[0.15em] opacity-60 sm:grid">
            <span>Name</span>
            <span>From spend (৳)</span>
            <span>Discount %</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 border-b border-base-300 pb-3 sm:grid-cols-[1fr_9rem_6rem_2.5rem] sm:border-0 sm:pb-0">
              <input value={r.name} onChange={set(i, 'name')} aria-label="Level name" placeholder="Gold" className="input col-span-2 w-full sm:col-span-1" />
              <input value={r.min} onChange={set(i, 'min')} aria-label="From spend" type="number" inputMode="numeric" min={1} className="input w-full" />
              <input value={r.percent} onChange={set(i, 'percent')} aria-label="Discount percent" type="number" inputMode="numeric" min={1} max={20} className="input w-full" />
              <button
                type="button"
                disabled={rows.length === 1}
                onClick={() => setRows((list) => list.filter((_, j) => j !== i))}
                aria-label={`Remove ${r.name || 'level'}`}
                className="btn btn-ghost btn-square col-start-2 justify-self-end sm:col-start-auto"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {rows.length < MAX_TIERS && (
            <button type="button" onClick={() => setRows((list) => [...list, { name: '', min: '', percent: '' }])} className="btn btn-ghost btn-sm uppercase tracking-[0.15em]">
              <Plus size={14} /> Add level
            </button>
          )}
          <button type="submit" disabled={busy} className="btn btn-primary btn-sm ml-auto uppercase tracking-[0.15em]">
            {busy && <span className="loading loading-spinner loading-xs" />} Save levels
          </button>
        </div>
        <Message message={message} />
      </form>
    </Section>
  )
}

function GiftWrap({ initial, onSaved }) {
  const { call } = useAdminAuth()
  const [enabled, setEnabled] = useState(initial.enabled)
  const [fee, setFee] = useState(String(initial.fee))
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const { settings } = await call('/api/admin/settings', { method: 'PATCH', body: JSON.stringify({ giftWrap: { enabled, fee: Number(fee) } }) })
      onSaved(settings)
      setMessage({ type: 'ok', text: 'Saved.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.body?.fields?.giftWrap ?? err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Section title="Gift wrap">
      <form onSubmit={save} className="grid gap-4">
        <ToggleRow label="Offer gift wrap at checkout" hint="With a message card. Orders show the message for whoever packs them." checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        <Field label="Fee (৳)" hint="0 makes it free.">
          <input value={fee} onChange={(e) => setFee(e.target.value)} type="number" inputMode="numeric" min={0} className="input w-40" />
        </Field>
        <div className="flex">
          <button type="submit" disabled={busy} className="btn btn-primary btn-sm ml-auto uppercase tracking-[0.15em]">
            {busy && <span className="loading loading-spinner loading-xs" />} Save gift wrap
          </button>
        </div>
        <Message message={message} />
      </form>
    </Section>
  )
}

// bKash / Nagad "Send Money" numbers. With one on, every order needs an advance before it can be confirmed.
function Payments({ initial, onSaved }) {
  const { call } = useAdminAuth()
  const [form, setForm] = useState(initial)
  const [minAdvance, setMinAdvance] = useState(String(initial.minAdvance))
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)
  const setWallet = (w, key) => (e) => setForm((f) => ({ ...f, [w]: { ...f[w], [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value } }))

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const body = { payments: { bkash: form.bkash, nagad: form.nagad, minAdvance: Number(minAdvance) } }
      const { settings } = await call('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(body) })
      setForm(settings.payments)
      onSaved(settings)
      setMessage({ type: 'ok', text: settings.payments.bkash.enabled || settings.payments.nagad.enabled ? 'Saved. Checkout now asks for the advance.' : 'Saved. Orders are plain cash on delivery.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.body?.fields?.payments ?? err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Section title="Payments">
      <form onSubmit={save} className="grid gap-5">
        <p className="text-sm opacity-70">
          Customers send the delivery charge (or the full amount) by <strong className="font-normal">Send Money</strong> to your personal number and type the transaction ID.
          You check it in your app, tap <em>Payment received</em> on the order, and only then can it be confirmed. The rest is cash on delivery.
        </p>
        {[
          ['bkash', 'bKash'],
          ['nagad', 'Nagad'],
        ].map(([w, label]) => (
          <div key={w} className="grid gap-3 border-t border-base-300 pt-4 sm:grid-cols-[1fr_14rem] sm:items-end">
            <ToggleRow label={`Take ${label}`} hint={`Customers Send Money to your ${label} number.`} checked={form[w].enabled} onChange={setWallet(w, 'enabled')} />
            <Field label={`${label} number`}>
              <input value={form[w].number} onChange={setWallet(w, 'number')} type="tel" inputMode="tel" placeholder="01XXXXXXXXX" className="input w-full" />
            </Field>
          </div>
        ))}
        <Field label="Advance when delivery is free (৳)" hint="Inside Dhaka delivery is free, so this is asked instead. Outside Dhaka the delivery charge is the advance.">
          <input value={minAdvance} onChange={(e) => setMinAdvance(e.target.value)} type="number" inputMode="numeric" min={0} className="input w-40" />
        </Field>
        <div className="flex">
          <button type="submit" disabled={busy} className="btn btn-primary btn-sm ml-auto uppercase tracking-[0.15em]">
            {busy && <span className="loading loading-spinner loading-xs" />} Save payments
          </button>
        </div>
        <Message message={message} />
      </form>
    </Section>
  )
}

export default function AdminSettings() {
  const { data, error, reload, replace } = useAdminData('/api/admin/settings')

  return (
    <div className="mx-auto grid max-w-3xl gap-4 px-4 pb-16 pt-8 md:px-8">
      <title>{`Settings | ${BRAND.name} Admin`}</title>
      <div>
        <h1 className="text-3xl md:text-4xl">Settings</h1>
        <p className="mt-1 text-sm opacity-60">
          Payments, membership levels and gift wrap. Gift cards have{' '}
          <Link to="/admin/gift-cards" className="underline underline-offset-4">
            their own tab
          </Link>
          .
        </p>
      </div>
      {error && !data && <LoadError error={error} onRetry={reload} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <Payments initial={data.settings.payments} onSaved={(settings) => replace({ ...data, settings })} />
          <Tiers initial={data.settings.memberTiers} onSaved={(settings) => replace({ ...data, settings })} />
          <div className="border border-base-300 bg-base-100 p-5 text-sm md:p-6">
            <p className="eyebrow mb-3">What customers see</p>
            <ul className="grid gap-1 sm:grid-cols-2">
              {data.settings.memberTiers.map((t) => (
                <li key={t.name}>
                  <strong className="font-normal">{t.name}</strong>: {t.percent}% off, from {formatPrice(t.min)} spent
                </li>
              ))}
            </ul>
          </div>
          <GiftWrap initial={data.settings.giftWrap} onSaved={(settings) => replace({ ...data, settings })} />
        </>
      )}
    </div>
  )
}

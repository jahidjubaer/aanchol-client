import { MapPin, Plus, Star } from 'lucide-react'
import { useState } from 'react'
import TextField from '../../components/ui/TextField.jsx'
import { useAccount } from '../../context/account.js'

const MAX = 5
const blank = (customer) => ({ label: '', name: customer?.name ?? '', phone: customer?.phone ?? '', city: '', address: '', makeDefault: false })

function AddressForm({ initial, onSave, onCancel, busy, errors }) {
  const [form, setForm] = useState(initial)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(form)
      }}
      noValidate
      className="grid gap-4 border border-base-300 bg-base-100 p-5 sm:grid-cols-2"
    >
      <TextField label="Label" optional placeholder="Home, Office…" value={form.label} onChange={set('label')} error={errors.label} />
      <TextField label="Name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
      <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
      <TextField label="City / District" autoComplete="address-level2" value={form.city} onChange={set('city')} error={errors.city} />
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs uppercase tracking-[0.15em]" htmlFor="address-lines">
          Full address
        </label>
        <textarea
          id="address-lines"
          rows={3}
          autoComplete="street-address"
          value={form.address}
          onChange={set('address')}
          placeholder="House, road, area"
          className={`textarea w-full ${errors.address ? 'textarea-error' : ''}`}
        />
        {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
      </div>
      <label className="flex cursor-pointer items-center gap-3 text-sm sm:col-span-2">
        <input type="checkbox" checked={form.makeDefault} onChange={set('makeDefault')} className="checkbox checkbox-sm checkbox-primary" />
        Use this address first at checkout
      </label>
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" disabled={busy} className="btn btn-primary uppercase tracking-[0.15em]">
          {busy && <span className="loading loading-spinner loading-sm" />} Save address
        </button>
        <button type="button" onClick={onCancel} className="btn btn-ghost uppercase tracking-[0.15em]">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function AccountAddresses() {
  const { customer, call, setCustomer } = useAccount()
  const [editing, setEditing] = useState(null) // 'new' or an address id
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)
  const addresses = customer?.addresses ?? []

  const send = async (path, method, body) => {
    setBusy(true)
    setErrors({})
    setMessage(null)
    try {
      const res = await call(path, { method, ...(body ? { body: JSON.stringify(body) } : {}) })
      setCustomer(res.customer)
      setEditing(null)
    } catch (err) {
      setErrors(err.body?.fields ?? {})
      if (!err.body?.fields) setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-4">
      {addresses.length === 0 && editing !== 'new' && (
        <div className="py-8 text-center">
          <MapPin size={32} strokeWidth={1} className="mx-auto text-secondary" />
          <p className="mt-3 text-sm opacity-70">Save an address and checkout fills it in for you.</p>
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) =>
          editing === a.id ? (
            <li key={a.id} className="sm:col-span-2">
              <AddressForm
                initial={{ ...a, label: a.label ?? '', makeDefault: customer.defaultAddress === a.id }}
                busy={busy}
                errors={errors}
                onSave={(form) => send(`/api/account/addresses/${a.id}`, 'PATCH', form)}
                onCancel={() => setEditing(null)}
              />
            </li>
          ) : (
            <li key={a.id} className={`border bg-base-100 p-5 ${customer.defaultAddress === a.id ? 'border-primary' : 'border-base-300'}`}>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
                {a.label || 'Address'}
                {customer.defaultAddress === a.id && (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Star size={11} className="fill-primary" /> Default
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                {a.name}
                <br />
                {a.address}, {a.city}
                <br />
                <span className="opacity-70">{a.phone}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.15em]">
                <button type="button" onClick={() => setEditing(a.id)} className="underline underline-offset-4">
                  Edit
                </button>
                {customer.defaultAddress !== a.id && (
                  <button type="button" onClick={() => send(`/api/account/addresses/${a.id}`, 'PATCH', { ...a, makeDefault: true })} className="underline underline-offset-4">
                    Make default
                  </button>
                )}
                <button type="button" onClick={() => send(`/api/account/addresses/${a.id}`, 'DELETE')} className="text-error underline underline-offset-4">
                  Remove
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {editing === 'new' ? (
        <AddressForm initial={blank(customer)} busy={busy} errors={errors} onSave={(form) => send('/api/account/addresses', 'POST', form)} onCancel={() => setEditing(null)} />
      ) : (
        addresses.length < MAX && (
          <button type="button" onClick={() => setEditing('new')} className="btn btn-outline justify-self-start uppercase tracking-[0.15em]">
            <Plus size={16} /> Add address
          </button>
        )
      )}
      {message && (
        <p role="alert" className="text-sm text-error">
          {message}
        </p>
      )}
    </div>
  )
}

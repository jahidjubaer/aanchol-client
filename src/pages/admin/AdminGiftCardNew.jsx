import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Field, SaveBar, Section } from '../../components/admin/FormParts.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminAuth } from '../../context/adminAuth.js'

// A card sold in person or given away. It's active straight away, with its code.
export default function AdminGiftCardNew() {
  const { call } = useAdminAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ amount: '', recipientName: '', recipientPhone: '', buyerName: '', buyerPhone: '', message: '', paymentMethod: 'cash', adminNote: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErrors({})
    setMessage(null)
    try {
      const { giftCard } = await call('/api/admin/gift-cards', { method: 'POST', body: JSON.stringify({ ...form, amount: Number(form.amount) }) })
      navigate(`/admin/gift-cards/${giftCard.id}`, { replace: true })
    } catch (err) {
      setErrors(err.body?.fields ?? {})
      setMessage({ type: 'error', text: err.message })
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto grid max-w-3xl gap-4 px-4 pt-6 md:px-8">
      <title>{`New gift card | ${BRAND.name} Admin`}</title>
      <Link to="/admin/gift-cards" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
        <ArrowLeft size={14} /> All gift cards
      </Link>
      <div>
        <h1 className="text-3xl md:text-4xl">New gift card</h1>
        <p className="mt-1 text-sm opacity-60">For a card already paid for, e.g. sold in person. It gets its code at once and works for a year.</p>
      </div>

      <Section title="Card">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount (৳)" error={errors.amount} hint="500 to 50,000, in hundreds.">
            <input value={form.amount} onChange={set('amount')} type="number" inputMode="numeric" min={500} step={100} className="input w-full" />
          </Field>
          <Field label="Paid by">
            <select value={form.paymentMethod} onChange={set('paymentMethod')} className="select w-full">
              <option value="cash">Cash</option>
              <option value="bkash">bKash</option>
            </select>
          </Field>
          <Field label="Message (optional)" error={errors.message} className="sm:col-span-2">
            <textarea value={form.message} onChange={set('message')} rows={2} maxLength={200} className="textarea w-full" />
          </Field>
        </div>
      </Section>

      <Section title="People">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="For (name)" error={errors.recipientName}>
            <input value={form.recipientName} onChange={set('recipientName')} className="input w-full" />
          </Field>
          <Field label="Their mobile (optional)" error={errors.recipientPhone}>
            <input value={form.recipientPhone} onChange={set('recipientPhone')} type="tel" className="input w-full" />
          </Field>
          <Field label="Bought by (optional)" error={errors.buyerName}>
            <input value={form.buyerName} onChange={set('buyerName')} className="input w-full" />
          </Field>
          <Field label="Buyer's mobile (optional)" error={errors.buyerPhone}>
            <input value={form.buyerPhone} onChange={set('buyerPhone')} type="tel" className="input w-full" />
          </Field>
          <Field label="Private note (optional)" error={errors.adminNote} className="sm:col-span-2">
            <input value={form.adminNote} onChange={set('adminNote')} placeholder="e.g. Eid giveaway winner" className="input w-full" />
          </Field>
        </div>
      </Section>

      <SaveBar message={message} busy={busy} label="Create gift card" />
    </form>
  )
}

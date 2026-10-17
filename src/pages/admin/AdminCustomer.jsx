import { ArrowLeft, ChevronRight, Copy, KeyRound, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { LoadError, Loading, Section, ToggleRow } from '../../components/admin/FormParts.jsx'
import SampleBadge from '../../components/admin/SampleBadge.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminAuth } from '../../context/adminAuth.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { customerWhatsapp, formatDate, formatDateTime, telLink } from '../../utils/adminFormat.js'
import { formatPrice } from '../../utils/formatPrice.js'

// Makes a one-time link (24 hours) for a customer who forgot their password, ready to send on WhatsApp.
function ResetLink({ customer }) {
  const { call } = useAdminAuth()
  const [link, setLink] = useState(null) // { url, expiresAt }
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const create = async () => {
    setBusy(true)
    setError(null)
    try {
      const { token, expiresAt } = await call(`/api/admin/customers/${customer.id}/reset-link`, { method: 'POST' })
      setLink({ url: `${window.location.origin}/account/reset?token=${token}`, expiresAt })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link.url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const message = link && `Hello ${customer.name.split(' ')[0]}, here is your link to choose a new ${BRAND.name} password. It works once, until ${formatDateTime(link.expiresAt)}:\n${link.url}`

  return (
    <Section title="Forgotten password">
      {!link ? (
        <>
          <p className="text-sm opacity-70">
            Only do this after the customer contacts you from <strong className="font-normal">{customer.phone}</strong>. The link lets anyone who has it set a new password.
          </p>
          <button type="button" onClick={create} disabled={busy || !customer.active} className="btn btn-outline btn-sm mt-4 uppercase tracking-[0.15em]">
            <KeyRound size={14} /> Make reset link
          </button>
          {customer.resetPending && <p className="mt-2 text-xs opacity-60">A link made earlier is still open; a new one replaces it.</p>}
        </>
      ) : (
        <>
          <p className="break-all border border-base-300 bg-base-200 p-3 font-mono text-xs">{link.url}</p>
          <p className="mt-2 text-xs opacity-60">Works once, until {formatDateTime(link.expiresAt)}. Signing in with the new password signs out other devices.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a href={customerWhatsapp(customer.phone, message)} target="_blank" rel="noreferrer" className="btn btn-accent btn-sm">
              <MessageCircle size={14} /> Send on WhatsApp
            </a>
            <button type="button" onClick={copy} className="btn btn-outline btn-sm">
              <Copy size={14} /> {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        </>
      )}
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </Section>
  )
}

export default function AdminCustomer() {
  const { id } = useParams()
  const { call } = useAdminAuth()
  const { data, error, reload, replace } = useAdminData(`/api/admin/customers/${encodeURIComponent(id)}`)
  const [problem, setProblem] = useState(null)

  const back = (
    <Link to="/admin/customers" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
      <ArrowLeft size={14} /> All customers
    </Link>
  )

  if (error && !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-6 md:px-8">
        {back}
        <LoadError error={error.status === 404 ? { message: 'This customer was not found.' } : error} onRetry={reload} />
      </div>
    )
  }
  if (!data) return <Loading />

  const { customer, orders } = data
  const spent = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)

  const setActive = async (active) => {
    setProblem(null)
    try {
      const res = await call(`/api/admin/customers/${customer.id}`, { method: 'PATCH', body: JSON.stringify({ active }) })
      replace({ ...data, customer: res.customer })
    } catch (err) {
      setProblem(err.message)
    }
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-4 px-4 pb-16 pt-6 md:px-8">
      <title>{`${customer.name} | ${BRAND.name} Admin`}</title>
      {back}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl md:text-4xl">{customer.name}</h1>
        {customer.sample && <SampleBadge />}
      </div>

      <Section title="Contact">
        <p className="text-sm">{customer.phone}</p>
        {customer.email && <p className="text-sm opacity-70">{customer.email}</p>}
        <p className="mt-1 text-xs opacity-60">
          Joined {formatDate(customer.createdAt)}
          {customer.lastLoginAt && ` · last signed in ${formatDateTime(customer.lastLoginAt)}`}
          {` · ${customer.wishlistCount} in wishlist`}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <a href={telLink(customer.phone)} className="btn btn-outline btn-sm">
            <Phone size={14} /> Call
          </a>
          <a href={customerWhatsapp(customer.phone)} target="_blank" rel="noreferrer" className="btn btn-accent btn-sm">
            <MessageCircle size={14} /> WhatsApp
          </a>
        </div>
        {customer.addresses.length > 0 && (
          <ul className="mt-5 grid gap-3 border-t border-base-300 pt-4 text-sm sm:grid-cols-2">
            {customer.addresses.map((a) => (
              <li key={a.id}>
                <p className="eyebrow text-base-content/60">
                  {a.label || 'Address'}
                  {customer.defaultAddress === a.id && ' · default'}
                </p>
                <p className="mt-1 leading-relaxed">
                  {a.name}, {a.phone}
                  <br />
                  {a.address}, {a.city}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Orders · ${orders.length}`} aside={orders.length > 0 && <span className="text-sm opacity-70">{formatPrice(spent)} spent</span>}>
        {orders.length === 0 ? (
          <p className="text-sm opacity-60">No orders on this account yet. Guest orders show here once the customer adds them.</p>
        ) : (
          <ul className="divide-y divide-base-300">
            {orders.map((o) => (
              <li key={o.id}>
                <Link to={`/admin/orders/${o.id}`} className="flex items-center gap-3 py-3">
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-display text-lg">{o.id}</span>
                      <StatusBadge status={o.status} />
                    </span>
                    <span className="block text-xs opacity-60">
                      {formatDateTime(o.createdAt)} · {o.items.map((i) => i.name).join(', ')}
                    </span>
                  </span>
                  <span className="text-sm">{formatPrice(o.total)}</span>
                  <ChevronRight size={16} className="opacity-40" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <ResetLink customer={customer} />

      <Section title="Account">
        <ToggleRow
          label="Account active"
          hint="Turn off to pause it: the customer is signed out and can't sign in. Orders are kept."
          checked={customer.active}
          onChange={(e) => setActive(e.target.checked)}
        />
        {problem && <p className="mt-2 text-sm text-error">{problem}</p>}
      </Section>
    </div>
  )
}

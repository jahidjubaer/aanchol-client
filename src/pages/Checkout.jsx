import { ChevronDown, CircleAlert, Lock, MessageCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import OrderSummary from '../components/checkout/OrderSummary.jsx'
import JamdaniDivider from '../components/ui/JamdaniDivider.jsx'
import { BRAND, DELIVERY_OPTIONS } from '../config/brand.js'
import { useAccount } from '../context/account.js'
import { useCart } from '../context/cart.js'
import { useCatalog } from '../context/catalog.js'
import { useSite } from '../context/site.js'
import { placeOrder } from '../utils/api.js'
import { validateCheckout } from '../utils/checkout.js'
import { formatPrice } from '../utils/formatPrice.js'
import { whatsappLink } from '../utils/whatsapp.js'

const EMPTY_FORM = { name: '', phone: '', email: '', city: '', address: '', note: '', delivery: 'inside-dhaka' }

// Signed-in customers start with their default address filled in.
function startingForm(customer) {
  if (!customer) return EMPTY_FORM
  const saved = customer.addresses.find((a) => a.id === customer.defaultAddress) ?? customer.addresses[0]
  return {
    ...EMPTY_FORM,
    name: saved?.name ?? customer.name,
    phone: saved?.phone ?? customer.phone,
    email: customer.email ?? '',
    city: saved?.city ?? '',
    address: saved?.address ?? '',
  }
}

const sameAddress = (a, form) => a.city.trim() === form.city.trim() && a.address.trim() === form.address.trim() && a.phone === form.phone.replace(/[\s-]/g, '')

function Field({ label, error, optional, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">
        {label} {optional && <span className="normal-case tracking-normal opacity-50">(optional)</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  )
}

function Section({ step, title, children }) {
  return (
    <section className="border-b border-base-300 py-8 first:pt-0">
      <h2 className="flex items-baseline gap-3 text-2xl">
        <span className="font-sans text-xs text-secondary">{step}</span> {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default function Checkout() {
  const { items, lines, ready, subtotal, clear, setQty } = useCart()
  const catalog = useCatalog()
  const site = useSite()
  const navigate = useNavigate()
  const account = useAccount()
  const savedAddresses = account.customer?.addresses ?? []
  const [form, setForm] = useState(() => startingForm(account.customer))
  const [saveAddress, setSaveAddress] = useState(savedAddresses.length === 0)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const errorRef = useRef(null)

  // Server errors appear next to the button at the bottom; bring them into view.
  useEffect(() => {
    if (formError) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [formError])

  const delivery = DELIVERY_OPTIONS.find((d) => d.id === form.delivery)
  const total = subtotal + delivery.fee

  if (!ready && lines.length > 0) {
    return (
      <div className="grid place-items-center px-4 py-32" role="status" aria-label="Loading your bag">
        <span className="loading loading-spinner" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-4xl">Your bag is empty</h1>
        <JamdaniDivider className="my-6" />
        <Link to="/collections/jamdani" className="btn btn-primary px-8 uppercase tracking-[0.2em]">
          Explore Jamdani
        </Link>
      </div>
    )
  }

  const set = (key) => (e) => {
    const next = { ...form, [key]: e.target.value }
    setForm(next)
    if (touched) setErrors(validateCheckout(next))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return
    const found = validateCheckout(form)
    setErrors(found)
    setTouched(true)
    setFormError(null)
    if (Object.keys(found).length) {
      document.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    setSubmitting(true)
    try {
      // The server checks stock and works out prices itself; only slugs and quantities are sent.
      const order = await placeOrder(
        {
          customer: { name: form.name, phone: form.phone, email: form.email, city: form.city, address: form.address, note: form.note },
          delivery: form.delivery,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
          // Lets the server refuse the order if prices changed (e.g. a sale ended) since the bag was shown.
          expectedSubtotal: subtotal,
        },
        account.token,
      )
      // Saving the address is a convenience: the order is already placed if this fails.
      if (account.signedIn && saveAddress && !savedAddresses.some((a) => sameAddress(a, form))) {
        account
          .call('/api/account/addresses', {
            method: 'POST',
            body: JSON.stringify({ label: savedAddresses.length ? '' : 'Home', name: form.name, phone: form.phone, city: form.city, address: form.address }),
          })
          .then((res) => account.setCustomer(res.customer))
          .catch(() => {})
      }
      clear()
      navigate('/order-confirmed', { state: { order, guest: !account.signedIn }, replace: true })
    } catch (err) {
      setSubmitting(false)
      if (err.body.fields) setErrors(err.body.fields)
      if (err.status === 409 && err.body.code === 'PRICE_CHANGED') {
        catalog.retry()
        site.refresh()
        setFormError(`${err.message} Nothing has been ordered yet.`)
      } else if (err.status === 409 && err.body.items) {
        err.body.items.forEach((i) => setQty(i.slug, i.available))
        setFormError(`${err.message} We've updated your bag; please check it and place the order again.`)
      } else {
        setFormError(err.message)
      }
    }
  }

  const inputClass = (key) => `input w-full ${errors[key] ? 'input-error' : ''}`

  return (
    <>
      <title>{`Checkout | ${BRAND.name}`}</title>

      {/* Mobile: collapsible summary */}
      <div className="border-b border-base-300 bg-base-200 lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          aria-expanded={summaryOpen}
          className="flex w-full items-center justify-between px-4 py-4 text-sm"
        >
          <span className="flex items-center gap-2">
            {summaryOpen ? 'Hide' : 'Show'} order summary
            <ChevronDown size={16} className={`transition ${summaryOpen ? 'rotate-180' : ''}`} />
          </span>
          <span className="font-display text-xl">{formatPrice(total)}</span>
        </button>
        {summaryOpen && (
          <div className="px-4 pb-4">
            <OrderSummary items={items} subtotal={subtotal} delivery={delivery} />
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <h1 className="text-4xl md:text-5xl">Checkout</h1>
        <p className="mt-1 font-bangla text-primary">অর্ডার সম্পন্ন করুন</p>

        <div className="mt-10 lg:grid lg:grid-cols-[1fr_380px] lg:gap-16">
          <form onSubmit={submit} noValidate>
            <Section step="01" title="Contact">
              {!account.signedIn && (
                <p className="mb-5 border border-base-300 bg-base-200/60 px-4 py-3 text-sm">
                  Have an account?{' '}
                  <Link to="/account/login" state={{ next: '/checkout' }} className="text-primary underline underline-offset-4">
                    Sign in
                  </Link>{' '}
                  for a faster checkout, or continue as a guest.
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <input name="name" autoComplete="name" value={form.name} onChange={set('name')} className={inputClass('name')} />
                </Field>
                <Field label="Mobile number" error={errors.phone}>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={set('phone')}
                    className={inputClass('phone')}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email" optional error={errors.email}>
                    <input name="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} className={inputClass('email')} />
                  </Field>
                </div>
              </div>
            </Section>

            <Section step="02" title="Delivery">
              <div className="grid gap-3 sm:grid-cols-2">
                {DELIVERY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                      form.delivery === opt.id ? 'border-primary bg-primary/5' : 'border-base-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      checked={form.delivery === opt.id}
                      onChange={set('delivery')}
                      className="radio radio-sm radio-primary mt-0.5"
                    />
                    <span className="flex-1">
                      <span className="block text-sm">{opt.label}</span>
                      <span className="block text-xs opacity-60">{opt.eta}</span>
                    </span>
                    <span className="text-sm">{opt.fee ? formatPrice(opt.fee) : 'Free'}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 grid gap-4">
                {savedAddresses.length > 0 && (
                  <div>
                    <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">Saved addresses</span>
                    <div className="flex flex-wrap gap-2">
                      {savedAddresses.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, name: a.name, phone: a.phone, city: a.city, address: a.address }))}
                          aria-pressed={sameAddress(a, form)}
                          className={`border px-3 py-2 text-left text-xs ${sameAddress(a, form) ? 'border-primary bg-primary/5 text-primary' : 'border-base-300'}`}
                        >
                          <span className="block uppercase tracking-[0.15em]">{a.label || a.city}</span>
                          <span className="block max-w-48 truncate normal-case opacity-70">{a.address}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Field label="City / District" error={errors.city}>
                  <input name="city" autoComplete="address-level2" value={form.city} onChange={set('city')} className={inputClass('city')} />
                </Field>
                <Field label="Full address" error={errors.address}>
                  <textarea
                    name="address"
                    autoComplete="street-address"
                    rows={3}
                    placeholder="House, road, area"
                    value={form.address}
                    onChange={set('address')}
                    className={`textarea w-full ${errors.address ? 'textarea-error' : ''}`}
                  />
                </Field>
                {account.signedIn && !savedAddresses.some((a) => sameAddress(a, form)) && savedAddresses.length < 5 && (
                  <label className="flex cursor-pointer items-center gap-3 text-sm">
                    <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="checkbox checkbox-sm checkbox-primary" />
                    Save this address to my account
                  </label>
                )}
                <Field label="Note for us" optional>
                  <textarea name="note" rows={2} value={form.note} onChange={set('note')} className="textarea w-full" />
                </Field>
              </div>
            </Section>

            <Section step="03" title="Payment">
              <div className="grid gap-3">
                <label className="flex items-start gap-3 border border-primary bg-primary/5 p-4">
                  <input type="radio" checked readOnly className="radio radio-sm radio-primary mt-0.5" />
                  <span>
                    <span className="block text-sm">Cash on delivery</span>
                    <span className="block text-xs opacity-60">Pay in cash when your sari arrives.</span>
                  </span>
                </label>
                <div className="flex items-center gap-3 border border-base-300 p-4 opacity-50">
                  <input type="radio" disabled className="radio radio-sm" />
                  <span className="text-sm">bKash · Nagad · Card</span>
                  <span className="ml-auto text-[10px] uppercase tracking-[0.2em]">Coming soon</span>
                </div>
              </div>
            </Section>

            <div className="pt-8">
              {formError && (
                <div ref={errorRef} role="alert" className="mb-4 flex gap-3 border border-error/40 bg-error/5 p-4 text-sm">
                  <CircleAlert size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-error" />
                  <div>
                    <p>{formError}</p>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-accent underline underline-offset-4"
                    >
                      <MessageCircle size={14} strokeWidth={1.5} /> Or order on WhatsApp
                    </a>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-block btn-lg uppercase tracking-[0.25em]"
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" /> Placing order
                  </>
                ) : (
                  <>Place order · {formatPrice(total)}</>
                )}
              </button>
              <p className="mt-3 flex items-center justify-center gap-2 text-xs opacity-60">
                <Lock size={12} /> We'll call to confirm your order before dispatch.
              </p>
            </div>
          </form>

          <aside className="hidden lg:block">
            <div className="sticky top-32 bg-base-200 p-6">
              <p className="eyebrow mb-2">Order summary</p>
              <OrderSummary items={items} subtotal={subtotal} delivery={delivery} />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

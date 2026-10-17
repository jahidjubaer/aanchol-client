import { CircleCheck, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import GiftCardVisual from '../components/rewards/GiftCardVisual.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import TextField from '../components/ui/TextField.jsx'
import { BRAND } from '../config/brand.js'
import { useAccount } from '../context/account.js'
import { useSite } from '../context/site.js'
import { request } from '../utils/api.js'
import { formatPrice } from '../utils/formatPrice.js'
import { enabledWallets, WALLETS } from '../utils/payments.js'
import { whatsappLink } from '../utils/whatsapp.js'

// Same limits as the server (config/shop.js).
const AMOUNTS = [1000, 2000, 3000, 5000, 10000]
const MIN = 500
const MAX = 50000
const MESSAGE_MAX = 200

const CASH = { id: 'cash', label: 'Cash', note: 'Pay at our shop, or our delivery person collects it. We call to arrange.' }

// bKash / Nagad when switched on in the admin (with the number to Send Money to), and cash.
function paymentChoices(payments) {
  const wallets = enabledWallets(payments).map((w) => ({
    id: w,
    label: WALLETS[w].label,
    note: `Send Money to ${payments[w].number}, then message us the TrxID. The card is sent as soon as it arrives.`,
  }))
  return [...wallets, CASH]
}

function BalanceCheck() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const check = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setResult(null)
    try {
      setResult((await request('/api/gift-cards/check', { method: 'POST', body: JSON.stringify({ code }) })).giftCard)
    } catch (err) {
      setError(err.body?.fields?.giftCard ?? err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={check} className="border border-base-300 p-5">
      <p className="font-display text-2xl">Check a balance</p>
      <div className="mt-3 flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="GIFT-XXXX-XXXX"
          aria-label="Gift card code"
          autoComplete="off"
          className={`input w-full font-mono ${error ? 'input-error' : ''}`}
        />
        <button type="submit" disabled={busy || !code.trim()} className="btn btn-outline uppercase tracking-[0.15em]">
          Check
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
      {result && (
        <p className="mt-3 text-sm">
          <span className="font-display text-2xl">{formatPrice(result.balance)}</span> left · use by{' '}
          {new Date(result.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}
    </form>
  )
}

export default function GiftCards() {
  const { customer, token } = useAccount()
  const PAYMENTS = paymentChoices(useSite().payments)
  const [amount, setAmount] = useState(3000)
  const [custom, setCustom] = useState('')
  const [form, setForm] = useState({ recipientName: '', recipientPhone: '', message: '', buyerName: customer?.name ?? '', buyerPhone: customer?.phone ?? '', paymentMethod: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState(null)
  const [done, setDone] = useState(null) // the card, once ordered

  const value = custom ? Number(custom) : amount
  const paymentMethod = PAYMENTS.some((p) => p.id === form.paymentMethod) ? form.paymentMethod : PAYMENTS[0].id
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErrors({})
    setProblem(null)
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const { giftCard } = await request('/api/gift-cards', { method: 'POST', headers, body: JSON.stringify({ ...form, paymentMethod, amount: value }) })
      setDone(giftCard)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setErrors(err.body?.fields ?? {})
      setProblem(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    const method = PAYMENTS.find((p) => p.id === done.paymentMethod) ?? CASH
    const message = `Hello ${BRAND.name}, I ordered a gift card ${done.reference} for ${formatPrice(done.amount)}. I'd like to pay by ${method.label}.`
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center md:py-24">
        <title>{`Gift card ordered | ${BRAND.name}`}</title>
        <CircleCheck size={44} strokeWidth={1} className="mx-auto text-accent" />
        <h1 className="mt-4 text-4xl">Gift card ordered</h1>
        <p className="mt-2 text-sm opacity-70">
          Reference <strong className="font-normal tracking-[0.1em]">{done.reference}</strong>
        </p>
        <GiftCardVisual amount={done.amount} to={done.recipient.name} className="mx-auto mt-8" />
        <p className="mt-8 leading-relaxed">{method.note} The code comes on WhatsApp once paid, ready to forward to {done.recipient.name}.</p>
        <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className="btn btn-accent mt-6 px-8 uppercase tracking-[0.2em]">
          <MessageCircle size={16} /> Pay now on WhatsApp
        </a>
        {customer && (
          <p className="mt-4 text-sm">
            <Link to="/account/gift-cards" className="underline underline-offset-4">
              See it in your account
            </Link>
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      <title>{`Gift cards | ${BRAND.name}`}</title>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 md:px-8 md:pt-16">
        <SectionHeading as="h1" eyebrow="Gift cards" title="Give them the choice" bangla="উপহার কার্ড">
          A gift card for any amount, with your message. They choose the sari or the jewellery; the card works at checkout for a year.
        </SectionHeading>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_420px]">
          <form onSubmit={submit} noValidate className="grid gap-8">
            <fieldset>
              <legend className="eyebrow mb-3">Amount</legend>
              <div className="flex flex-wrap gap-2">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAmount(a)
                      setCustom('')
                    }}
                    aria-pressed={!custom && amount === a}
                    className={`border px-4 py-2.5 text-sm transition ${!custom && amount === a ? 'border-primary bg-primary text-primary-content' : 'border-base-300 hover:border-primary'}`}
                  >
                    {formatPrice(a)}
                  </button>
                ))}
              </div>
              <TextField
                label="Or another amount"
                optional
                type="number"
                inputMode="numeric"
                min={MIN}
                max={MAX}
                step={100}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder={`${MIN} to ${MAX}, e.g. 2500`}
                error={errors.amount}
                className="mt-4 max-w-xs"
              />
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="eyebrow mb-3">Who is it for?</legend>
              <TextField label="Their name" value={form.recipientName} onChange={set('recipientName')} error={errors.recipientName} />
              <TextField label="Their mobile" optional type="tel" inputMode="tel" value={form.recipientPhone} onChange={set('recipientPhone')} error={errors.recipientPhone} hint="If you'd like us to send it to them directly." />
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">
                  Your message <span className="normal-case tracking-normal opacity-50">(optional)</span>
                </span>
                <textarea
                  rows={3}
                  maxLength={MESSAGE_MAX}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Eid Mubarak! Choose something beautiful."
                  className="textarea w-full font-display text-lg"
                />
                <span className="mt-1 block text-right text-xs opacity-50">
                  {form.message.length}/{MESSAGE_MAX}
                </span>
              </label>
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="eyebrow mb-3">From you</legend>
              <TextField label="Your name" autoComplete="name" value={form.buyerName} onChange={set('buyerName')} error={errors.buyerName} />
              <TextField label="Your mobile" type="tel" inputMode="tel" autoComplete="tel" value={form.buyerPhone} onChange={set('buyerPhone')} error={errors.buyerPhone} />
            </fieldset>

            <fieldset>
              <legend className="eyebrow mb-3">How you'll pay</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENTS.map((p) => (
                  <label key={p.id} className={`flex cursor-pointer items-start gap-3 border p-4 transition ${paymentMethod === p.id ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
                    <input type="radio" name="paymentMethod" value={p.id} checked={paymentMethod === p.id} onChange={set('paymentMethod')} className="radio radio-sm radio-primary mt-0.5" />
                    <span>
                      <span className="block text-sm">{p.label}</span>
                      <span className="block text-xs opacity-60">{p.note}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              {problem && (
                <p role="alert" className="mb-3 text-sm text-error">
                  {problem}
                </p>
              )}
              <button type="submit" disabled={busy || !(value >= MIN)} className="btn btn-primary btn-lg btn-block uppercase tracking-[0.25em]">
                {busy ? <span className="loading loading-spinner loading-sm" /> : <>Order gift card · {value >= MIN ? formatPrice(value) : '—'}</>}
              </button>
              <p className="mt-3 text-center text-xs opacity-60">Nothing is charged now. The card is activated when we receive your payment.</p>
            </div>
          </form>

          <aside className="grid content-start gap-8 lg:sticky lg:top-32">
            <GiftCardVisual amount={value >= MIN ? value : null} to={form.recipientName} className="mx-auto" />
            {form.message && <p className="mx-auto max-w-sm border-l-2 border-gold/60 pl-3 font-display text-lg italic opacity-80">“{form.message}”</p>}
            <BalanceCheck />
          </aside>
        </div>
      </div>
    </>
  )
}

import { ArrowLeft, Check, ExternalLink } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useBlocker, useLocation, useNavigate, useParams } from 'react-router'
import PhotoManager from '../../components/admin/PhotoManager.jsx'
import WovenImage from '../../components/ui/WovenImage.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminAuth } from '../../context/adminAuth.js'
import { useAdminData } from '../../hooks/useAdminData.js'

const CATEGORIES = [
  { id: 'jamdani', label: 'Jamdani sari' },
  { id: 'jewellery', label: 'Jewellery' },
]

const EMPTY = {
  name: '',
  nameBangla: '',
  category: 'jamdani',
  badge: '',
  price: '',
  compareAt: '',
  stock: '1',
  origin: 'Tangail',
  fabric: '',
  count: '',
  color: '',
  weavingTime: '',
  weaver: '',
  description: '',
  images: [],
  colors: { base: '#7a1f2b', motif: '#d9b56a' },
  active: true,
}

// API product → form fields (numbers become text so inputs can be empty while typing).
function toForm(p) {
  const text = (v) => (v === undefined || v === null ? '' : String(v))
  return {
    ...EMPTY,
    ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, p[k] ?? EMPTY[k]])),
    price: text(p.price),
    compareAt: text(p.compareAt),
    stock: text(p.stock),
    count: text(p.count),
  }
}

// Form fields → API body. Empty optional numbers are sent as null, which removes them.
function toBody(form) {
  const num = (v) => (v.trim() === '' ? null : Number(v))
  return { ...form, price: num(form.price), compareAt: num(form.compareAt), stock: num(form.stock), count: num(form.count) }
}

function Field({ label, hint, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-error">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs opacity-50">{hint}</span>
      )}
    </label>
  )
}

function Section({ title, children }) {
  return (
    <section className="border border-base-300 bg-base-100 p-5 md:p-6">
      <h2 className="eyebrow mb-5">{title}</h2>
      {children}
    </section>
  )
}

function ProductForm({ initial, slug, uploadsEnabled, notice }) {
  const { call } = useAdminAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(notice ? { type: 'ok', text: notice } : null) // { type: 'ok' | 'error', text }
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)
  // Set just before leaving on purpose (after adding or deleting), when there's nothing to lose.
  const leaving = useRef(false)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !leaving.current && currentLocation.pathname !== nextLocation.pathname,
  )

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const setImages = (next) => setForm((f) => ({ ...f, images: typeof next === 'function' ? next(f.images) : next }))
  const setColor = (key) => (e) => setForm((f) => ({ ...f, colors: { ...f.colors, [key]: e.target.value } }))

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const { product } = await call(slug ? `/api/admin/products/${slug}` : '/api/admin/products', {
        method: slug ? 'PATCH' : 'POST',
        body: JSON.stringify(toBody(form)),
      })
      const next = toForm(product)
      setErrors({})
      setForm(next)
      setSaved(next)
      if (slug) {
        setMessage({ type: 'ok', text: 'Saved. The shop shows the change within a minute.' })
      } else {
        leaving.current = true
        navigate(`/admin/products/${product.slug}`, { replace: true, state: { created: true } })
      }
    } catch (err) {
      setErrors(err.body?.fields ?? {})
      setMessage({ type: 'error', text: err.body?.fields ? 'Please fix the highlighted fields.' : err.message })
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await call(`/api/admin/products/${slug}`, { method: 'DELETE' })
      leaving.current = true
      navigate('/admin/products', { replace: true })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
      setConfirmDelete(false)
      setBusy(false)
    }
  }

  const input = (key) => `input w-full ${errors[key] ? 'input-error' : ''}`

  return (
    <form onSubmit={save} noValidate className="grid gap-4">
      <Section title="Photos">
        <PhotoManager images={form.images} onChange={setImages} uploadsEnabled={uploadsEnabled} />
        {errors.images && <p className="mt-2 text-xs text-error">{errors.images}</p>}
      </Section>

      <Section title="Name & category">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" error={errors.name} className="sm:col-span-2">
            <input value={form.name} onChange={set('name')} placeholder="e.g. Rokto Kolka Jamdani" className={input('name')} />
          </Field>
          <Field label="Name in Bangla" error={errors.nameBangla} className="sm:col-span-2">
            <input value={form.nameBangla} onChange={set('nameBangla')} lang="bn" className={`${input('nameBangla')} font-bangla`} />
          </Field>
          <Field label="Category" error={errors.category}>
            <select value={form.category} onChange={set('category')} className="select w-full">
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Label on photo" hint="Optional, e.g. New, Limited" error={errors.badge}>
            <input value={form.badge} onChange={set('badge')} maxLength={30} className={input('badge')} />
          </Field>
        </div>
      </Section>

      <Section title="Price & stock">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Price (৳)" error={errors.price}>
            <input value={form.price} onChange={set('price')} inputMode="numeric" placeholder="18500" className={input('price')} />
          </Field>
          <Field label="Old price (৳)" hint="Shown crossed out" error={errors.compareAt}>
            <input value={form.compareAt} onChange={set('compareAt')} inputMode="numeric" className={input('compareAt')} />
          </Field>
          <Field label="In stock" hint="0 shows Sold out" error={errors.stock} className="col-span-2 sm:col-span-1">
            <input value={form.stock} onChange={set('stock')} inputMode="numeric" className={input('stock')} />
          </Field>
        </div>
      </Section>

      <Section title="Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Origin" error={errors.origin}>
            <input value={form.origin} onChange={set('origin')} className={input('origin')} />
          </Field>
          <Field label="Fabric" error={errors.fabric}>
            <input value={form.fabric} onChange={set('fabric')} placeholder="Half-silk" className={input('fabric')} />
          </Field>
          <Field label="Thread count" error={errors.count}>
            <input value={form.count} onChange={set('count')} inputMode="numeric" placeholder="100" className={input('count')} />
          </Field>
          <Field label="Colour" hint="Used in the shop filter" error={errors.color}>
            <input value={form.color} onChange={set('color')} placeholder="Red" className={input('color')} />
          </Field>
          <Field label="Weaving time" error={errors.weavingTime}>
            <input value={form.weavingTime} onChange={set('weavingTime')} placeholder="About 8 weeks" className={input('weavingTime')} />
          </Field>
          <Field label="Weaver" error={errors.weaver}>
            <input value={form.weaver} onChange={set('weaver')} placeholder="Master weaver family, Pathrail" className={input('weaver')} />
          </Field>
          <Field label="Description" error={errors.description} className="col-span-2">
            <textarea value={form.description} onChange={set('description')} rows={5} maxLength={2000} className="textarea w-full" />
          </Field>
        </div>
      </Section>

      <Section title="Pattern colours">
        <div className="flex items-center gap-5">
          <div className="h-28 w-21 shrink-0 overflow-hidden border border-base-300">
            <WovenImage base={form.colors.base} motif={form.colors.motif} />
          </div>
          <div className="grid flex-1 gap-3">
            <label className="flex items-center justify-between gap-3 text-sm">
              Base
              <input type="color" value={form.colors.base} onChange={setColor('base')} className="h-10 w-16 cursor-pointer" />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              Motif
              <input type="color" value={form.colors.motif} onChange={setColor('motif')} className="h-10 w-16 cursor-pointer" />
            </label>
          </div>
        </div>
        <p className="mt-3 text-xs opacity-60">Shown instead of a photo when a piece has none, and while photos load.</p>
      </Section>

      <Section title="Visibility">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span>
            <span className="block">Show in shop</span>
            <span className="block text-xs opacity-60">Turn off to hide it without deleting.</span>
          </span>
          <input type="checkbox" checked={form.active} onChange={set('active')} className="toggle toggle-primary" />
        </label>
      </Section>

      {slug && (
        <div className="px-1 pt-2 text-sm">
          {confirmDelete ? (
            <div className="flex flex-wrap items-center gap-3">
              <span>Delete this product for good?</span>
              <button type="button" onClick={remove} className="btn btn-error btn-outline btn-sm">
                Yes, delete
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="btn btn-ghost btn-sm">
                Keep it
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="text-error underline underline-offset-4">
              Delete product
            </button>
          )}
        </div>
      )}

      {/* Save bar: always reachable with a thumb on phones */}
      <div className="sticky bottom-0 z-20 -mx-4 mt-2 border-t border-base-300 bg-base-100/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:mx-0 md:border-x">
        {message && (
          <p role={message.type === 'error' ? 'alert' : 'status'} className={`mb-2 text-sm ${message.type === 'error' ? 'text-error' : 'text-accent'}`}>
            {message.text}
          </p>
        )}
        <button type="submit" disabled={busy || (slug && !dirty)} className="btn btn-primary btn-block uppercase tracking-[0.2em]">
          {busy ? <span className="loading loading-spinner loading-sm" /> : <Check size={16} />}
          {slug ? (dirty ? 'Save changes' : 'Saved') : 'Add product'}
        </button>
      </div>

      {blocker.state === 'blocked' && (
        <div role="alertdialog" aria-label="Unsaved changes" className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-4 sm:place-items-center">
          <div className="w-full max-w-sm bg-base-100 p-6">
            <p className="font-display text-2xl">Leave without saving?</p>
            <p className="mt-2 text-sm opacity-70">Your changes to this product will be lost.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => blocker.proceed()} className="btn btn-outline">
                Leave
              </button>
              <button type="button" onClick={() => blocker.reset()} className="btn btn-primary">
                Keep editing
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

function EditExisting({ slug, uploadsEnabled }) {
  const created = useLocation().state?.created
  const { data, error } = useAdminData(`/api/admin/products/${encodeURIComponent(slug)}`)
  if (error && !data) {
    return <p className="py-16 text-center">{error.status === 404 ? 'This product was not found.' : error.message}</p>
  }
  if (!data) {
    return (
      <div className="grid place-items-center py-24">
        <span className="loading loading-spinner" />
      </div>
    )
  }
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl md:text-4xl">{data.product.name}</h1>
        {data.product.active && (
          <Link to={`/products/${slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-primary">
            View in shop <ExternalLink size={12} />
          </Link>
        )}
      </div>
      <ProductForm
        key={slug}
        slug={slug}
        initial={toForm(data.product)}
        uploadsEnabled={uploadsEnabled}
        notice={created ? 'Product added. It is now in the shop.' : null}
      />
    </>
  )
}

export default function AdminProductEdit() {
  const { slug } = useParams()
  const uploads = useAdminData('/api/admin/uploads')
  const uploadsEnabled = Boolean(uploads.data?.enabled)

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 md:px-8">
      <title>{`${slug ? 'Edit product' : 'Add product'} | ${BRAND.name} Admin`}</title>
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
        <ArrowLeft size={14} /> All products
      </Link>
      {slug ? (
        <EditExisting slug={slug} uploadsEnabled={uploadsEnabled} />
      ) : (
        <>
          <h1 className="mb-4 text-3xl md:text-4xl">Add product</h1>
          <ProductForm initial={EMPTY} uploadsEnabled={uploadsEnabled} />
        </>
      )}
    </div>
  )
}

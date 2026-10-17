import { ArrowLeft, ExternalLink, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { DeleteButton, Field, LoadError, Loading, SaveBar, Section, ToggleRow, UnsavedDialog } from '../../components/admin/FormParts.jsx'
import PairsPicker from '../../components/admin/PairsPicker.jsx'
import PhotoManager from '../../components/admin/PhotoManager.jsx'
import WovenImage from '../../components/ui/WovenImage.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { useEditor } from '../../hooks/useEditor.js'

const MAX_DETAILS = 10

const EMPTY = {
  name: '',
  nameBangla: '',
  category: 'jamdani',
  type: '',
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
  details: [],
  description: '',
  images: [],
  colors: { base: '#7a1f2b', motif: '#d9b56a' },
  pairsWith: [],
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

function DetailRows({ rows, onChange, error }) {
  const update = (i, key, value) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)))
  return (
    <div className="sm:col-span-2">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">Details</span>
      <ul className="grid gap-2">
        {rows.map((row, i) => (
          <li key={i} className="grid grid-cols-[1fr_1.5fr_auto] gap-2">
            <input value={row.label} onChange={(e) => update(i, 'label', e.target.value)} maxLength={40} placeholder="Material" aria-label={`Detail ${i + 1} label`} className="input w-full" />
            <input value={row.value} onChange={(e) => update(i, 'value', e.target.value)} maxLength={120} placeholder="Mango wood" aria-label={`Detail ${i + 1} value`} className="input w-full" />
            <button type="button" onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label={`Remove detail ${i + 1}`} className="btn btn-ghost btn-square">
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
      {rows.length < MAX_DETAILS && (
        <button type="button" onClick={() => onChange([...rows, { label: '', value: '' }])} className="btn btn-outline btn-sm mt-2">
          <Plus size={14} /> Add detail
        </button>
      )}
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : <p className="mt-1 text-xs opacity-50">e.g. Material, Size, Weight, Finish. Shown on the product page.</p>}
    </div>
  )
}

function ProductForm({ initial, slug, uploadsEnabled, categories, notice }) {
  const editor = useEditor({ initial, notice, toForm, toBody })
  const { form, setForm, set, setValue, errors, busy, dirty, message, setMessage } = editor
  const [confirmDelete, setConfirmDelete] = useState(false)

  const category = categories.find((c) => c.slug === form.category)
  const isSaree = (category?.template ?? 'saree') === 'saree'
  const types = category?.types ?? []

  // A type belongs to one category, so switching category clears it.
  const setCategory = (e) => setForm((f) => ({ ...f, category: e.target.value, type: '' }))
  const setImages = (next) => setValue('images', next)
  const setColor = (key) => (e) => setValue('colors', (c) => ({ ...c, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const body = await editor.save(slug ? `/api/admin/products/${slug}` : '/api/admin/products', slug ? 'PATCH' : 'POST', (b) => b.product)
    if (!body) return
    if (slug) setMessage({ type: 'ok', text: 'Saved. The shop shows the change within a minute.' })
    else editor.leave(`/admin/products/${body.product.slug}`, { replace: true, state: { created: true } })
  }

  const input = (key) => `input w-full ${errors[key] ? 'input-error' : ''}`

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <Section title="Photos">
        <PhotoManager images={form.images} onChange={setImages} uploadsEnabled={uploadsEnabled} />
        {errors.images && <p className="mt-2 text-xs text-error">{errors.images}</p>}
      </Section>

      <Section title="Name & category">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" error={errors.name} className="sm:col-span-2">
            <input value={form.name} onChange={set('name')} placeholder={isSaree ? 'e.g. Rokto Kolka Jamdani' : 'e.g. Mango Wood Jhumka'} className={input('name')} />
          </Field>
          <Field label="Name in Bangla" error={errors.nameBangla} className="sm:col-span-2">
            <input value={form.nameBangla} onChange={set('nameBangla')} lang="bn" className={`${input('nameBangla')} font-bangla`} />
          </Field>
          <Field label="Category" error={errors.category} hint={category?.status === 'live' ? null : category ? 'This category is not live yet, so the product won\'t show in the shop.' : null}>
            <select value={form.category} onChange={setCategory} className="select w-full">
              {!category && <option value={form.category}>{form.category}</option>}
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                  {c.status !== 'live' ? ` (${c.status === 'hidden' ? 'hidden' : 'coming soon'})` : ''}
                </option>
              ))}
            </select>
          </Field>
          {types.length > 0 && (
            <Field label="Type" hint="Used in the category's filter" error={errors.type}>
              <select value={form.type} onChange={set('type')} className="select w-full">
                <option value="">No type</option>
                {types.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
          )}
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
        <p className="mt-3 text-xs opacity-60">Festival discounts are set in Campaigns and apply automatically; no need to change prices here.</p>
      </Section>

      <Section title="Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Origin" error={errors.origin}>
            <input value={form.origin} onChange={set('origin')} placeholder={isSaree ? 'Tangail' : 'e.g. Khulna'} className={input('origin')} />
          </Field>
          <Field label="Colour" hint="Used in the shop filter" error={errors.color}>
            <input value={form.color} onChange={set('color')} placeholder="Red" className={input('color')} />
          </Field>
          {isSaree ? (
            <>
              <Field label="Fabric" error={errors.fabric}>
                <input value={form.fabric} onChange={set('fabric')} placeholder="Half-silk" className={input('fabric')} />
              </Field>
              <Field label="Thread count" error={errors.count}>
                <input value={form.count} onChange={set('count')} inputMode="numeric" placeholder="100" className={input('count')} />
              </Field>
              <Field label="Weaving time" error={errors.weavingTime}>
                <input value={form.weavingTime} onChange={set('weavingTime')} placeholder="About 8 weeks" className={input('weavingTime')} />
              </Field>
              <Field label="Weaver" error={errors.weaver}>
                <input value={form.weaver} onChange={set('weaver')} placeholder="Master weaver family, Pathrail" className={input('weaver')} />
              </Field>
            </>
          ) : (
            <DetailRows rows={form.details} onChange={(rows) => setValue('details', rows)} error={errors.details} />
          )}
          <Field label="Description" error={errors.description} className="col-span-2">
            <textarea value={form.description} onChange={set('description')} rows={5} maxLength={2000} className="textarea w-full" />
          </Field>
        </div>
      </Section>

      <Section title="Complete the look">
        <PairsPicker value={form.pairsWith} onChange={(next) => setValue('pairsWith', next)} self={slug} error={errors.pairsWith} />
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
        <ToggleRow label="Show in shop" hint="Turn off to hide it without deleting." checked={form.active} onChange={set('active')} />
      </Section>

      {slug && (
        <DeleteButton
          label="Delete product"
          question="Delete this product for good?"
          confirming={confirmDelete}
          onAsk={() => setConfirmDelete(true)}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            if (!(await editor.remove(`/api/admin/products/${slug}`, '/admin/products'))) setConfirmDelete(false)
          }}
        />
      )}

      <SaveBar message={message} busy={busy} disabled={slug && !dirty} label={slug ? (dirty ? 'Save changes' : 'Saved') : 'Add product'} />
      <UnsavedDialog blocker={editor.blocker} what="this product" />
    </form>
  )
}

function EditExisting({ slug, uploadsEnabled, categories }) {
  const created = useLocation().state?.created
  const { data, error } = useAdminData(`/api/admin/products/${encodeURIComponent(slug)}`)
  if (error && !data) return <LoadError error={error.status === 404 ? { message: 'This product was not found.' } : error} />
  if (!data) return <Loading />
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
        categories={categories}
        notice={created ? 'Product added.' : null}
      />
    </>
  )
}

export default function AdminProductEdit() {
  const { slug } = useParams()
  const uploadsEnabled = Boolean(useAdminData('/api/admin/uploads').data?.enabled)
  const categoryData = useAdminData('/api/admin/categories')
  const categories = categoryData.data?.categories

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 md:px-8">
      <title>{`${slug ? 'Edit product' : 'Add product'} | ${BRAND.name} Admin`}</title>
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
        <ArrowLeft size={14} /> All products
      </Link>
      {categoryData.error && !categories ? (
        <LoadError error={categoryData.error} onRetry={categoryData.reload} />
      ) : !categories ? (
        <Loading />
      ) : slug ? (
        <EditExisting slug={slug} uploadsEnabled={uploadsEnabled} categories={categories} />
      ) : (
        <>
          <h1 className="mb-4 text-3xl md:text-4xl">Add product</h1>
          <ProductForm initial={{ ...EMPTY, category: categories[0]?.slug ?? EMPTY.category }} uploadsEnabled={uploadsEnabled} categories={categories} />
        </>
      )}
    </div>
  )
}

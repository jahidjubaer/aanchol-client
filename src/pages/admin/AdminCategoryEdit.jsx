import { ArrowLeft, ExternalLink, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { DeleteButton, Field, LoadError, Loading, SaveBar, Section, ToggleRow, UnsavedDialog } from '../../components/admin/FormParts.jsx'
import SinglePhoto from '../../components/admin/SinglePhoto.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { useEditor } from '../../hooks/useEditor.js'

const EMPTY = {
  name: '',
  nameBangla: '',
  intro: '',
  banner: '',
  status: 'coming-soon',
  inNav: true,
  order: '30',
  template: 'general',
  types: [],
}

const STATUSES = [
  ['live', 'Live', 'Products are for sale.'],
  ['coming-soon', 'Coming soon', 'A teaser page with a WhatsApp "notify me" button. No products shown.'],
  ['hidden', 'Hidden', 'Not in the shop at all. Products stay saved.'],
]

const TEMPLATES = [
  ['saree', 'Sari', 'Fabric, thread count, weaver, weaving time, loom sizes and care guide.'],
  ['general', 'Other products', 'Free detail rows (e.g. Material: Mango wood, Size: 5 cm).'],
]

const toForm = (c) => ({
  ...EMPTY,
  ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, c[k] ?? EMPTY[k]])),
  order: String(c.order ?? EMPTY.order),
})

const toBody = (f) => ({ ...f, order: Number(f.order) })

function Choice({ name, value, current, onChange, title, hint }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 border p-3 ${current === value ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
      <input type="radio" name={name} value={value} checked={current === value} onChange={onChange} className="radio radio-sm radio-primary mt-0.5" />
      <span>
        <span className="block text-sm">{title}</span>
        <span className="block text-xs opacity-60">{hint}</span>
      </span>
    </label>
  )
}

function TypesEditor({ types, onChange, error }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const label = draft.trim()
    if (!label || types.some((t) => t.label.toLowerCase() === label.toLowerCase())) return
    onChange([...types, { label }]) // the server gives it a web-safe slug
    setDraft('')
  }
  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {types.map((t, i) => (
          <li key={t.slug ?? `new-${i}`} className="flex items-center border border-base-300 bg-base-200">
            <input
              value={t.label}
              onChange={(e) => onChange(types.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              aria-label="Type name"
              size={Math.max(4, t.label.length)}
              className="bg-transparent px-3 py-2 text-sm outline-none"
            />
            <button type="button" onClick={() => onChange(types.filter((_, j) => j !== i))} aria-label={`Remove ${t.label}`} className="grid size-9 place-items-center">
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          maxLength={30}
          placeholder="e.g. Wood"
          aria-label="New type"
          className="input flex-1"
        />
        <button type="button" onClick={add} className="btn btn-outline">
          <Plus size={16} /> Add
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  )
}

function CategoryForm({ initial, slug, uploadsEnabled, notice }) {
  const editor = useEditor({ initial, notice, toForm, toBody })
  const { form, set, setValue, errors, busy, dirty, message, setMessage } = editor
  const [confirmDelete, setConfirmDelete] = useState(false)
  const input = (key) => `input w-full ${errors[key] ? 'input-error' : ''}`

  const submit = async (e) => {
    e.preventDefault()
    const body = await editor.save(slug ? `/api/admin/categories/${slug}` : '/api/admin/categories', slug ? 'PATCH' : 'POST', (b) => b.category)
    if (!body) return
    if (slug) setMessage({ type: 'ok', text: 'Saved. The shop shows the change within a minute.' })
    else editor.leave(`/admin/categories/${body.category.slug}`, { replace: true, state: { created: true } })
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <Section title="Name">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" hint={slug ? `Web address: /collections/${slug} (fixed)` : 'The web address is made from this and can\'t change later.'} error={errors.name || errors.slug}>
            <input value={form.name} onChange={set('name')} maxLength={60} placeholder="Dhakai Muslin" className={input('name')} />
          </Field>
          <Field label="Name in Bangla" error={errors.nameBangla}>
            <input value={form.nameBangla} onChange={set('nameBangla')} maxLength={60} lang="bn" placeholder="ঢাকাই মসলিন" className={`${input('nameBangla')} font-bangla`} />
          </Field>
          <Field label="Introduction" hint="Shown at the top of the category page and on its tile." error={errors.intro} className="sm:col-span-2">
            <textarea value={form.intro} onChange={set('intro')} rows={3} maxLength={400} className="textarea w-full" />
          </Field>
        </div>
      </Section>

      <Section title="Banner photo">
        <SinglePhoto
          value={form.banner}
          onChange={(v) => setValue('banner', v)}
          uploadsEnabled={uploadsEnabled}
          optional
          error={errors.banner}
          hint="Wide photo for the top of the category page and the home page tile. Without one, a woven pattern tile is shown."
        />
      </Section>

      <Section title="In the shop">
        <div className="grid gap-2">
          {STATUSES.map(([value, title, hint]) => (
            <Choice key={value} name="status" value={value} current={form.status} onChange={set('status')} title={title} hint={hint} />
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_8rem] sm:items-end">
          <ToggleRow label="Show in the menu" hint="Top menu and phone menu." checked={form.inNav} onChange={set('inNav')} />
          <Field label="Order" hint="Smaller comes first" error={errors.order}>
            <input value={form.order} onChange={set('order')} inputMode="numeric" className={input('order')} />
          </Field>
        </div>
      </Section>

      <Section title="Product form">
        <div className="grid gap-2 sm:grid-cols-2">
          {TEMPLATES.map(([value, title, hint]) => (
            <Choice key={value} name="template" value={value} current={form.template} onChange={set('template')} title={title} hint={hint} />
          ))}
        </div>
      </Section>

      <Section title="Types (filters)">
        <p className="mb-3 text-sm opacity-70">Optional. Shown as a filter on the category page, e.g. Wood, Carved, Handmade. Renaming keeps products linked.</p>
        <TypesEditor types={form.types} onChange={(types) => setValue('types', types)} error={errors.types} />
      </Section>

      {slug && (
        <DeleteButton
          label="Delete category"
          question="Delete this category? Only possible when it has no products."
          confirming={confirmDelete}
          onAsk={() => setConfirmDelete(true)}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            if (!(await editor.remove(`/api/admin/categories/${slug}`, '/admin/categories'))) setConfirmDelete(false)
          }}
        />
      )}

      <SaveBar message={message} busy={busy} disabled={slug && !dirty} label={slug ? (dirty ? 'Save changes' : 'Saved') : 'Add category'} />
      <UnsavedDialog blocker={editor.blocker} what="this category" />
    </form>
  )
}

function EditExisting({ slug, uploadsEnabled }) {
  const created = useLocation().state?.created
  const { data, error } = useAdminData(`/api/admin/categories/${encodeURIComponent(slug)}`)
  if (error && !data) return <LoadError error={error.status === 404 ? { message: 'This category was not found.' } : error} />
  if (!data) return <Loading />
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl md:text-4xl">{data.category.name}</h1>
        {data.category.status !== 'hidden' && (
          <Link to={`/collections/${slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-primary">
            View in shop <ExternalLink size={12} />
          </Link>
        )}
      </div>
      <CategoryForm key={slug} slug={slug} initial={toForm(data.category)} uploadsEnabled={uploadsEnabled} notice={created ? 'Category added.' : null} />
    </>
  )
}

export default function AdminCategoryEdit() {
  const { slug } = useParams()
  const uploadsEnabled = Boolean(useAdminData('/api/admin/uploads').data?.enabled)

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 md:px-8">
      <title>{`${slug ? 'Edit category' : 'Add category'} | ${BRAND.name} Admin`}</title>
      <Link to="/admin/categories" className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
        <ArrowLeft size={14} /> All categories
      </Link>
      {slug ? (
        <EditExisting slug={slug} uploadsEnabled={uploadsEnabled} />
      ) : (
        <>
          <h1 className="mb-4 text-3xl md:text-4xl">Add category</h1>
          <CategoryForm initial={EMPTY} uploadsEnabled={uploadsEnabled} />
        </>
      )}
    </div>
  )
}

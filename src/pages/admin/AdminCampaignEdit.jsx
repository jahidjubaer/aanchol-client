import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { DeleteButton, Field, LoadError, Loading, SaveBar, Section, ToggleRow, UnsavedDialog } from '../../components/admin/FormParts.jsx'
import ScheduleBadge from '../../components/admin/ScheduleBadge.jsx'
import SinglePhoto from '../../components/admin/SinglePhoto.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { useEditor } from '../../hooks/useEditor.js'
import { fromLocalInput, toLocalInput } from '../../utils/adminFormat.js'
import { formatPrice } from '../../utils/formatPrice.js'

const MAX_PERCENT = 70

const EMPTY = {
  name: '',
  title: '',
  titleBangla: '',
  message: '',
  image: '',
  ctaLabel: 'Shop now',
  ctaLink: '/collections/jamdani',
  percentOff: '10',
  categories: [],
  startsAt: '',
  endsAt: '',
  popup: true,
  active: true,
}

const toForm = (c) => ({
  ...EMPTY,
  ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, c[k] ?? EMPTY[k]])),
  percentOff: String(c.percentOff ?? ''),
  startsAt: toLocalInput(c.startsAt),
  endsAt: toLocalInput(c.endsAt),
})

const toBody = (f) => ({
  ...f,
  percentOff: f.percentOff.trim() === '' ? null : Number(f.percentOff),
  startsAt: fromLocalInput(f.startsAt),
  endsAt: fromLocalInput(f.endsAt),
})

// Same rounding as the server (services/pricing.js).
const discounted = (price, percent) => Math.round((price * (100 - percent)) / 100)

function CampaignForm({ initial, id, uploadsEnabled, categories, notice }) {
  const editor = useEditor({ initial, notice, toForm, toBody })
  const { form, set, setValue, errors, busy, dirty, message, setMessage } = editor
  const [confirmDelete, setConfirmDelete] = useState(false)
  const input = (key) => `input w-full ${errors[key] ? 'input-error' : ''}`
  const percent = Number(form.percentOff) || 0

  const toggleCategory = (slug) =>
    setValue('categories', (list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]))

  const submit = async (e) => {
    e.preventDefault()
    const body = await editor.save(id ? `/api/admin/campaigns/${id}` : '/api/admin/campaigns', id ? 'PATCH' : 'POST', (b) => b.campaign)
    if (!body) return
    if (id) setMessage({ type: 'ok', text: 'Saved. The shop shows the change within a minute.' })
    else editor.leave(`/admin/campaigns/${body.campaign.id}`, { replace: true, state: { created: true } })
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <Section title="Discount">
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <Field label="Percent off" error={errors.percentOff} hint={`0 to ${MAX_PERCENT}. 0 = popup only, no discount.`}>
            <div className="relative">
              <input value={form.percentOff} onChange={set('percentOff')} inputMode="numeric" className={`${input('percentOff')} pr-8 font-display text-2xl`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60">%</span>
            </div>
          </Field>
          <div className="bg-base-200 p-4 text-sm">
            <p className="eyebrow mb-1 text-base-content/60">Example</p>
            {percent > 0 && percent <= MAX_PERCENT ? (
              <p>
                A {formatPrice(18500)} sari sells for <strong className="font-normal text-primary">{formatPrice(discounted(18500, percent))}</strong>, shown with the
                full price crossed out. Checkout charges the sale price only between the dates below.
              </p>
            ) : (
              <p>No prices change; the popup and top bar still announce the campaign.</p>
            )}
          </div>
        </div>
        <fieldset className="mt-5">
          <legend className="mb-1.5 text-xs uppercase tracking-[0.15em]">Applies to</legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setValue('categories', [])}
              aria-pressed={form.categories.length === 0}
              className={`border px-3 py-2 text-sm ${form.categories.length === 0 ? 'border-primary bg-primary/5 text-primary' : 'border-base-300'}`}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggleCategory(c.slug)}
                aria-pressed={form.categories.includes(c.slug)}
                className={`border px-3 py-2 text-sm ${form.categories.includes(c.slug) ? 'border-primary bg-primary/5 text-primary' : 'border-base-300'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
          {errors.categories && <p className="mt-1 text-xs text-error">{errors.categories}</p>}
        </fieldset>
      </Section>

      <Section title="Dates">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Starts" error={errors.startsAt}>
            <input type="datetime-local" value={form.startsAt} onChange={set('startsAt')} className={input('startsAt')} />
          </Field>
          <Field label="Ends" error={errors.endsAt}>
            <input type="datetime-local" value={form.endsAt} onChange={set('endsAt')} className={input('endsAt')} />
          </Field>
        </div>
        <p className="mt-3 text-xs opacity-60">In your device's time (Bangladesh time if it's set to Dhaka). Prices go back to normal by themselves when it ends. Only one campaign can run at a time.</p>
      </Section>

      <Section title="What customers see">
        <div className="grid gap-4">
          <Field label="Campaign name (admin only)" hint="e.g. Eid ul-Adha 2026" error={errors.name}>
            <input value={form.name} onChange={set('name')} maxLength={80} className={input('name')} />
          </Field>
          <Field label="Headline" hint="Shown in the popup and the top bar, e.g. Eid Mubarak: 10% off" error={errors.title}>
            <input value={form.title} onChange={set('title')} maxLength={80} className={input('title')} />
          </Field>
          <Field label="Bangla line" error={errors.titleBangla}>
            <input value={form.titleBangla} onChange={set('titleBangla')} maxLength={80} lang="bn" placeholder="ঈদ মোবারক" className={`${input('titleBangla')} font-bangla`} />
          </Field>
          <Field label="Message" error={errors.message}>
            <textarea value={form.message} onChange={set('message')} rows={3} maxLength={300} className="textarea w-full" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Button" error={errors.ctaLabel}>
              <input value={form.ctaLabel} onChange={set('ctaLabel')} maxLength={30} className={input('ctaLabel')} />
            </Field>
            <Field label="Goes to" error={errors.ctaLink}>
              <input value={form.ctaLink} onChange={set('ctaLink')} className={input('ctaLink')} />
            </Field>
          </div>
          <Field label="Popup photo" error={errors.image}>
            <SinglePhoto value={form.image} onChange={(v) => setValue('image', v)} uploadsEnabled={uploadsEnabled} aspect="aspect-[4/5] max-w-52" optional hint="Optional. Portrait works best." />
          </Field>
        </div>
      </Section>

      <Section title="Switches">
        <div className="grid gap-5">
          <ToggleRow label="Show popup on the home page" hint="Once a day per visitor. Editing the campaign shows it again." checked={form.popup} onChange={set('popup')} />
          <ToggleRow label="Campaign on" hint="Turn off to stop it early without deleting." checked={form.active} onChange={set('active')} />
        </div>
      </Section>

      {id && (
        <DeleteButton
          label="Delete campaign"
          question="Delete this campaign? Past orders keep their discount."
          confirming={confirmDelete}
          onAsk={() => setConfirmDelete(true)}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            if (!(await editor.remove(`/api/admin/campaigns/${id}`, '/admin/campaigns'))) setConfirmDelete(false)
          }}
        />
      )}

      <SaveBar message={message} busy={busy} disabled={id && !dirty} label={id ? (dirty ? 'Save changes' : 'Saved') : 'Add campaign'} />
      <UnsavedDialog blocker={editor.blocker} what="this campaign" />
    </form>
  )
}

function EditExisting({ id, uploadsEnabled, categories }) {
  const created = useLocation().state?.created
  const { data, error } = useAdminData(`/api/admin/campaigns/${encodeURIComponent(id)}`)
  if (error && !data) return <LoadError error={error.status === 404 ? { message: 'This campaign was not found.' } : error} />
  if (!data) return <Loading />
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl md:text-4xl">{data.campaign.name}</h1>
        <ScheduleBadge item={data.campaign} />
      </div>
      <CampaignForm
        key={id}
        id={id}
        initial={toForm(data.campaign)}
        uploadsEnabled={uploadsEnabled}
        categories={categories}
        notice={created ? 'Campaign added.' : null}
      />
    </>
  )
}

export default function AdminCampaignEdit() {
  const { id } = useParams()
  const uploadsEnabled = Boolean(useAdminData('/api/admin/uploads').data?.enabled)
  const categories = useAdminData('/api/admin/categories').data?.categories ?? []

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 md:px-8">
      <title>{`${id ? 'Edit campaign' : 'Add campaign'} | ${BRAND.name} Admin`}</title>
      <Link to="/admin/campaigns" className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
        <ArrowLeft size={14} /> All campaigns
      </Link>
      {id ? (
        <EditExisting id={id} uploadsEnabled={uploadsEnabled} categories={categories} />
      ) : (
        <>
          <h1 className="mb-4 text-3xl md:text-4xl">Add campaign</h1>
          <CampaignForm initial={EMPTY} uploadsEnabled={uploadsEnabled} categories={categories} />
        </>
      )}
    </div>
  )
}

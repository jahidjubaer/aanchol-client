import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { DeleteButton, Field, LoadError, Loading, SaveBar, Section, ToggleRow, UnsavedDialog } from '../../components/admin/FormParts.jsx'
import SinglePhoto from '../../components/admin/SinglePhoto.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { useEditor } from '../../hooks/useEditor.js'
import { fromLocalInput, toLocalInput } from '../../utils/adminFormat.js'
import { heroShade } from '../../utils/heroShade.js'
import { imageSrc } from '../../utils/image.js'

const EMPTY = {
  image: '',
  mobileImage: '',
  imageAlt: '',
  eyebrow: '',
  title: '',
  titleAccent: '',
  bangla: '',
  text: '',
  ctaLabel: '',
  ctaLink: '',
  cta2Label: '',
  cta2Link: '',
  overlay: 45,
  align: 'left',
  active: true,
  startsAt: '',
  endsAt: '',
}

const toForm = (s) => ({
  ...EMPTY,
  ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, s[k] ?? EMPTY[k]])),
  startsAt: toLocalInput(s.startsAt),
  endsAt: toLocalInput(s.endsAt),
})

// Empty dates are sent as null, which removes them.
const toBody = (f) => ({ ...f, overlay: Number(f.overlay), startsAt: fromLocalInput(f.startsAt), endsAt: fromLocalInput(f.endsAt) })

// A small copy of the shop's hero, so the shade and text can be judged before saving.
function Preview({ form, phone }) {
  const image = phone ? form.mobileImage || form.image : form.image
  return (
    <div className={`relative overflow-hidden bg-ink text-ivory ${phone ? 'aspect-[9/16] w-40' : 'aspect-[16/9] flex-1'}`}>
      {image && <img src={imageSrc(image, phone ? 400 : 900)} alt="" className="absolute inset-0 size-full object-cover" />}
      <div className="absolute inset-0" style={{ background: heroShade(Number(form.overlay), form.align, !phone) }} />
      <div
        className={`absolute inset-0 flex p-4 ${phone ? 'items-end' : 'items-center'} ${
          !phone && form.align === 'center' ? 'justify-center text-center' : ''
        }`}
      >
        <div className={phone ? 'max-w-full' : 'max-w-[60%]'}>
          {form.eyebrow && <p className="text-[7px] uppercase tracking-[0.3em] text-gold-light">{form.eyebrow}</p>}
          <p className={`mt-1 font-display leading-tight ${phone ? 'text-lg' : 'text-2xl'}`}>
            {form.title || 'Your title'}
            {form.titleAccent && (
              <>
                <br />
                <em>{form.titleAccent}</em>
              </>
            )}
          </p>
          {form.bangla && <p className="mt-1 font-bangla text-[10px] text-gold-light">{form.bangla}</p>}
          {form.ctaLabel && <span className="mt-2 inline-block bg-primary px-2 py-1 text-[7px] uppercase tracking-[0.2em]">{form.ctaLabel}</span>}
        </div>
      </div>
    </div>
  )
}

function SlideForm({ initial, id, uploadsEnabled, notice }) {
  const editor = useEditor({ initial, notice, toForm, toBody })
  const { form, set, setValue, errors, busy, dirty, message, setMessage } = editor
  const [confirmDelete, setConfirmDelete] = useState(false)
  const input = (key) => `input w-full ${errors[key] ? 'input-error' : ''}`

  const submit = async (e) => {
    e.preventDefault()
    const body = await editor.save(id ? `/api/admin/slides/${id}` : '/api/admin/slides', id ? 'PATCH' : 'POST', (b) => b.slide)
    if (!body) return
    if (id) setMessage({ type: 'ok', text: 'Saved. The shop shows the change within a minute.' })
    else editor.leave(`/admin/home/slides/${body.slide.id}`, { replace: true, state: { created: true } })
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <Section title="Preview">
        <div className="flex items-start gap-3">
          <Preview form={form} />
          <Preview form={form} phone />
        </div>
        <p className="mt-2 text-xs opacity-60">Computer (left) and phone (right).</p>
      </Section>

      <Section title="Photos">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <Field label="Main photo" error={errors.image}>
            <SinglePhoto
              value={form.image}
              onChange={(v) => setValue('image', v)}
              uploadsEnabled={uploadsEnabled}
              hint="Wide (landscape) works best, at least 2000 px across."
            />
          </Field>
          <Field label="Phone photo" error={errors.mobileImage} className="sm:w-36">
            <SinglePhoto
              value={form.mobileImage}
              onChange={(v) => setValue('mobileImage', v)}
              uploadsEnabled={uploadsEnabled}
              aspect="aspect-[9/16]"
              optional
              hint="Optional, tall crop."
            />
          </Field>
        </div>
        <Field label="Describe the photo" hint="For screen readers and Google, e.g. A red Jamdani on the loom" error={errors.imageAlt} className="mt-4">
          <input value={form.imageAlt} onChange={set('imageAlt')} maxLength={160} className={input('imageAlt')} />
        </Field>
      </Section>

      <Section title="Text">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Small line above" hint="e.g. Handwoven in Tangail" error={errors.eyebrow} className="sm:col-span-2">
            <input value={form.eyebrow} onChange={set('eyebrow')} maxLength={50} className={input('eyebrow')} />
          </Field>
          <Field label="Title" error={errors.title}>
            <input value={form.title} onChange={set('title')} maxLength={60} placeholder="Woven slowly," className={input('title')} />
          </Field>
          <Field label="Second line (italic)" error={errors.titleAccent}>
            <input value={form.titleAccent} onChange={set('titleAccent')} maxLength={60} placeholder="worn for generations" className={input('titleAccent')} />
          </Field>
          <Field label="Bangla line" error={errors.bangla} className="sm:col-span-2">
            <input value={form.bangla} onChange={set('bangla')} maxLength={60} lang="bn" className={`${input('bangla')} font-bangla`} />
          </Field>
          <Field label="Short text" error={errors.text} className="sm:col-span-2">
            <textarea value={form.text} onChange={set('text')} rows={3} maxLength={220} className="textarea w-full" />
          </Field>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Main button" error={errors.ctaLabel}>
            <input value={form.ctaLabel} onChange={set('ctaLabel')} maxLength={30} placeholder="Shop Jamdani" className={input('ctaLabel')} />
          </Field>
          <Field label="Goes to" error={errors.ctaLink}>
            <input value={form.ctaLink} onChange={set('ctaLink')} placeholder="/collections/jamdani" className={input('ctaLink')} />
          </Field>
          <Field label="Second button" error={errors.cta2Label}>
            <input value={form.cta2Label} onChange={set('cta2Label')} maxLength={30} placeholder="Our Story" className={input('cta2Label')} />
          </Field>
          <Field label="Goes to" error={errors.cta2Link}>
            <input value={form.cta2Link} onChange={set('cta2Link')} placeholder="/our-story" className={input('cta2Link')} />
          </Field>
        </div>
        <p className="mt-3 text-xs opacity-60">Both optional. Use a page of the shop (starting with /) or a full link starting with https://</p>
      </Section>

      <Section title="Look">
        <Field label={`Photo shade: ${form.overlay}%`} hint="Darker makes the text easier to read on bright photos." error={errors.overlay}>
          <input type="range" min="0" max="90" step="5" value={form.overlay} onChange={set('overlay')} className="range range-primary range-sm" />
        </Field>
        <fieldset className="mt-5">
          <legend className="mb-1.5 text-xs uppercase tracking-[0.15em]">Text position on computers</legend>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['left', 'Left'],
              ['center', 'Centre'],
            ].map(([value, label]) => (
              <label key={value} className={`flex cursor-pointer items-center gap-3 border p-3 text-sm ${form.align === value ? 'border-primary bg-primary/5' : 'border-base-300'}`}>
                <input type="radio" name="align" value={value} checked={form.align === value} onChange={set('align')} className="radio radio-sm radio-primary" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </Section>

      <Section title="When to show">
        <ToggleRow label="Show in shop" hint="Turn off to hide without deleting." checked={form.active} onChange={set('active')} />
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Field label="From" hint="Optional" error={errors.startsAt}>
            <input type="datetime-local" value={form.startsAt} onChange={set('startsAt')} className={input('startsAt')} />
          </Field>
          <Field label="Until" hint="Optional" error={errors.endsAt}>
            <input type="datetime-local" value={form.endsAt} onChange={set('endsAt')} className={input('endsAt')} />
          </Field>
        </div>
        <p className="mt-3 text-xs opacity-60">Handy for an Eid or Pohela Boishakh slide that should appear and disappear by itself.</p>
      </Section>

      {id && (
        <DeleteButton
          label="Delete slide"
          question="Delete this slide for good?"
          confirming={confirmDelete}
          onAsk={() => setConfirmDelete(true)}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            if (!(await editor.remove(`/api/admin/slides/${id}`, '/admin/home'))) setConfirmDelete(false)
          }}
        />
      )}

      <SaveBar message={message} busy={busy} disabled={id && !dirty} label={id ? (dirty ? 'Save changes' : 'Saved') : 'Add slide'} />
      <UnsavedDialog blocker={editor.blocker} what="this slide" />
    </form>
  )
}

function EditExisting({ id, uploadsEnabled }) {
  const created = useLocation().state?.created
  const { data, error } = useAdminData(`/api/admin/slides/${encodeURIComponent(id)}`)
  if (error && !data) return <LoadError error={error.status === 404 ? { message: 'This slide was not found.' } : error} />
  if (!data) return <Loading />
  return (
    <>
      <h1 className="mb-4 text-3xl md:text-4xl">Edit slide</h1>
      <SlideForm key={id} id={id} initial={toForm(data.slide)} uploadsEnabled={uploadsEnabled} notice={created ? 'Slide added.' : null} />
    </>
  )
}

export default function AdminSlideEdit() {
  const { id } = useParams()
  const uploads = useAdminData('/api/admin/uploads')
  const uploadsEnabled = Boolean(uploads.data?.enabled)

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 md:px-8">
      <title>{`${id ? 'Edit slide' : 'Add slide'} | ${BRAND.name} Admin`}</title>
      <Link to="/admin/home" className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] opacity-70 hover:opacity-100">
        <ArrowLeft size={14} /> Home page
      </Link>
      {id ? (
        <EditExisting id={id} uploadsEnabled={uploadsEnabled} />
      ) : (
        <>
          <h1 className="mb-4 text-3xl md:text-4xl">Add slide</h1>
          <SlideForm initial={EMPTY} uploadsEnabled={uploadsEnabled} />
        </>
      )}
    </div>
  )
}

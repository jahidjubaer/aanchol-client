import { ArrowDown, ArrowUp, ChevronRight, Eye, EyeOff, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { LoadError, Loading, Section } from '../../components/admin/FormParts.jsx'
import ScheduleBadge from '../../components/admin/ScheduleBadge.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminAuth } from '../../context/adminAuth.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { imageSrc } from '../../utils/image.js'

const MAX_SLIDES = 8

function moveItem(list, from, to) {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function Slides() {
  const { call } = useAdminAuth()
  const { data, error, reload, replace } = useAdminData('/api/admin/slides')
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState(null)
  const slides = data?.slides ?? []

  // Saves the new order as 10, 20, 30... so a slide can later be slotted in between.
  const move = async (from, to) => {
    const next = moveItem(slides, from, to)
    replace({ slides: next })
    setBusy(true)
    setProblem(null)
    try {
      await Promise.all(
        next.map((s, i) =>
          s.order === (i + 1) * 10 ? null : call(`/api/admin/slides/${s.id}`, { method: 'PATCH', body: JSON.stringify({ order: (i + 1) * 10 }) }),
        ),
      )
    } catch (err) {
      setProblem(err.message)
    } finally {
      setBusy(false)
      reload()
    }
  }

  const toggle = async (slide) => {
    setProblem(null)
    try {
      await call(`/api/admin/slides/${slide.id}`, { method: 'PATCH', body: JSON.stringify({ active: !slide.active }) })
    } catch (err) {
      setProblem(err.message)
    }
    reload()
  }

  return (
    <Section
      title="Hero slides"
      aside={
        slides.length < MAX_SLIDES && (
          <Link to="/admin/home/slides/new" className="btn btn-primary btn-xs uppercase tracking-[0.15em]">
            <Plus size={14} /> Add slide
          </Link>
        )
      }
    >
      {error && !data && <LoadError error={error} onRetry={reload} />}
      {!data && !error && <Loading />}
      {data && slides.length === 0 && (
        <p className="py-6 text-center text-sm opacity-60">No slides yet. The shop shows its built-in welcome slide until you add one.</p>
      )}
      <ul className="divide-y divide-base-300">
        {slides.map((s, i) => (
          <li key={s.id} className="flex items-center gap-3 py-3">
            <div className="flex flex-col">
              <button
                type="button"
                disabled={busy || i === 0}
                onClick={() => move(i, i - 1)}
                aria-label={`Move "${s.title}" up`}
                className="grid size-8 place-items-center disabled:opacity-20"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                disabled={busy || i === slides.length - 1}
                onClick={() => move(i, i + 1)}
                aria-label={`Move "${s.title}" down`}
                className="grid size-8 place-items-center disabled:opacity-20"
              >
                <ArrowDown size={14} />
              </button>
            </div>
            <Link to={`/admin/home/slides/${s.id}`} className="flex min-w-0 flex-1 items-center gap-3">
              <div className={`relative h-14 w-24 shrink-0 overflow-hidden bg-base-200 ${s.active ? '' : 'opacity-50'}`}>
                <img src={imageSrc(s.image, 200)} alt="" className="size-full object-cover" />
                <div className="absolute inset-0" style={{ background: `rgba(43,29,22,${(s.overlay ?? 45) / 200})` }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg leading-tight">
                  {s.title} {s.titleAccent && <em className="opacity-70">{s.titleAccent}</em>}
                </p>
                <ScheduleBadge item={s} className="mt-1" />
              </div>
              <ChevronRight size={16} className="shrink-0 opacity-40" />
            </Link>
            <button
              type="button"
              onClick={() => toggle(s)}
              aria-label={s.active ? `Hide "${s.title}"` : `Show "${s.title}"`}
              className="grid size-10 shrink-0 place-items-center opacity-70 hover:opacity-100"
            >
              {s.active ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </li>
        ))}
      </ul>
      {problem && <p className="mt-2 text-sm text-error">{problem}</p>}
      <p className="mt-3 text-xs opacity-60">The first slide shows first. Hidden and scheduled slides stay here but aren't shown in the shop.</p>
    </Section>
  )
}

function Layout() {
  const { call } = useAdminAuth()
  const { data, error, reload, replace } = useAdminData('/api/admin/settings')
  const [lines, setLines] = useState(null) // announcement being edited
  const [state, setState] = useState(null) // { type, text }

  if (error && !data) return <LoadError error={error} onRetry={reload} />
  if (!data) return <Loading />

  const { settings, sections } = data
  const labelOf = (id) => sections.find((s) => s.id === id)?.label ?? id
  const announcement = lines ?? [...settings.announcement, '', '', ''].slice(0, 3)

  const patch = async (body, okText) => {
    setState(null)
    try {
      replace(await call('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(body) }))
      setState({ type: 'ok', text: okText })
      return true
    } catch (err) {
      setState({ type: 'error', text: err.body?.fields ? Object.values(err.body.fields)[0] : err.message })
      reload()
      return false
    }
  }

  const homeSections = settings.homeSections
  const moveSection = (from, to) => patch({ homeSections: moveItem(homeSections, from, to) }, 'Home page order saved.')
  const toggleSection = (id) =>
    patch({ homeSections: homeSections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)) }, 'Home page saved.')

  return (
    <>
      <Section title="Home page sections">
        <p className="mb-3 text-sm opacity-70">The hero is always first. Then these, in this order:</p>
        <ol className="divide-y divide-base-300 border-y border-base-300">
          {homeSections.map((s, i) => (
            <li key={s.id} className={`flex items-center gap-2 py-2 ${s.visible ? '' : 'opacity-50'}`}>
              <span className="w-6 text-center font-display text-lg text-secondary">{i + 1}</span>
              <span className="flex-1 text-sm">{labelOf(s.id)}</span>
              <button type="button" disabled={i === 0} onClick={() => moveSection(i, i - 1)} aria-label={`Move ${labelOf(s.id)} up`} className="grid size-9 place-items-center disabled:opacity-20">
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                disabled={i === homeSections.length - 1}
                onClick={() => moveSection(i, i + 1)}
                aria-label={`Move ${labelOf(s.id)} down`}
                className="grid size-9 place-items-center disabled:opacity-20"
              >
                <ArrowDown size={14} />
              </button>
              <button type="button" onClick={() => toggleSection(s.id)} aria-label={s.visible ? `Hide ${labelOf(s.id)}` : `Show ${labelOf(s.id)}`} className="grid size-9 place-items-center">
                {s.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Announcement bar">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (await patch({ announcement }, 'Announcement saved.')) setLines(null)
          }}
          className="grid gap-3"
        >
          {announcement.map((line, i) => (
            <input
              key={i}
              value={line}
              onChange={(e) => setLines(announcement.map((l, j) => (j === i ? e.target.value : l)))}
              maxLength={90}
              placeholder={i === 0 ? 'e.g. Cash on delivery across Bangladesh' : 'Optional'}
              aria-label={`Announcement line ${i + 1}`}
              className="input w-full"
            />
          ))}
          <p className="text-xs opacity-60">Phones show the first line, computers the first two. A running campaign's title is shown before these.</p>
          <button type="submit" disabled={!lines} className="btn btn-primary btn-sm justify-self-start uppercase tracking-[0.15em]">
            Save announcement
          </button>
        </form>
      </Section>

      {state && (
        <p role={state.type === 'error' ? 'alert' : 'status'} className={`text-sm ${state.type === 'error' ? 'text-error' : 'text-accent'}`}>
          {state.text}
        </p>
      )}
    </>
  )
}

export default function AdminHome() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 px-4 pb-16 pt-8 md:px-8">
      <title>{`Home page | ${BRAND.name} Admin`}</title>
      <div>
        <h1 className="text-3xl md:text-4xl">Home page</h1>
        <p className="mt-1 text-sm opacity-60">Changes show in the shop within a minute.</p>
      </div>
      <Slides />
      <Layout />
    </div>
  )
}

import { MessageCircle, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import FilterPanel from '../components/collection/FilterPanel.jsx'
import JamdaniDivider from '../components/ui/JamdaniDivider.jsx'
import { CatalogNotice, ProductGridSkeleton } from '../components/ui/CatalogState.jsx'
import ProductCard from '../components/ui/ProductCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Sheet from '../components/ui/Sheet.jsx'
import { useCatalog } from '../context/catalog.js'
import { collections } from '../data/collections.js'
import { EASE_LUXE } from '../utils/motion.js'
import { applyFilters, getFilterOptions, PRICE_RANGES, SORT_OPTIONS } from '../utils/productFilters.js'
import { whatsappLink } from '../utils/whatsapp.js'
import NotFound from './NotFound.jsx'

const FILTER_KEYS = ['fabric', 'color', 'price']

function readFilters(params) {
  return Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k)?.split(',').filter(Boolean) ?? []]))
}

function filterLabel(key, value) {
  return key === 'price' ? PRICE_RANGES.find((r) => r.id === value)?.label : value
}

function Banner({ collection }) {
  if (!collection.banner) {
    return (
      <div className="px-4 pt-14 text-center md:pt-20">
        <p className="font-bangla text-primary">{collection.bangla}</p>
        <h1 className="mt-2 text-5xl md:text-6xl">{collection.title}</h1>
        <JamdaniDivider className="my-5" />
        <p className="mx-auto max-w-xl leading-relaxed opacity-80">{collection.intro}</p>
      </div>
    )
  }
  return (
    <div className="relative h-[42svh] min-h-[300px] overflow-hidden md:h-[52vh]">
      <motion.img
        src={collection.banner}
        alt=""
        className="absolute inset-0 size-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: EASE_LUXE }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/35 to-ink/10" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 text-ivory md:px-8 md:pb-12">
        <Reveal>
          <p className="font-bangla text-gold-light">{collection.bangla}</p>
          <h1 className="mt-1 text-5xl md:text-7xl">{collection.title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-85 md:text-base">{collection.intro}</p>
        </Reveal>
      </div>
    </div>
  )
}

function ComingSoon({ collection }) {
  return (
    <section className="mx-auto max-w-xl px-4 pb-24 text-center">
      <p className="eyebrow mt-6">Coming soon</p>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed opacity-75">
        We are working with artisans on our first {collection.title.toLowerCase()} collection. Message us to hear first
        when it arrives.
      </p>
      <a
        href={whatsappLink(`Please let me know when your ${collection.title} collection launches.`)}
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary mt-8 px-8 uppercase tracking-[0.2em]"
      >
        <MessageCircle size={16} strokeWidth={1.5} /> Notify me on WhatsApp
      </a>
    </section>
  )
}

export default function Collection() {
  const { slug } = useParams()
  const collection = collections[slug]
  const [params, setParams] = useSearchParams()
  const [sheetOpen, setSheetOpen] = useState(false)
  const { products, status } = useCatalog()

  const allItems = useMemo(() => collection?.items(products) ?? [], [collection, products])
  const options = useMemo(() => getFilterOptions(allItems), [allItems])
  const filters = readFilters(params)
  const sort = params.get('sort') ?? 'featured'
  const visible = applyFilters(allItems, filters, sort)
  const activeCount = FILTER_KEYS.reduce((n, k) => n + filters[k].length, 0)

  if (!collection) return <NotFound />

  const update = (mutate) => {
    const next = new URLSearchParams(params)
    mutate(next)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const toggle = (key, value) =>
    update((next) => {
      const current = filters[key]
      const values = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      if (values.length) next.set(key, values.join(','))
      else next.delete(key)
    })

  const clearAll = () => update((next) => FILTER_KEYS.forEach((k) => next.delete(k)))

  const setSort = (value) =>
    update((next) => {
      if (value === 'featured') next.delete('sort')
      else next.set('sort', value)
    })

  if (collection.comingSoon) {
    return (
      <>
        <Banner collection={collection} />
        <ComingSoon collection={collection} />
      </>
    )
  }

  return (
    <>
      <Banner collection={collection} />

      <div className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-base-300 py-4">
          <p className="text-xs uppercase tracking-[0.2em] opacity-70">
            {status === 'ready' && `${visible.length} ${visible.length === 1 ? 'piece' : 'pieces'}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="btn btn-outline btn-sm uppercase tracking-[0.15em] lg:hidden"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} /> Filter{activeCount > 0 && ` (${activeCount})`}
            </button>
            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select select-sm w-auto min-w-0 text-xs"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {FILTER_KEYS.flatMap((k) =>
              filters[k].map((v) => (
                <button
                  key={`${k}-${v}`}
                  type="button"
                  onClick={() => toggle(k, v)}
                  className="inline-flex items-center gap-1.5 border border-base-300 bg-base-200 px-3 py-1.5 text-xs"
                >
                  {filterLabel(k, v)} <X size={12} />
                </button>
              )),
            )}
            <button type="button" onClick={clearAll} className="px-2 text-xs underline underline-offset-4">
              Clear all
            </button>
          </div>
        )}

        <div className="mt-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <FilterPanel options={options} filters={filters} onToggle={toggle} />
            </div>
          </aside>

          {status === 'error' ? (
            <CatalogNotice className="py-20" />
          ) : status === 'loading' ? (
            <div>
              <ProductGridSkeleton count={6} className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6" />
              <CatalogNotice className="mt-10" />
            </div>
          ) : visible.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6">
              {visible.map((product, i) => (
                <Reveal key={product.slug} delay={(i % 3) * 0.08}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-display text-3xl">No pieces match</p>
              <p className="mt-2 text-sm opacity-70">Try removing a filter.</p>
              <button type="button" onClick={clearAll} className="btn btn-outline mt-6 px-8 uppercase tracking-[0.2em]">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filter"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={clearAll} className="btn btn-outline uppercase tracking-[0.15em]">
              Clear
            </button>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="btn btn-primary uppercase tracking-[0.15em]"
            >
              Show {visible.length}
            </button>
          </div>
        }
      >
        <FilterPanel options={options} filters={filters} onToggle={toggle} />
      </Sheet>
    </>
  )
}

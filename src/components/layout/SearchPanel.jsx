import { ArrowRight, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCatalog } from '../../context/catalog.js'
import { useSite } from '../../context/site.js'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll.js'
import { collectionPath } from '../../utils/collections.js'
import { imageSrc } from '../../utils/image.js'
import { EASE_LUXE } from '../../utils/motion.js'
import { getSubtitle } from '../../utils/product.js'
import { searchCategories, searchPath, searchProducts } from '../../utils/search.js'
import Price from '../ui/Price.jsx'
import WovenImage from '../ui/WovenImage.jsx'

const SHOWN = 6

// Drops down from the top of the page. Results appear while typing; Enter opens the full results page.
export default function SearchPanel({ open, onClose }) {
  useLockBodyScroll(open)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { products, status } = useCatalog()
  const { categories } = useSite()

  const live = useMemo(() => categories.filter((c) => c.status === 'live'), [categories])
  const results = useMemo(() => searchProducts(products ?? [], categories, query), [products, categories, query])
  const categoryHits = useMemo(() => searchCategories(live, query), [live, query])
  const typed = query.trim().length > 0

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const submit = (e) => {
    e.preventDefault()
    if (!typed) return
    onClose()
    navigate(searchPath(query))
  }

  return (
    <AnimatePresence onExitComplete={() => setQuery('')}>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
          <motion.div
            className="absolute inset-0 bg-ink/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="absolute inset-x-0 top-0 flex max-h-[90dvh] flex-col bg-base-100 shadow-lg"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: EASE_LUXE }}
          >
            <form onSubmit={submit} role="search" className="mx-auto flex w-full max-w-3xl items-center gap-3 border-b border-base-300 px-4 py-3 md:py-5">
              <Search size={20} strokeWidth={1.4} className="shrink-0 opacity-60" />
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sarees, colours, jewellery…"
                aria-label="Search the shop"
                enterKeyHint="search"
                className="h-11 min-w-0 flex-1 bg-transparent font-display text-xl outline-none placeholder:opacity-50 md:text-2xl"
              />
              <button type="button" onClick={onClose} aria-label="Close search" className="grid size-10 shrink-0 place-items-center">
                <X size={22} strokeWidth={1.4} />
              </button>
            </form>

            <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-5">
              {!typed ? (
                <>
                  <p className="eyebrow text-base-content/60">Browse</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...live.map((c) => ({ to: collectionPath(c.slug), label: c.name })), { to: collectionPath('new'), label: 'New Arrivals' }].map((l) => (
                      <Link key={l.to} to={l.to} onClick={onClose} className="border border-base-300 px-4 py-2 text-sm transition hover:border-primary hover:text-primary">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {categoryHits.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {categoryHits.map((c) => (
                        <Link
                          key={c.slug}
                          to={collectionPath(c.slug)}
                          onClick={onClose}
                          className="inline-flex items-center gap-2 bg-base-200 px-4 py-2 text-sm transition hover:text-primary"
                        >
                          All {c.name} <ArrowRight size={14} />
                        </Link>
                      ))}
                    </div>
                  )}

                  {status === 'loading' ? (
                    <p className="py-6 text-center text-sm opacity-60">Loading the shop…</p>
                  ) : results.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="font-display text-2xl">Nothing found for “{query.trim()}”</p>
                      <p className="mt-1 text-sm opacity-60">Try a colour, like red, or a word like jamdani or silk.</p>
                    </div>
                  ) : (
                    <>
                      <ul className="divide-y divide-base-300">
                        {results.slice(0, SHOWN).map((p) => (
                          <li key={p.slug}>
                            <Link to={`/products/${p.slug}`} onClick={onClose} className="group flex items-center gap-4 py-3">
                              <span className="block size-16 shrink-0 overflow-hidden bg-base-200">
                                {p.images[0] ? (
                                  <img src={imageSrc(p.images[0], 160)} alt="" loading="lazy" className="size-full object-cover" />
                                ) : (
                                  <WovenImage base={p.colors?.base} motif={p.colors?.motif} />
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-display text-lg leading-tight group-hover:text-primary">{p.name}</span>
                                <span className="block truncate text-xs opacity-60">{getSubtitle(p)}</span>
                              </span>
                              <span className="shrink-0 text-sm">
                                {p.stock < 1 ? <span className="opacity-60">Sold out</span> : <Price product={p} />}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={searchPath(query)}
                        onClick={onClose}
                        className="btn btn-outline mt-4 w-full uppercase tracking-[0.2em]"
                      >
                        See all {results.length} {results.length === 1 ? 'result' : 'results'}
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

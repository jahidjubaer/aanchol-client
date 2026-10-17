import { Search as SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CatalogNotice, ProductGridSkeleton } from '../components/ui/CatalogState.jsx'
import ProductCard from '../components/ui/ProductCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { BRAND } from '../config/brand.js'
import { useCatalog } from '../context/catalog.js'
import { useSite } from '../context/site.js'
import { collectionPath } from '../utils/collections.js'
import { applyFilters, SORT_OPTIONS } from '../utils/productFilters.js'
import { searchCategories, searchProducts } from '../utils/search.js'

const NO_FILTERS = { type: [], fabric: [], color: [], price: [] }
// "Featured" means best match here.
const SORTS = SORT_OPTIONS.map((o) => (o.id === 'featured' ? { ...o, label: 'Best match' } : o))
const GRID = 'grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const sort = params.get('sort') ?? 'featured'
  const [draft, setDraft] = useState(query)
  const [shownFor, setShownFor] = useState(query)
  const { products, status } = useCatalog()
  const { categories } = useSite()

  // Back/forward or the search panel can change the address while this page is open.
  if (shownFor !== query) {
    setShownFor(query)
    setDraft(query)
  }

  const live = useMemo(() => categories.filter((c) => c.status === 'live'), [categories])
  const results = useMemo(() => searchProducts(products, categories, query), [products, categories, query])
  const visible = applyFilters(results, NO_FILTERS, sort)
  const categoryHits = searchCategories(live, query)

  const submit = (e) => {
    e.preventDefault()
    if (draft.trim()) setParams({ q: draft.trim() })
  }

  const setSort = (value) => {
    const next = new URLSearchParams(params)
    if (value === 'featured') next.delete('sort')
    else next.set('sort', value)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:px-8 md:pt-14">
      <title>{query ? `“${query}” | ${BRAND.name}` : `Search | ${BRAND.name}`}</title>

      <form onSubmit={submit} role="search" className="mx-auto flex max-w-2xl items-center gap-3 border-b border-base-content/40 pb-2">
        <SearchIcon size={20} strokeWidth={1.4} className="opacity-60" />
        <input
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search sarees, colours, jewellery…"
          aria-label="Search the shop"
          enterKeyHint="search"
          className="h-12 min-w-0 flex-1 bg-transparent font-display text-2xl outline-none placeholder:opacity-50 md:text-3xl"
        />
        <button type="submit" className="btn btn-primary btn-sm uppercase tracking-[0.15em]">
          Search
        </button>
      </form>

      {categoryHits.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categoryHits.map((c) => (
            <Link key={c.slug} to={collectionPath(c.slug)} className="bg-base-200 px-4 py-2 text-sm transition hover:text-primary">
              Shop all {c.name}
            </Link>
          ))}
        </div>
      )}

      {!query ? (
        <p className="py-20 text-center opacity-60">Type what you're looking for: a colour, a fabric, or a name.</p>
      ) : status === 'error' && !products.length ? (
        <CatalogNotice className="py-20" />
      ) : status === 'loading' ? (
        <ProductGridSkeleton count={4} className={`mt-12 ${GRID}`} />
      ) : visible.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-3xl">Nothing found for “{query}”</p>
          <p className="mt-2 text-sm opacity-70">Check the spelling, or try a broader word like saree, red or silk.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[...live.map((c) => ({ to: collectionPath(c.slug), label: c.name })), { to: collectionPath('new'), label: 'New Arrivals' }].map((l) => (
              <Link key={l.to} to={l.to} className="border border-base-300 px-4 py-2 text-sm transition hover:border-primary hover:text-primary">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10 flex items-center justify-between gap-3 border-b border-base-300 py-4">
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">
              {visible.length} {visible.length === 1 ? 'piece' : 'pieces'} for “{query}”
            </p>
            <label className="sr-only" htmlFor="search-sort">
              Sort by
            </label>
            <select id="search-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="select select-sm w-auto min-w-0 text-xs">
              {SORTS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className={`mt-8 ${GRID}`}>
            {visible.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 4) * 0.06}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

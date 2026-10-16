export const PRICE_RANGES = [
  { id: 'under-12k', label: 'Under ৳ 12,000', test: (p) => p.price < 12000 },
  { id: '12k-20k', label: '৳ 12,000 – 20,000', test: (p) => p.price >= 12000 && p.price <= 20000 },
  { id: 'over-20k', label: 'Over ৳ 20,000', test: (p) => p.price > 20000 },
]

export const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
]

const SORTERS = {
  newest: (a, b) => b.addedOn.localeCompare(a.addedOn),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
}

// Distinct values present in the list, so filters never offer empty options.
export function getFilterOptions(items) {
  const unique = (key) => [...new Set(items.map((p) => p[key]))].sort()
  return {
    fabric: unique('fabric'),
    color: unique('color'),
    price: PRICE_RANGES.filter((r) => items.some(r.test)).map(({ id, label }) => ({ id, label })),
  }
}

// filters: { fabric: string[], color: string[], price: string[] }
export function applyFilters(items, filters, sort) {
  const ranges = PRICE_RANGES.filter((r) => filters.price.includes(r.id))
  const result = items.filter(
    (p) =>
      (!filters.fabric.length || filters.fabric.includes(p.fabric)) &&
      (!filters.color.length || filters.color.includes(p.color)) &&
      (!ranges.length || ranges.some((r) => r.test(p))),
  )
  return SORTERS[sort] ? [...result].sort(SORTERS[sort]) : result
}

import { unitPrice } from './product.js'

export const PRICE_RANGES = [
  { id: 'under-12k', label: 'Under ৳ 12,000', test: (p) => unitPrice(p) < 12000 },
  { id: '12k-20k', label: '৳ 12,000 – 20,000', test: (p) => unitPrice(p) >= 12000 && unitPrice(p) <= 20000 },
  { id: 'over-20k', label: 'Over ৳ 20,000', test: (p) => unitPrice(p) > 20000 },
]

export const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
]

const SORTERS = {
  newest: (a, b) => b.addedOn.localeCompare(a.addedOn),
  'price-asc': (a, b) => unitPrice(a) - unitPrice(b),
  'price-desc': (a, b) => unitPrice(b) - unitPrice(a),
}

export const FILTER_KEYS = ['type', 'fabric', 'color', 'price']

// Distinct values present in the list, so filters never offer empty options.
// types: the category's types from the admin ({ slug, label }), in the admin's order.
export function getFilterOptions(items, types = []) {
  const unique = (key) => [...new Set(items.map((p) => p[key]).filter(Boolean))].sort()
  return {
    type: types.filter((t) => items.some((p) => p.type === t.slug)).map((t) => ({ id: t.slug, label: t.label })),
    fabric: unique('fabric'),
    color: unique('color'),
    price: PRICE_RANGES.filter((r) => items.some(r.test)).map(({ id, label }) => ({ id, label })),
  }
}

// filters: { type: string[], fabric: string[], color: string[], price: string[] }
export function applyFilters(items, filters, sort) {
  const ranges = PRICE_RANGES.filter((r) => filters.price.includes(r.id))
  const result = items.filter(
    (p) =>
      (!filters.type.length || filters.type.includes(p.type)) &&
      (!filters.fabric.length || filters.fabric.includes(p.fabric)) &&
      (!filters.color.length || filters.color.includes(p.color)) &&
      (!ranges.length || ranges.some((r) => r.test(p))),
  )
  return SORTERS[sort] ? [...result].sort(SORTERS[sort]) : result
}

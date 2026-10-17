// A collection page is either a category from the admin, or "New Arrivals" across all of them.
const NEW_ARRIVALS = {
  slug: 'new',
  title: 'New Arrivals',
  bangla: 'নতুন সংগ্রহ',
  intro: 'The latest pieces from our weavers and artisans.',
  banner: '/images/placeholder/jamdani-rainbow.jpg',
  template: 'mixed',
  types: [],
  items: (products) => [...products].sort((a, b) => b.addedOn.localeCompare(a.addedOn)),
}

export function categoryToCollection(category) {
  return {
    slug: category.slug,
    title: category.name,
    bangla: category.nameBangla,
    intro: category.intro,
    banner: category.banner,
    template: category.template,
    types: category.types ?? [],
    comingSoon: category.status === 'coming-soon',
    items: (products) => products.filter((p) => p.category === category.slug),
  }
}

export function findCollection(slug, categories) {
  if (slug === NEW_ARRIVALS.slug) return NEW_ARRIVALS
  const category = categories.find((c) => c.slug === slug)
  return category ? categoryToCollection(category) : null
}

export const collectionPath = (slug) => `/collections/${slug}`

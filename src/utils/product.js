// "Tangail · Half-silk · 100 count" for saris; the first detail rows for everything else.
export function getSubtitle(product) {
  const parts = [product.origin, product.fabric, product.count && `${product.count} count`].filter(Boolean)
  if (parts.length > 1) return parts.join(' · ')
  return [...parts, ...(product.details ?? []).slice(0, 2).map((d) => d.value)].join(' · ')
}

export const isSoldOut = (product) => product.stock < 1

// What a piece costs right now: the campaign price while a sale covers it (worked out by the server).
export const unitPrice = (product) => product.salePrice ?? product.price

// The price to show crossed out: the full price during a sale, otherwise the old price set in the admin.
export const wasPrice = (product) => (product.salePrice !== undefined ? product.price : product.compareAt)

export function percentOff(product) {
  const was = wasPrice(product)
  return was ? Math.round((1 - unitPrice(product) / was) * 100) : 0
}

// Newest pieces that have photos, for the home page.
export function getFeatured(products, count = 4) {
  return products
    .filter((p) => p.images.length && !isSoldOut(p))
    .sort((a, b) => b.addedOn.localeCompare(a.addedOn))
    .slice(0, count)
}

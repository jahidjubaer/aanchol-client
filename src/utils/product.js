export function getSubtitle(product) {
  return `${product.origin} · ${product.fabric} · ${product.count} count`
}

export const isSoldOut = (product) => product.stock < 1

// Newest pieces that have photos, for the home page.
export function getFeatured(products, count = 4) {
  return products
    .filter((p) => p.images.length && !isSoldOut(p))
    .sort((a, b) => b.addedOn.localeCompare(a.addedOn))
    .slice(0, count)
}

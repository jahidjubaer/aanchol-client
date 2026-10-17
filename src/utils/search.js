// Shop search. The whole catalogue is already in the browser, so searching is instant and works offline.

// Spellings people type for the same thing, mapped to the one the products use.
const ALIASES = {
  sari: 'saree',
  saris: 'saree',
  sarees: 'saree',
  shari: 'saree',
  jamdhani: 'jamdani',
  jewelry: 'jewellery',
  jewelery: 'jewellery',
  jewellry: 'jewellery',
  necklaces: 'necklace',
  earrings: 'earring',
  bangles: 'bangle',
  grey: 'gray',
}

export const normalize = (text) =>
  String(text ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

// Words separated by single spaces, with a leading space, so " red" matches "red" and "Red-bordered"
// but not "hundred". Bangla vowel signs are marks (\p{M}), so they stay part of the word.
const wordText = (text) => ` ${normalize(text).replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')}`
const hasWord = (text, token) => text.includes(` ${token}`)

export function queryTokens(query) {
  return normalize(query)
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((t) => ALIASES[t] ?? t)
}

// Fields to look in, most important first. A match in the name counts most.
function fields(product, category) {
  const type = category?.types?.find((t) => t.slug === product.type)
  return [
    [10, [product.name, product.nameBangla]],
    [6, [category?.name, category?.nameBangla, type?.label, category?.template === 'saree' && 'saree']],
    [4, [product.color, product.fabric, product.origin, product.badge]],
    [2, [product.weaver, ...(product.details ?? []).map((d) => d.value)]],
    [1, [product.description]],
  ].map(([weight, values]) => [weight, wordText(values.filter(Boolean).join(' '))])
}

// Products where every word of the query appears somewhere, best matches first.
export function searchProducts(products, categories, query) {
  const tokens = queryTokens(query)
  if (!tokens.length) return []
  const bySlug = new Map(categories.map((c) => [c.slug, c]))

  return products
    .map((product) => {
      const haystacks = fields(product, bySlug.get(product.category))
      let score = 0
      for (const token of tokens) {
        const best = haystacks.reduce((top, [weight, text]) => (hasWord(text, token) ? Math.max(top, weight) : top), 0)
        if (!best) return null
        score += best
      }
      if (normalize(product.name).startsWith(tokens[0])) score += 5
      if (product.stock < 1) score -= 3 // sold-out pieces still show, after the ones you can buy
      return { product, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.product)
}

// Categories whose name matches, so "jewel" offers the whole Jewellery page as well as pieces.
export function searchCategories(categories, query) {
  const tokens = queryTokens(query)
  if (!tokens.length) return []
  return categories.filter((c) => {
    const text = wordText([c.name, c.nameBangla, c.template === 'saree' && 'saree', ...(c.types ?? []).map((t) => t.label)].filter(Boolean).join(' '))
    return tokens.every((t) => hasWord(text, t))
  })
}

export const searchPath = (query) => `/search?q=${encodeURIComponent(query.trim())}`

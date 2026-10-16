// Sample products for building the UI. Replaced by the API later.
// Images are temporary Wikimedia photos (see photoCredits.js).
const IMG = '/images/placeholder'

export const products = [
  {
    slug: 'rokto-kolka-jamdani',
    name: 'Rokto Kolka Jamdani',
    subtitle: 'Tangail · Half-silk · 100 count',
    price: 18500,
    badge: 'On the loom',
    category: 'jamdani',
    image: `${IMG}/jamdani-red-on-loom.jpg`,
    colors: { base: '#7a1f2b', motif: '#d9b56a' },
  },
  {
    slug: 'ash-shapla-butidar-jamdani',
    name: 'Ash Shapla Butidar Jamdani',
    subtitle: 'Tangail · Cotton · 84 count',
    price: 11200,
    badge: 'New',
    category: 'jamdani',
    image: `${IMG}/jamdani-ash-red.jpg`,
    hoverImage: `${IMG}/jamdani-ash-red-detail.jpg`,
    colors: { base: '#9a9a96', motif: '#b3262e' },
  },
  {
    slug: 'kacha-holud-jamdani',
    name: 'Kacha Holud Jamdani',
    subtitle: 'Tangail · Half-silk · 84 count',
    price: 13400,
    category: 'jamdani',
    image: `${IMG}/jamdani-yellow.jpg`,
    colors: { base: '#e2b520', motif: '#faf6ee' },
  },
  {
    slug: 'rongdhonu-jamdani',
    name: 'Rongdhonu Jamdani',
    subtitle: 'Tangail · Silk · 120 count',
    price: 24500,
    compareAt: 26800,
    badge: 'Limited',
    category: 'jamdani',
    image: `${IMG}/jamdani-rainbow.jpg`,
    colors: { base: '#5b2a6e', motif: '#e98b3a' },
  },
  {
    slug: 'kochupata-green-jamdani',
    name: 'Kochupata Green Jamdani',
    subtitle: 'Tangail · Half-silk · 100 count',
    price: 16800,
    category: 'jamdani',
    colors: { base: '#1f4d3a', motif: '#e6c77d' },
  },
  {
    slug: 'tara-buti-midnight-jamdani',
    name: 'Tara Buti Midnight Jamdani',
    subtitle: 'Tangail · Silk · 120 count',
    price: 22000,
    category: 'jamdani',
    colors: { base: '#1d2340', motif: '#d9b56a' },
  },
]

export const featuredProducts = products.filter((p) => p.image).slice(0, 4)

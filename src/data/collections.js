// Collection pages. Products come from the API (see context/CatalogProvider.jsx).
export const collections = {
  jamdani: {
    title: 'Tangail Jamdani',
    bangla: 'টাঙ্গাইলের জামদানি',
    intro: 'Handwoven on traditional looms in Tangail. Each sari is one of a kind, with natural variations that mark it as made by hand.',
    banner: '/images/placeholder/category-jamdani.jpg',
    items: (products) => products.filter((p) => p.category === 'jamdani'),
  },
  new: {
    title: 'New Arrivals',
    bangla: 'নতুন সংগ্রহ',
    intro: 'The latest pieces from our weavers.',
    banner: '/images/placeholder/jamdani-rainbow.jpg',
    items: (products) => [...products].sort((a, b) => b.addedOn.localeCompare(a.addedOn)),
  },
  jewellery: {
    title: 'Handmade Jewellery',
    bangla: 'গয়না',
    intro: 'Carved wood and handcrafted pieces, made to be worn with your Jamdani.',
    comingSoon: true,
    items: () => [],
  },
}

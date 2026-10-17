// Shown until /api/site answers for the first time, or if it can't be reached.
// The real content is managed in the admin (Home, Campaigns, Categories). Mirrors server/src/seed/content.js.
const IMG = '/images/placeholder'

export const DEFAULT_SITE = {
  categories: [
    {
      slug: 'jamdani',
      name: 'Tangail Jamdani',
      nameBangla: 'টাঙ্গাইলের জামদানি',
      intro: 'Handwoven on traditional looms in Tangail. Each sari is one of a kind, with natural variations that mark it as made by hand.',
      banner: `${IMG}/category-jamdani.jpg`,
      status: 'live',
      inNav: true,
      template: 'saree',
      types: [],
    },
    {
      slug: 'jewellery',
      name: 'Handmade Jewellery',
      nameBangla: 'গয়না',
      intro: 'Carved wood and handcrafted pieces, made to be worn with your Jamdani.',
      banner: '',
      status: 'coming-soon',
      inNav: true,
      template: 'general',
      types: [],
    },
  ],
  slides: [
    {
      id: 'default',
      image: `${IMG}/hero-loom-red.jpg`,
      imageAlt: 'A red Jamdani sari being woven by hand on the loom',
      eyebrow: 'Handwoven in Tangail',
      title: 'Woven slowly,',
      titleAccent: 'worn for generations',
      bangla: 'টাঙ্গাইলের জামদানি',
      text: 'Each Jamdani is woven by hand, motif by motif, on a traditional loom. No two are ever quite the same.',
      ctaLabel: 'Shop Jamdani',
      ctaLink: '/collections/jamdani',
      cta2Label: 'Our Story',
      cta2Link: '/our-story',
      overlay: 45,
      align: 'left',
    },
  ],
  campaign: null,
  announcement: ['Cash on delivery across Bangladesh', 'Free delivery inside Dhaka'],
  homeSections: ['promise-strip', 'featured', 'categories', 'craft', 'promises'].map((id) => ({ id, visible: true })),
}

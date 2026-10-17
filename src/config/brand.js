// Single place for brand identity. Name is a placeholder until finalized.
export const BRAND = {
  name: 'Aanchol',
  nameBangla: 'আঁচল',
  tagline: 'Handwoven Heritage',
  // What the name means, shown on the About page. Rewrite if the name changes.
  meaning: 'is the loose end of a sari, the part that falls over the shoulder and carries its finest weaving.',
  announcement: ['Cash on delivery across Bangladesh', 'Free delivery inside Dhaka'],
  phone: '+880 1XXX-XXXXXX',
  whatsapp: '8801XXXXXXXXX',
  email: 'hello@aanchol.com', // placeholder until the domain is bought
  hours: 'Every day, 10am to 8pm', // placeholder: when WhatsApp and calls are answered
  socials: [
    { label: 'Facebook', href: 'https://facebook.com/' },
    { label: 'Instagram', href: 'https://instagram.com/' },
  ],
}

export const NAV_LINKS = [
  { label: 'Jamdani', bangla: 'জামদানি', to: '/collections/jamdani' },
  { label: 'Jewellery', bangla: 'গয়না', to: '/collections/jewellery' },
  { label: 'Our Story', bangla: 'আমাদের গল্প', to: '/our-story' },
]

export const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      { label: 'Tangail Jamdani', to: '/collections/jamdani' },
      { label: 'Jewellery', to: '/collections/jewellery' },
      { label: 'New Arrivals', to: '/collections/new' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', to: '/our-story' },
      { label: 'About Us', to: '/about' },
      { label: 'Photo Credits', to: '/credits' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Delivery', to: '/contact#delivery' },
      { label: 'Exchange', to: '/contact#exchange' },
      { label: 'Jamdani Care Guide', to: '/contact#care' },
    ],
  },
]

// Exchange rule shown on product, About and Contact pages (placeholder until confirmed).
export const EXCHANGE_POLICY = {
  short: 'Within 3 days if unworn, with tags',
  days: 3,
}

export const PAYMENT_METHODS = ['Cash on Delivery', 'bKash', 'Nagad', 'Cards']

// Delivery charges in Taka (placeholders until confirmed).
export const DELIVERY_OPTIONS = [
  { id: 'inside-dhaka', label: 'Inside Dhaka', eta: '1–2 days', fee: 0 },
  { id: 'outside-dhaka', label: 'Outside Dhaka', eta: '2–5 days', fee: 150 },
]

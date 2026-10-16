// Single place for brand identity. Name is a placeholder until finalized.
export const BRAND = {
  name: 'Aanchol',
  nameBangla: 'আঁচল',
  tagline: 'Handwoven Heritage',
  announcement: 'Cash on delivery across Bangladesh · Free delivery inside Dhaka',
  phone: '+880 1XXX-XXXXXX',
  whatsapp: '8801XXXXXXXXX',
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
    title: 'Help',
    links: [
      { label: 'Shipping & Delivery', to: '/shipping' },
      { label: 'Returns & Exchange', to: '/returns' },
      { label: 'Jamdani Care Guide', to: '/care' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
]

export const PAYMENT_METHODS = ['Cash on Delivery', 'bKash', 'Nagad', 'Cards']

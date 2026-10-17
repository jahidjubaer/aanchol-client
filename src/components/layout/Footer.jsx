import { Link } from 'react-router'
import { BRAND, FOOTER_LINKS, PAYMENT_METHODS } from '../../config/brand.js'
import { useSite } from '../../context/site.js'
import { collectionPath } from '../../utils/collections.js'
import JamdaniDivider from '../ui/JamdaniDivider.jsx'
import MotifBand from '../ui/MotifBand.jsx'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const { categories } = useSite()
  const shopLinks = {
    title: 'Shop',
    links: [
      ...categories.map((c) => ({ label: c.name, to: collectionPath(c.slug) })),
      { label: 'New Arrivals', to: collectionPath('new') },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  }

  return (
    <footer className="bg-neutral text-neutral-content">
      <MotifBand className="h-3 text-gold/60" />

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr_1.3fr]">
          <div>
            <p className="font-display text-3xl tracking-[0.3em] uppercase">{BRAND.name}</p>
            <p className="mt-1 font-bangla text-gold-light">{BRAND.nameBangla}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-70">
              Handwoven Tangail Jamdani and traditional craft, made by artisans across Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:contents">
            {[shopLinks, ...FOOTER_LINKS].map((group) => (
              <div key={group.title}>
                <p className="eyebrow text-gold-light">{group.title}</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="opacity-75 transition hover:text-gold-light hover:opacity-100">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <p className="eyebrow text-gold-light">Letters from the loom</p>
            <p className="mt-4 text-sm opacity-70">New weaves, artisan stories and private previews.</p>
            <form className="mt-4 flex border-b border-neutral-content/30" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="Your email"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-neutral-content/40"
              />
              <button type="submit" className="px-2 text-xs uppercase tracking-[0.25em] text-gold-light">
                Join
              </button>
            </form>
            <ul className="mt-6 flex gap-6 text-xs uppercase tracking-[0.2em]">
              {BRAND.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="opacity-75 hover:text-gold-light hover:opacity-100">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <JamdaniDivider className="mt-14 mb-6 [&_.fill-base-100]:fill-neutral" />

        <div className="flex flex-col items-center gap-3 text-center text-xs opacity-60 md:flex-row md:justify-between">
          <p>© {YEAR} {BRAND.name}. Handwoven in Bangladesh.</p>
          <p className="tracking-wide">{PAYMENT_METHODS.join(' · ')}</p>
        </div>
      </div>
    </footer>
  )
}

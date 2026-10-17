import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useCatalog } from '../../context/catalog.js'
import { collectionPath } from '../../utils/collections.js'
import { imageSrc } from '../../utils/image.js'
import { EASE_LUXE } from '../../utils/motion.js'
import { isSoldOut } from '../../utils/product.js'
import Price from '../ui/Price.jsx'
import WovenImage from '../ui/WovenImage.jsx'

// Newest pieces of a category, for the menu. Coming-soon categories have none.
function useMenuPieces(category, count = 3) {
  const { products } = useCatalog()
  if (!category || category.status !== 'live') return []
  return products
    .filter((p) => p.category === category.slug && !isSoldOut(p))
    .sort((a, b) => b.addedOn.localeCompare(a.addedOn))
    .slice(0, count)
}

// The drop-down under the desktop menu: the category's types, its intro and its newest pieces.
export default function MegaMenu({ category, onNavigate, onMouseEnter }) {
  const pieces = useMenuPieces(category)
  const types = category.types ?? []
  const path = collectionPath(category.slug)
  const soon = category.status === 'coming-soon'

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: EASE_LUXE }}
      className="absolute inset-x-0 top-full hidden border-t border-base-300 bg-base-100 shadow-[0_12px_24px_-12px_rgb(43_29_22/0.25)] md:block"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[200px_1fr_auto] gap-12 px-8 py-8">
        <div>
          <p className="eyebrow text-base-content/60">{soon ? 'Coming soon' : 'Shop by type'}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to={path} onClick={onNavigate} className="transition hover:text-primary">
                All {category.name}
              </Link>
            </li>
            {!soon &&
              types.map((t) => (
                <li key={t.slug}>
                  <Link to={`${path}?type=${t.slug}`} onClick={onNavigate} className="transition hover:text-primary">
                    {t.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div className="max-w-sm">
          {category.nameBangla && <p className="font-bangla text-secondary">{category.nameBangla}</p>}
          <p className="mt-1 font-display text-3xl leading-tight">{category.name}</p>
          {category.intro && <p className="mt-3 text-sm leading-relaxed opacity-70">{category.intro}</p>}
          <Link to={path} onClick={onNavigate} className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
            {soon ? 'Hear first' : 'Explore'} <ArrowRight size={14} />
          </Link>
        </div>

        {pieces.length > 0 && (
          <ul className="flex gap-4">
            {pieces.map((p) => (
              <li key={p.slug} className="w-36">
                <Link to={`/products/${p.slug}`} onClick={onNavigate} className="group block">
                  <span className="block aspect-[3/4] overflow-hidden bg-base-200">
                    {p.images[0] ? (
                      <img src={imageSrc(p.images[0], 300)} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
                    ) : (
                      <WovenImage base={p.colors?.base} motif={p.colors?.motif} />
                    )}
                  </span>
                  <span className="mt-2 block truncate font-display text-base leading-tight group-hover:text-primary">{p.name}</span>
                  <span className="block text-xs">
                    <Price product={p} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}

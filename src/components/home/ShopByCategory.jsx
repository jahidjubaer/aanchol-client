import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { useSite } from '../../context/site.js'
import { collectionPath } from '../../utils/collections.js'
import { imageSrc } from '../../utils/image.js'
import JamdaniDivider from '../ui/JamdaniDivider.jsx'
import MotifBand from '../ui/MotifBand.jsx'
import Reveal from '../ui/Reveal.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

function PhotoTile({ category }) {
  return (
    <Link to={collectionPath(category.slug)} className="group relative block aspect-[4/5] overflow-hidden md:aspect-square">
      <img
        src={imageSrc(category.banner, 1200)}
        alt=""
        loading="lazy"
        className="size-full object-cover transition duration-[1.6s] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-10">
        {category.nameBangla && <p className="font-bangla text-gold-light">{category.nameBangla}</p>}
        <h3 className="mt-1 text-4xl md:text-5xl">{category.name}</h3>
        <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em]">
          Explore <ArrowRight size={14} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

// Coming-soon categories, and live ones without a banner photo yet.
function WovenTile({ category }) {
  const soon = category.status === 'coming-soon'
  return (
    <Link
      to={collectionPath(category.slug)}
      className="group relative flex aspect-[5/4] flex-col items-center justify-center overflow-hidden bg-neutral px-6 text-center text-neutral-content md:aspect-square"
    >
      <MotifBand className="absolute inset-x-0 top-0 h-3 text-gold/50" />
      <MotifBand className="absolute inset-x-0 bottom-0 h-3 text-gold/50" />
      {soon && <p className="eyebrow text-gold-light">Coming soon</p>}
      {category.nameBangla && <p className="mt-4 font-bangla text-gold-light">{category.nameBangla}</p>}
      <h3 className="mt-1 text-4xl md:text-5xl">{category.name}</h3>
      <JamdaniDivider className="my-6 [&_.fill-base-100]:fill-neutral" />
      {category.intro && <p className="max-w-xs text-sm leading-relaxed opacity-70">{category.intro}</p>}
      <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-light">
        {soon ? 'Hear first' : 'Explore'} <ArrowRight size={14} className="transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

const GRID = {
  1: 'mx-auto max-w-2xl',
  2: 'md:grid-cols-2',
}

export default function ShopByCategory() {
  const { categories } = useSite()
  if (!categories.length) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="Collections" title="Shop by craft" bangla="কারুশিল্প অনুযায়ী" />

      <div className={`mt-12 grid gap-4 md:gap-6 ${GRID[categories.length] ?? 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {categories.map((category, i) => (
          <Reveal key={category.slug} delay={(i % 3) * 0.12}>
            {category.status === 'live' && category.banner ? <PhotoTile category={category} /> : <WovenTile category={category} />}
          </Reveal>
        ))}
      </div>
    </section>
  )
}

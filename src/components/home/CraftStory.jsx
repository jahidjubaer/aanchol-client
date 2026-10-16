import { Link } from 'react-router'
import Reveal from '../ui/Reveal.jsx'

const FACTS = [
  { value: '2013', label: 'Recognised by UNESCO as Intangible Cultural Heritage' },
  { value: 'Weeks', label: 'to months of hand weaving for a single sari' },
  { value: '1', label: 'of a kind. No two pieces are ever identical' },
]

export default function CraftStory() {
  return (
    <section className="bg-base-200">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:gap-16 md:px-8 md:py-28">
        <Reveal className="relative">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="/images/placeholder/craft-hands-weaving.jpg"
              alt="A weaver's hands placing motif threads on a Jamdani loom"
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden bg-primary px-6 py-5 text-primary-content md:block">
            <p className="font-bangla text-2xl">হাতে বোনা</p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] opacity-80">Woven by hand</p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">The Craft</p>
            <h2 className="mt-3 text-4xl leading-tight md:text-5xl">
              Every motif,
              <br />
              <em className="font-normal">placed by hand</em>
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed opacity-80">
              Jamdani is woven on a traditional loom, where the weaver lays each motif into the cloth thread by thread,
              without a printed guide. The patterns live in the weaver's memory and are passed from one generation to the
              next.
            </p>
          </Reveal>

          <dl className="mt-10 grid gap-6 border-t border-base-300 pt-8 sm:grid-cols-3">
            {FACTS.map((fact, i) => (
              <Reveal key={fact.label} delay={i * 0.12}>
                <dt className="font-display text-4xl text-primary">{fact.value}</dt>
                <dd className="mt-1 text-sm leading-snug opacity-70">{fact.label}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.2}>
            <Link to="/our-story" className="btn btn-primary mt-10 px-8 uppercase tracking-[0.2em]">
              Meet the Weavers
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

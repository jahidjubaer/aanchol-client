import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import JamdaniDivider from '../ui/JamdaniDivider.jsx'
import MotifBand from '../ui/MotifBand.jsx'
import Reveal from '../ui/Reveal.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

export default function ShopByCategory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="Collections" title="Shop by craft" bangla="কারুশিল্প অনুযায়ী" />

      <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-6">
        <Reveal>
          <Link to="/collections/jamdani" className="group relative block aspect-[4/5] overflow-hidden md:aspect-square">
            <img
              src="/images/placeholder/category-jamdani.jpg"
              alt="Jamdani sarees displayed in a weaver's shop"
              loading="lazy"
              className="size-full object-cover transition duration-[1.6s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-10">
              <p className="font-bangla text-gold-light">জামদানি</p>
              <h3 className="mt-1 text-4xl md:text-5xl">Tangail Jamdani</h3>
              <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em]">
                Explore <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative flex aspect-[5/4] flex-col items-center justify-center overflow-hidden bg-neutral px-6 text-center text-neutral-content md:aspect-square">
            <MotifBand className="absolute inset-x-0 top-0 h-3 text-gold/50" />
            <MotifBand className="absolute inset-x-0 bottom-0 h-3 text-gold/50" />
            <p className="eyebrow text-gold-light">Coming soon</p>
            <p className="mt-4 font-bangla text-gold-light">গয়না</p>
            <h3 className="mt-1 text-4xl md:text-5xl">Handmade Jewellery</h3>
            <JamdaniDivider className="my-6 [&_.fill-base-100]:fill-neutral" />
            <p className="max-w-xs text-sm leading-relaxed opacity-70">
              Carved wood and handcrafted pieces, made to be worn with your Jamdani.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import JamdaniDivider from '../components/ui/JamdaniDivider.jsx'
import MotifBand from '../components/ui/MotifBand.jsx'
import ProductCard from '../components/ui/ProductCard.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { useCatalog } from '../context/catalog.js'

const SWATCHES = [
  { name: 'Ivory', className: 'bg-base-100 border border-base-300', hex: '#FAF6EE' },
  { name: 'Sand', className: 'bg-base-200', hex: '#F3EBDD' },
  { name: 'Ink', className: 'bg-neutral', hex: '#2B1D16' },
  { name: 'Maroon', className: 'bg-primary', hex: '#7A1F2B' },
  { name: 'Gold', className: 'bg-secondary', hex: '#B8892D' },
  { name: 'Bottle Green', className: 'bg-accent', hex: '#1F4D3A' },
]

function Block({ title, children }) {
  return (
    <section className="border-t border-base-300 py-12">
      <p className="eyebrow mb-6">{title}</p>
      {children}
    </section>
  )
}

// Internal preview of the design system. Not linked from the public navigation.
export default function StyleGuide() {
  const { products } = useCatalog()
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <SectionHeading eyebrow="Design System" title="Ivory & Gold Heritage" bangla="ঐতিহ্যের নকশা">
        The building blocks every page is made from.
      </SectionHeading>

      <Block title="Colours">
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {SWATCHES.map((s) => (
            <div key={s.name}>
              <div className={`aspect-square ${s.className}`} />
              <p className="mt-2 text-sm">{s.name}</p>
              <p className="text-xs opacity-60">{s.hex}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Typography">
        <p className="font-display text-6xl md:text-7xl">Tangail Jamdani</p>
        <p className="mt-2 font-display text-3xl italic opacity-80">Woven slowly, worn for generations</p>
        <p className="mt-4 font-bangla text-3xl text-primary">টাঙ্গাইলের জামদানি</p>
        <p className="mt-6 max-w-2xl leading-relaxed opacity-80">
          Body text is set in Jost Light. Each Jamdani is woven by hand, motif by motif, on a traditional pit loom. A
          single sari can take a weaver weeks or even months to finish.
        </p>
        <p className="eyebrow mt-6">Eyebrow label</p>
      </Block>

      <Block title="Buttons">
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary px-8 uppercase tracking-[0.2em]">Shop Now</button>
          <button className="btn btn-outline px-8 uppercase tracking-[0.2em]">Our Story</button>
          <button className="btn btn-secondary px-8 uppercase tracking-[0.2em]">Gold</button>
          <button className="btn btn-accent px-8 uppercase tracking-[0.2em]">WhatsApp</button>
          <button className="btn btn-ghost uppercase tracking-[0.2em]">Ghost</button>
        </div>
      </Block>

      <Block title="Motifs">
        <JamdaniDivider />
        <div className="mt-8 space-y-4">
          <MotifBand className="h-3 text-gold" />
          <MotifBand className="h-3 text-primary" />
        </div>
      </Block>

      <Block title="Form fields">
        <div className="grid max-w-xl gap-4 md:grid-cols-2">
          <input className="input w-full" placeholder="Full name" />
          <input className="input w-full" placeholder="Phone number" />
          <select className="select w-full md:col-span-2" defaultValue="">
            <option value="" disabled>
              Delivery area
            </option>
            <option>Inside Dhaka</option>
            <option>Outside Dhaka</option>
          </select>
        </div>
      </Block>

      <Block title="Product cards">
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Block>
    </div>
  )
}

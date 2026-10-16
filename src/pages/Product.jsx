import { HandHeart, MessageCircle, ShieldCheck, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import ProductGallery from '../components/product/ProductGallery.jsx'
import StickyBuyBar from '../components/product/StickyBuyBar.jsx'
import JamdaniDivider from '../components/ui/JamdaniDivider.jsx'
import ProductCard from '../components/ui/ProductCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { BRAND } from '../config/brand.js'
import { useCart } from '../context/cart.js'
import { collections } from '../data/collections.js'
import { getProduct, JAMDANI_SPECS, products } from '../data/products.js'
import { formatPrice } from '../utils/formatPrice.js'
import { productWhatsappMessage, whatsappLink } from '../utils/whatsapp.js'
import NotFound from './NotFound.jsx'

const ASSURANCES = [
  { icon: Truck, text: 'Cash on delivery across Bangladesh' },
  { icon: HandHeart, text: 'Handwoven on a traditional loom' },
  { icon: ShieldCheck, text: 'Authenticity guaranteed' },
]

function Accordion({ title, children, open = false }) {
  return (
    <details className="collapse collapse-plus rounded-none border-b border-base-300" open={open}>
      <summary className="collapse-title px-0 font-display text-xl">{title}</summary>
      <div className="collapse-content px-0 text-sm leading-relaxed opacity-80">{children}</div>
    </details>
  )
}

function Specs({ rows }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="opacity-60">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

// Shows the sticky bar on phones once the main buttons have scrolled out of view.
function useOutOfView(ref) {
  const [outOfView, setOutOfView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) =>
      setOutOfView(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return outOfView
}

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const cart = useCart()
  const buyRef = useRef(null)
  const showStickyBar = useOutOfView(buyRef)

  if (!product) return <NotFound />

  const collection = collections[product.category]
  const inCart = cart.lines.find((l) => l.slug === product.slug)?.qty ?? 0
  const soldOutForYou = inCart >= product.stock
  const addLabel = soldOutForYou ? 'In your bag' : 'Add to bag'
  const waHref = whatsappLink(productWhatsappMessage(product))
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4)

  const add = () => !soldOutForYou && cart.addItem(product)

  return (
    <>
      <title>{`${product.name} | ${BRAND.name}`}</title>

      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pt-8">
        <div className="md:grid md:grid-cols-[1.15fr_1fr] md:gap-12 lg:gap-20">
          <ProductGallery key={product.slug} product={product} />

          <div className="pt-6 md:pt-0">
            <div className="md:sticky md:top-32">
              <nav aria-label="Breadcrumb" className="text-xs tracking-wide opacity-60">
                <Link to="/" className="hover:underline">
                  Home
                </Link>
                {' / '}
                <Link to={`/collections/${product.category}`} className="hover:underline">
                  {collection?.title}
                </Link>
              </nav>

              {product.badge && <p className="eyebrow mt-5">{product.badge}</p>}
              <h1 className="mt-2 text-4xl leading-tight md:text-5xl">{product.name}</h1>
              <p className="mt-1 font-bangla text-primary">{product.nameBangla}</p>

              <p className="mt-4 text-xl">
                {formatPrice(product.price)}
                {product.compareAt && (
                  <span className="ml-3 text-base line-through opacity-50">{formatPrice(product.compareAt)}</span>
                )}
              </p>
              <p className="mt-1 text-xs tracking-wide opacity-60">
                {product.stock === 1 ? 'One of a kind · only 1 available' : `Only ${product.stock} available`}
              </p>

              <JamdaniDivider className="my-6 justify-start" />

              <p className="leading-relaxed opacity-85">{product.description}</p>
              <p className="mt-4 text-sm">
                <span className="opacity-60">Fabric</span> {product.fabric} · {product.count} count
                <span className="mx-2 opacity-30">|</span>
                <span className="opacity-60">Colour</span> {product.color}
              </p>

              <div ref={buyRef} className="mt-8 grid gap-3">
                <button
                  type="button"
                  onClick={add}
                  disabled={soldOutForYou}
                  className="btn btn-primary btn-lg text-xs uppercase tracking-[0.25em]"
                >
                  {addLabel}
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-accent btn-lg text-xs uppercase tracking-[0.25em]"
                >
                  <MessageCircle size={18} strokeWidth={1.5} /> Order on WhatsApp
                </a>
              </div>

              <ul className="mt-6 grid gap-2 text-sm">
                {ASSURANCES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 opacity-80">
                    <Icon size={18} strokeWidth={1.2} className="text-secondary" /> {text}
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-base-300">
                <Accordion title="Details & size" open>
                  <Specs
                    rows={[
                      ['Origin', `${product.origin}, Bangladesh`],
                      ['Fabric', `${product.fabric}, ${product.count} count`],
                      ['Length', JAMDANI_SPECS.length],
                      ['Width', JAMDANI_SPECS.width],
                      ['Blouse piece', JAMDANI_SPECS.blouse],
                      ['Weaving time', product.weavingTime],
                    ]}
                  />
                  <p className="mt-4 italic">
                    Small irregularities in the weave are the signature of a hand loom, not flaws.
                  </p>
                </Accordion>
                <Accordion title="The weaver's story">
                  <p>
                    Woven by a {product.weaver.charAt(0).toLowerCase() + product.weaver.slice(1)}. Every motif in this
                    sari was laid into the cloth by hand, one thread at a time, over {product.weavingTime.toLowerCase()}.
                  </p>
                </Accordion>
                <Accordion title="Care guide">
                  <ul className="list-disc space-y-1 pl-5">
                    {JAMDANI_SPECS.care.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </Accordion>
                <Accordion title="Delivery & exchange">
                  <Specs
                    rows={[
                      ['Inside Dhaka', '1–2 days · free'],
                      ['Outside Dhaka', '2–5 days · ৳ 150'],
                      ['Payment', 'Cash on delivery, bKash, Nagad'],
                      ['Exchange', 'Within 3 days if unworn, with tags'],
                    ]}
                  />
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-base-300 bg-base-200">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
            <SectionHeading eyebrow="You may also love" title="More from the loom" />
            <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Leaves room so the sticky bar never covers the footer on phones */}
      <div className="h-20 md:hidden" aria-hidden="true" />

      <StickyBuyBar
        visible={showStickyBar}
        product={product}
        onAdd={add}
        whatsappHref={waHref}
        addLabel={addLabel}
        addDisabled={soldOutForYou}
      />
    </>
  )
}

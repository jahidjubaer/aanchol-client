import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/cart.js'
import { useCatalog } from '../../context/catalog.js'
import { formatPrice } from '../../utils/formatPrice.js'
import { isSoldOut, unitPrice } from '../../utils/product.js'
import ProductCard from '../ui/ProductCard.jsx'
import Reveal from '../ui/Reveal.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

const SHOWN = 3

// Pieces chosen in the admin for this product; without a choice, the newest pieces from other
// categories (jewellery with a sari, a sari with jewellery).
function pickPieces(product, products, getProduct) {
  const chosen = (product.pairsWith ?? []).map(getProduct).filter((p) => p && !isSoldOut(p))
  if (chosen.length) return chosen.slice(0, SHOWN)
  return products
    .filter((p) => p.category !== product.category && !isSoldOut(p))
    .sort((a, b) => b.addedOn.localeCompare(a.addedOn))
    .slice(0, SHOWN)
}

export default function CompleteTheLook({ product }) {
  const { products, getProduct } = useCatalog()
  const cart = useCart()
  const pieces = pickPieces(product, products, getProduct)
  if (!pieces.length) return null

  // "Add all" adds what isn't in the bag yet, including this piece if it can be bought.
  const look = [product, ...pieces].filter((p) => !isSoldOut(p) && !cart.lines.some((l) => l.slug === p.slug))
  const lookTotal = look.reduce((sum, p) => sum + unitPrice(p), 0)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading eyebrow="Styled together" title="Complete the look" bangla="সম্পূর্ণ সাজ" />
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6">
        {pieces.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
      {look.length > 1 && (
        <div className="mt-10 text-center">
          <button type="button" onClick={() => look.forEach((p) => cart.addItem(p))} className="btn btn-outline px-8 uppercase tracking-[0.2em]">
            <ShoppingBag size={16} strokeWidth={1.5} /> Add all {look.length} to bag · {formatPrice(lookTotal)}
          </button>
        </div>
      )}
    </section>
  )
}

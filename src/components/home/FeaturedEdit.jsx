import { Link } from 'react-router'
import { featuredProducts } from '../../data/products.js'
import ProductCard from '../ui/ProductCard.jsx'
import Reveal from '../ui/Reveal.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

export default function FeaturedEdit() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <SectionHeading eyebrow="The Jamdani Edit" title="New from the loom" bangla="তাঁত থেকে নতুন">
        Pieces woven this season by master weavers in Tangail.
      </SectionHeading>

      <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-6 lg:grid-cols-4">
        {featuredProducts.map((product, i) => (
          <Reveal key={product.slug} delay={i * 0.1}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link to="/collections/jamdani" className="btn btn-outline px-10 uppercase tracking-[0.2em]">
          View All Jamdani
        </Link>
      </div>
    </section>
  )
}

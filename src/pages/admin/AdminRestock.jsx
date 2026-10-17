import { Check, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { LoadError, Loading } from '../../components/admin/FormParts.jsx'
import WovenImage from '../../components/ui/WovenImage.jsx'
import { BRAND } from '../../config/brand.js'
import { useAdminAuth } from '../../context/adminAuth.js'
import { useAdminData } from '../../hooks/useAdminData.js'
import { customerWhatsapp, timeAgo } from '../../utils/adminFormat.js'
import { imageSrc } from '../../utils/image.js'

const backMessage = (person, product) =>
  `Hello${person.name ? ` ${person.name.split(' ')[0]}` : ''}, good news from ${BRAND.name}: "${product.name}" is back in stock. ${window.location.origin}/products/${product.slug}`

// People waiting for sold-out pieces. Once a piece is back, message each one and tick them off.
export default function AdminRestock() {
  const { call } = useAdminAuth()
  const { data, error, reload, replace } = useAdminData('/api/admin/stock-alerts')
  const [problem, setProblem] = useState(null)
  const groups = data?.groups ?? []

  const done = async (alertId) => {
    setProblem(null)
    replace({ groups: groups.map((g) => ({ ...g, waiting: g.waiting.filter((w) => w.id !== alertId) })).filter((g) => g.waiting.length) })
    try {
      await call(`/api/admin/stock-alerts/${alertId}/done`, { method: 'POST' })
    } catch (err) {
      setProblem(err.message)
      reload()
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 md:px-8">
      <title>{`Restock requests | ${BRAND.name} Admin`}</title>
      <h1 className="text-3xl md:text-4xl">Restock requests</h1>
      <p className="mt-1 text-sm opacity-60">
        Customers who tapped "Tell me when it's back" on a sold-out piece. When you add stock, message them on WhatsApp, then tick them off.
      </p>
      {problem && (
        <p role="alert" className="mt-3 text-sm text-error">
          {problem}
        </p>
      )}

      {error && !data && <LoadError error={error} onRetry={reload} />}
      {!data && !error && <Loading />}
      {data && groups.length === 0 && <p className="py-16 text-center opacity-60">Nobody is waiting right now.</p>}

      <div className="mt-6 grid gap-4">
        {groups.map(({ product, waiting }) => {
          const back = product.stock > 0
          return (
            <section key={product.slug} className={`border bg-base-100 ${back ? 'border-accent/60' : 'border-base-300'}`}>
              <div className="flex items-center gap-4 border-b border-base-300 p-4">
                <span className="block size-14 shrink-0 overflow-hidden bg-base-200">
                  {product.image ? <img src={imageSrc(product.image, 120)} alt="" className="size-full object-cover" /> : <WovenImage base={product.colors?.base} motif={product.colors?.motif} />}
                </span>
                <div className="min-w-0 flex-1">
                  <Link to={`/admin/products/${product.slug}`} className="font-display text-xl leading-tight hover:text-primary">
                    {product.name}
                  </Link>
                  <p className={`text-xs ${back ? 'text-accent' : 'opacity-60'}`}>
                    {back ? `Back in stock (${product.stock}): tell them now` : 'Still sold out: add stock in Products, then message them'}
                  </p>
                </div>
                <span className="shrink-0 text-sm opacity-70">{waiting.length} waiting</span>
              </div>
              <ul className="divide-y divide-base-300">
                {waiting.map((w) => (
                  <li key={w.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                    <span className="min-w-0 flex-1">
                      {w.name || 'Customer'} · {w.phone}
                      <span className="block text-xs opacity-60">asked {timeAgo(w.createdAt)}</span>
                    </span>
                    <a
                      href={customerWhatsapp(w.phone, backMessage(w, product))}
                      target="_blank"
                      rel="noreferrer"
                      className={`btn btn-sm ${back ? 'btn-accent' : 'btn-ghost'}`}
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <button type="button" onClick={() => done(w.id)} className="btn btn-outline btn-sm">
                      <Check size={14} /> Told
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}

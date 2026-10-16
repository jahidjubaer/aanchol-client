import { useEffect, useState } from 'react'
import { useCatalog } from '../../context/catalog.js'

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-[3/4] animate-pulse bg-base-200" />
      <div className="mt-4 h-5 w-3/4 animate-pulse bg-base-200" />
      <div className="mt-2 h-3 w-1/2 animate-pulse bg-base-200" />
      <div className="mt-3 h-4 w-1/3 animate-pulse bg-base-200" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 4, className }) {
  return (
    <div className={className} role="status" aria-label="Loading pieces">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

function useSlow(ms) {
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), ms)
    return () => clearTimeout(timer)
  }, [ms])
  return slow
}

// Shown under skeletons: explains a slow first load, or offers a retry when it fails.
export function CatalogNotice({ className = '' }) {
  const { status, retry } = useCatalog()
  const slow = useSlow(5000)

  if (status === 'error') {
    return (
      <div role="alert" className={`text-center text-sm ${className}`}>
        <p className="opacity-80">We couldn't load our pieces just now.</p>
        <button type="button" onClick={retry} className="btn btn-outline btn-sm mt-4 px-6 uppercase tracking-[0.2em]">
          Try again
        </button>
      </div>
    )
  }
  if (status === 'loading' && slow) {
    return (
      <p role="status" className={`text-center text-sm opacity-70 ${className}`}>
        Opening the shop… the first visit can take up to a minute.
      </p>
    )
  }
  return null
}

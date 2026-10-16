import { useRef, useState } from 'react'
import { imageSrc, imageSrcSet } from '../../utils/image.js'
import WovenImage from '../ui/WovenImage.jsx'

function Slide({ src, alt, colors, eager }) {
  return src ? (
    <img
      src={imageSrc(src, 900)}
      srcSet={imageSrcSet(src, 900)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      className="size-full object-cover"
    />
  ) : (
    <WovenImage base={colors.base} motif={colors.motif} />
  )
}

// Phones: swipeable full-width slider with dots. Desktop: images stacked beside sticky details.
export default function ProductGallery({ product }) {
  const { images, name, colors } = product
  const slides = images.length ? images : [null]
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const el = trackRef.current
    setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  const goTo = (i) => {
    const el = trackRef.current
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Mobile slider */}
      <div className="relative -mx-4 md:hidden">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((src, i) => (
            <div key={i} className="aspect-[3/4] w-full shrink-0 snap-center bg-base-200">
              <Slide src={src} alt={`${name}, view ${i + 1}`} colors={colors} eager={i === 0} />
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? 'w-6 bg-ivory' : 'w-1.5 bg-ivory/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop stack */}
      <div className="hidden space-y-3 md:block">
        {slides.map((src, i) => (
          <div key={i} className="aspect-[3/4] overflow-hidden bg-base-200">
            <Slide src={src} alt={`${name}, view ${i + 1}`} colors={colors} eager={i === 0} />
          </div>
        ))}
      </div>
    </div>
  )
}

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSite } from '../../context/site.js'
import { imageSrc } from '../../utils/image.js'
import { EASE_LUXE } from '../../utils/motion.js'
import SmartLink from '../ui/SmartLink.jsx'

const SLIDE_MS = 7000
const SWIPE_PX = 50
const INK = '43, 29, 22' // --color-ink as rgb, for the photo shade

// The shade over the photo. "overlay" (0–90) is set per slide in the admin.
// Phones: darker at the bottom where the text sits. Desktop: darker on the text side.
function shade(overlay, align, desktop) {
  const o = overlay / 100
  const a = (x) => `rgba(${INK}, ${Math.min(0.92, x).toFixed(2)})`
  if (!desktop) return `linear-gradient(to top, ${a(o + 0.4)} 0%, ${a(o * 0.7)} 45%, ${a(o * 0.25)} 100%)`
  if (align === 'center') return `radial-gradient(ellipse at center, ${a(o + 0.15)} 0%, ${a(o * 0.6)} 70%, ${a(o * 0.4)} 100%)`
  return `linear-gradient(to right, ${a(o + 0.3)} 0%, ${a(o * 0.75)} 40%, ${a(o * 0.15)} 75%, transparent 100%)`
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12, transition: { duration: 0.4 } },
  transition: { duration: 1.1, delay, ease: EASE_LUXE },
})

function SlideText({ slide }) {
  const center = slide.align === 'center'
  return (
    <div className={`max-w-xl ${center ? 'md:mx-auto md:text-center' : ''}`}>
      {slide.eyebrow && (
        <motion.p {...fadeUp(0.2)} className="eyebrow text-gold-light">
          {slide.eyebrow}
        </motion.p>
      )}
      <motion.h1 {...fadeUp(0.32)} className="mt-4 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
        {slide.title}
        {slide.titleAccent && (
          <>
            <br />
            <em className="font-normal">{slide.titleAccent}</em>
          </>
        )}
      </motion.h1>
      {slide.bangla && (
        <motion.p {...fadeUp(0.44)} lang="bn" className="mt-3 font-bangla text-xl text-gold-light">
          {slide.bangla}
        </motion.p>
      )}
      {slide.text && (
        <motion.p {...fadeUp(0.56)} className={`mt-5 max-w-md leading-relaxed opacity-90 ${center ? 'md:mx-auto' : ''}`}>
          {slide.text}
        </motion.p>
      )}
      {(slide.ctaLabel || slide.cta2Label) && (
        <motion.div {...fadeUp(0.68)} className={`mt-8 grid grid-cols-2 gap-3 sm:flex ${center ? 'md:justify-center' : ''}`}>
          {slide.ctaLabel && (
            <SmartLink
              to={slide.ctaLink}
              className={`btn btn-primary whitespace-nowrap px-4 uppercase tracking-[0.2em] sm:px-8 ${slide.cta2Label ? '' : 'col-span-2'}`}
            >
              {slide.ctaLabel}
            </SmartLink>
          )}
          {slide.cta2Label && (
            <SmartLink
              to={slide.cta2Link}
              className={`btn btn-outline whitespace-nowrap border-ivory px-4 uppercase tracking-[0.2em] text-ivory hover:border-ivory hover:bg-ivory hover:text-ink sm:px-8 ${slide.ctaLabel ? '' : 'col-span-2'}`}
            >
              {slide.cta2Label}
            </SmartLink>
          )}
        </motion.div>
      )}
    </div>
  )
}

function SlidePhoto({ slide, first, reduceMotion }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: EASE_LUXE }}
    >
      <motion.picture
        className="absolute inset-0 block"
        initial={reduceMotion ? false : { scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: SLIDE_MS / 1000 + 1.5, ease: 'easeOut' }}
      >
        {slide.mobileImage && <source media="(max-width: 767px)" srcSet={imageSrc(slide.mobileImage, 1000)} />}
        <source media="(max-width: 767px)" srcSet={imageSrc(slide.image, 1000)} />
        <img
          src={imageSrc(slide.image, 2400)}
          alt={slide.imageAlt ?? ''}
          className="size-full object-cover"
          fetchPriority={first ? 'high' : 'auto'}
          loading={first ? 'eager' : 'lazy'}
          draggable="false"
        />
      </motion.picture>
      <div className="absolute inset-0 md:hidden" style={{ background: shade(slide.overlay ?? 45, slide.align, false) }} />
      <div className="absolute inset-0 hidden md:block" style={{ background: shade(slide.overlay ?? 45, slide.align, true) }} />
    </motion.div>
  )
}

export default function Hero() {
  const { slides } = useSite()
  const reduceMotion = useReducedMotion()
  const ref = useRef(null)
  const [chosen, setIndex] = useState(0)
  const [paused, setPaused] = useState(false) // pause button
  const [hold, setHold] = useState(false) // hover, focus or touch
  const [hidden, setHidden] = useState(false) // tab in the background
  const count = slides.length
  // Slides can change when fresh content arrives from the server; start over if this one is gone.
  const index = chosen < count ? chosen : 0
  const current = slides[index]
  const playing = count > 1 && !paused && !hold && !hidden && !reduceMotion

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  const go = useCallback((next) => setIndex((next + count) % count), [count])

  useEffect(() => {
    if (!playing) return
    const timer = setTimeout(() => go(index + 1), SLIDE_MS)
    return () => clearTimeout(timer)
  }, [playing, index, go])

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const onKeyDown = (e) => {
    if (count < 2) return
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }

  if (!current) return null

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink text-ivory"
      aria-roledescription={count > 1 ? 'carousel' : undefined}
      aria-label="Featured"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={() => setHold(false)}
      onKeyDown={onKeyDown}
    >
      <motion.div
        className="relative h-[calc(100svh-7rem)] min-h-[560px] touch-pan-y md:h-[calc(100dvh-8rem)] md:max-h-[900px] md:min-h-[600px]"
        drag={count > 1 ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragStart={() => setHold(true)}
        onDragEnd={(_e, info) => {
          setHold(false)
          if (info.offset.x < -SWIPE_PX) go(index + 1)
          else if (info.offset.x > SWIPE_PX) go(index - 1)
        }}
      >
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <AnimatePresence initial={false}>
            <SlidePhoto key={current.id} slide={current} first={index === 0} reduceMotion={reduceMotion} />
          </AnimatePresence>
        </motion.div>

        <div className="pointer-events-none absolute inset-4 hidden border border-ivory/25 md:block" />

        <div
          className={`absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-20 md:inset-y-0 md:flex md:items-center md:px-8 md:pb-0 ${
            current.align === 'center' ? 'md:justify-center' : ''
          }`}
          aria-roledescription={count > 1 ? 'slide' : undefined}
          aria-label={count > 1 ? `${index + 1} of ${count}` : undefined}
        >
          <AnimatePresence mode="wait">
            <SlideText key={current.id} slide={current} />
          </AnimatePresence>
        </div>
      </motion.div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl items-center gap-4 px-5 pb-6 md:px-8 md:pb-10">
          <p className="font-display text-sm tabular-nums tracking-[0.2em]" aria-hidden="true">
            {String(index + 1).padStart(2, '0')} <span className="opacity-50">/ {String(count).padStart(2, '0')}</span>
          </p>
          <div className="flex flex-1 gap-2" role="group" aria-label="Choose slide">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                aria-current={i === index}
                className="group relative h-6 flex-1 md:max-w-24"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ivory/35 transition group-hover:bg-ivory/60" />
                {i === index && (
                  <motion.span
                    key={`${index}-${playing}`}
                    className="absolute left-0 top-1/2 h-px w-full origin-left -translate-y-1/2 bg-gold-light"
                    initial={{ scaleX: playing ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: playing ? SLIDE_MS / 1000 : 0, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
            className="grid size-9 place-items-center rounded-full border border-ivory/40 transition hover:bg-ivory hover:text-ink"
          >
            {paused ? <Play size={14} strokeWidth={1.5} /> : <Pause size={14} strokeWidth={1.5} />}
          </button>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="grid size-9 place-items-center rounded-full border border-ivory/40 transition hover:bg-ivory hover:text-ink"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="grid size-9 place-items-center rounded-full border border-ivory/40 transition hover:bg-ivory hover:text-ink"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { EASE_LUXE } from '../../utils/motion.js'
import JamdaniDivider from '../ui/JamdaniDivider.jsx'

const HERO_IMAGE = '/images/placeholder/hero-loom-red.jpg'

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, delay, ease: EASE_LUXE },
})

function HeroText({ light = false }) {
  return (
    <>
      <motion.p {...fadeUp(0.3)} className={`eyebrow ${light ? 'text-gold-light' : ''}`}>
        Handwoven in Tangail
      </motion.p>
      <motion.h1 {...fadeUp(0.45)} className="mt-4 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
        Woven slowly,
        <br />
        <em className="font-normal">worn for generations</em>
      </motion.h1>
      <motion.p {...fadeUp(0.6)} className={`mt-3 font-bangla text-xl ${light ? 'text-gold-light' : 'text-primary'}`}>
        টাঙ্গাইলের জামদানি
      </motion.p>
      <motion.p {...fadeUp(0.75)} className="mt-5 max-w-md leading-relaxed opacity-85">
        Each Jamdani is woven by hand, motif by motif, on a traditional loom. No two are ever quite the same.
      </motion.p>
      <motion.div {...fadeUp(0.9)} className="mt-8 grid grid-cols-2 gap-3 sm:flex">
        <Link to="/collections/jamdani" className="btn btn-primary whitespace-nowrap px-4 uppercase tracking-[0.2em] sm:px-8">
          Shop Jamdani
        </Link>
        <Link
          to="/our-story"
          className={`btn btn-outline whitespace-nowrap px-4 uppercase tracking-[0.2em] sm:px-8 ${
            light ? 'border-ivory text-ivory hover:bg-ivory hover:text-ink' : ''
          }`}
        >
          Our Story
        </Link>
      </motion.div>
    </>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Mobile: full-bleed image with text over it */}
      <div className="relative h-[calc(100svh-7rem)] min-h-[560px] md:hidden">
        <motion.img
          src={HERO_IMAGE}
          alt="A red Jamdani sari being woven by hand on the loom"
          className="absolute inset-0 size-full object-cover"
          style={{ y: imageY }}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE_LUXE }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-10 text-ivory">
          <HeroText light />
        </div>
      </div>

      {/* Desktop: editorial split */}
      <div className="mx-auto hidden min-h-[calc(100dvh-8rem)] max-w-7xl grid-cols-[1fr_1.05fr] items-center gap-12 px-8 py-12 md:grid">
        <div>
          <HeroText />
          <JamdaniDivider className="mt-12 justify-start" />
        </div>
        <div className="relative h-[78dvh] max-h-[820px] overflow-hidden">
          <motion.img
            src={HERO_IMAGE}
            alt="A red Jamdani sari being woven by hand on the loom"
            className="absolute inset-0 size-full object-cover"
            style={{ y: imageY }}
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.4, ease: EASE_LUXE }}
          />
          <div className="pointer-events-none absolute inset-4 border border-ivory/40" />
        </div>
      </div>
    </section>
  )
}

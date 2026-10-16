import { motion } from 'motion/react'
import { BRAND } from '../config/brand.js'

// Temporary page to verify theme, fonts and Motion. Real homepage comes next.
export default function Home() {
  return (
    <section className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">{BRAND.tagline}</p>
        <h1 className="mt-4 text-5xl md:text-7xl">Tangail Jamdani</h1>
        <p className="mt-3 font-bangla text-2xl text-primary">{BRAND.nameBangla} · জামদানি</p>
        <div className="gold-rule my-8" />
        <p className="mx-auto max-w-md leading-relaxed opacity-80">
          Woven by hand on the looms of Tangail, thread by thread.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary px-8 uppercase tracking-[0.2em]">Shop Jamdani</button>
          <button className="btn btn-outline btn-secondary px-8 uppercase tracking-[0.2em]">Our Story</button>
        </div>
      </motion.div>
    </section>
  )
}

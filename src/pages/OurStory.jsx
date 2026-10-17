import { Link } from 'react-router'
import JamdaniDivider from '../components/ui/JamdaniDivider.jsx'
import MotifBand from '../components/ui/MotifBand.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { BRAND } from '../config/brand.js'

const STEPS = [
  {
    title: 'The warp is set',
    bangla: 'টানা',
    text: 'Fine cotton threads are stretched across the loom, hundreds side by side. Setting the warp alone can take days.',
  },
  {
    title: 'Two weavers, one loom',
    bangla: 'ওস্তাদ ও সাগরেদ',
    text: 'A master weaver and an apprentice sit side by side. The craft is learned this way, at the loom, over years.',
  },
  {
    title: 'Motifs from memory',
    bangla: 'নকশা',
    text: 'There is no printed pattern. Each motif is counted out thread by thread and laid into the cloth by hand with a fine bamboo needle.',
  },
  {
    title: 'Weeks, sometimes months',
    bangla: 'সময়',
    text: 'A sari with dense motifs grows only a few inches a day. The finer the cotton and the richer the pattern, the longer it takes.',
  },
]

const MOTIFS = [
  { name: 'Butidar', bangla: 'বুটিদার', text: 'Small flowers scattered across the body of the sari.' },
  { name: 'Tesri', bangla: 'তেসরি', text: 'Motifs set on the diagonal, giving the cloth movement.' },
  { name: 'Jaal', bangla: 'জাল', text: 'A net of motifs that covers the whole ground.' },
  { name: 'Panna Hazar', bangla: 'পান্না হাজার', text: '"A thousand emeralds": tiny flowers woven so close they glitter.' },
]

export default function OurStory() {
  return (
    <>
      <title>{`Our Story | ${BRAND.name}`}</title>
      <meta
        name="description"
        content="How a Jamdani sari is woven by hand, motif by motif, and why we bring it to you directly from the weavers."
      />

      <section className="relative isolate overflow-hidden bg-neutral text-neutral-content">
        <img
          src="/images/placeholder/hero-loom-red.jpg"
          alt="A red Jamdani sari being woven by hand on the loom"
          className="absolute inset-0 -z-10 size-full object-cover opacity-45"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral via-neutral/40 to-transparent" />
        <div className="mx-auto flex min-h-[70svh] max-w-4xl flex-col items-center justify-end px-4 pt-24 pb-16 text-center md:pb-24">
          <Reveal>
            <p className="eyebrow text-gold-light">Our Story</p>
            <h1 className="mt-4 text-5xl leading-[1.05] md:text-7xl">
              A cloth woven
              <br />
              <em className="font-normal">from memory</em>
            </h1>
            <p className="mt-4 font-bangla text-xl text-gold-light">আমাদের গল্প</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-20 text-center md:py-28">
        <Reveal>
          <p className="font-display text-2xl leading-relaxed md:text-3xl">
            Jamdani has been woven in Bengal for centuries. In 2013, UNESCO recognised the traditional art of Jamdani
            weaving as part of the world&apos;s Intangible Cultural Heritage.
          </p>
          <JamdaniDivider className="my-8" />
          <p className="leading-relaxed opacity-80">
            {BRAND.name} began with a simple wish: that a sari made with this much patience should reach the woman who
            wears it with its story intact. We work directly with weaving families, so you know where your sari comes
            from, and more of what you pay reaches the people who made it.
          </p>
        </Reveal>
      </section>

      <section className="bg-base-200">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow="The Craft" title="How a Jamdani is made" bangla="যেভাবে বোনা হয়" />
          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.1}>
                <span className="font-display text-5xl text-secondary">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-2xl">{step.title}</h3>
                <p className="font-bangla text-sm text-primary">{step.bangla}</p>
                <p className="mt-3 text-sm leading-relaxed opacity-75">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:gap-16 md:px-8 md:py-28">
        <Reveal className="grid grid-cols-2 gap-3">
          <img
            src="/images/placeholder/craft-hands-weaving.jpg"
            alt="A weaver's hands placing motif threads on the loom"
            loading="lazy"
            className="aspect-[3/4] w-full object-cover"
          />
          <img
            src="/images/placeholder/jamdani-ash-red-detail.jpg"
            alt="Close-up of hand-woven Jamdani motifs"
            loading="lazy"
            className="mt-10 aspect-[3/4] w-full object-cover"
          />
        </Reveal>
        <div>
          <SectionHeading eyebrow="The Motifs" title="A language in thread" align="left">
            Weavers know dozens of traditional motifs by name. These are a few you will find in our collection.
          </SectionHeading>
          <dl className="mt-8 divide-y divide-base-300 border-y border-base-300">
            {MOTIFS.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08} className="py-4">
                <dt className="flex items-baseline gap-3">
                  <span className="font-display text-2xl">{m.name}</span>
                  <span className="font-bangla text-sm text-primary">{m.bangla}</span>
                </dt>
                <dd className="mt-1 text-sm opacity-75">{m.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-primary text-primary-content">
        <MotifBand className="h-3 text-gold-light/50" />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center md:py-20">
          <Reveal>
            <p className="font-bangla text-lg text-gold-light">হাতে বোনা, তাই অনন্য</p>
            <h2 className="mt-2 text-3xl md:text-4xl">Made by hand, never identical</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed opacity-85">
              A slightly uneven motif or a small knot on the reverse is the mark of a hand-woven sari, not a flaw. It is
              how you know a person, not a machine, made it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/collections/jamdani"
                className="btn border-ivory bg-ivory px-8 uppercase tracking-[0.2em] text-ink hover:bg-transparent hover:text-ivory"
              >
                Shop Jamdani
              </Link>
              <Link
                to="/about"
                className="btn btn-outline border-ivory px-8 uppercase tracking-[0.2em] text-ivory hover:bg-ivory hover:text-ink"
              >
                About Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

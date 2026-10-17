import { Camera, HandHeart, MessageCircle, Scale } from 'lucide-react'
import { Link } from 'react-router'
import JamdaniDivider from '../components/ui/JamdaniDivider.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { BRAND, EXCHANGE_POLICY } from '../config/brand.js'
import { deliveryRows } from '../utils/contact.js'

const VALUES = [
  {
    icon: HandHeart,
    title: 'Direct from the loom',
    text: 'We buy from weaving families ourselves, with no wholesaler in between.',
  },
  {
    icon: Scale,
    title: 'Fair to the weaver',
    text: 'Paying weavers properly is what keeps the craft alive for the next generation.',
  },
  {
    icon: Camera,
    title: 'Honest photos',
    text: 'Every piece is photographed as it is. Ask us for a video in daylight before you buy.',
  },
  {
    icon: MessageCircle,
    title: 'A real person to talk to',
    text: 'Questions about colour, drape or an order? We answer on WhatsApp ourselves.',
  },
]

export default function About() {
  return (
    <>
      <title>{`About Us | ${BRAND.name}`}</title>
      <meta
        name="description"
        content={`${BRAND.name} sells handwoven Tangail Jamdani saris directly from the weavers, with cash on delivery across Bangladesh.`}
      />

      <section className="mx-auto max-w-3xl px-4 pt-16 pb-12 text-center md:pt-24">
        <Reveal>
          <p className="eyebrow">About Us</p>
          <h1 className="mt-4 text-5xl leading-tight md:text-6xl">
            {BRAND.name} <span className="font-bangla text-4xl text-primary md:text-5xl">{BRAND.nameBangla}</span>
          </h1>
          <JamdaniDivider className="my-6" />
          <p className="mx-auto max-w-xl leading-relaxed opacity-80">
            <em>{BRAND.name}</em> {BRAND.meaning} We are a Bangladeshi label for handwoven Tangail Jamdani, and soon
            handmade jewellery to wear with it.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <Reveal className="aspect-[16/9] overflow-hidden md:aspect-[21/9]">
          <img
            src="/images/placeholder/jamdani-red-on-loom.jpg"
            alt="A red Jamdani sari on the loom"
            loading="lazy"
            className="size-full object-cover"
          />
        </Reveal>
      </section>

      <section className="bg-base-200">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow="How we work" title="What we promise" bangla="আমাদের প্রতিশ্রুতি" />
          <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <Icon size={28} strokeWidth={1.1} className="text-secondary" />
                <h3 className="mt-4 text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-75">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 md:py-28">
        <SectionHeading eyebrow="Shopping with us" title="Simple and safe" />
        <Reveal>
          <dl className="mt-10 divide-y divide-base-300 border-y border-base-300 text-sm">
            {[
              ...deliveryRows().map(([label, value]) => [`Delivery: ${label}`, value]),
              ['Payment', 'Cash on delivery: pay when it arrives'],
              ['Exchange', EXCHANGE_POLICY.short],
              ['Gift wrap', 'Every sari arrives folded in our keepsake wrap'],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between sm:gap-6">
                <dt className="opacity-60">{label}</dt>
                <dd className="sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/our-story" className="btn btn-primary px-8 uppercase tracking-[0.2em]">
              Our Story
            </Link>
            <Link to="/contact" className="btn btn-outline px-8 uppercase tracking-[0.2em]">
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}

import { HandHeart, MessageCircle, Sparkles, Truck } from 'lucide-react'
import { BRAND } from '../../config/brand.js'
import Reveal from '../ui/Reveal.jsx'

const PROMISES = [
  { icon: HandHeart, title: 'Authentic Handloom', text: 'Sourced directly from weaving families in Tangail.' },
  { icon: Truck, title: 'Cash on Delivery', text: 'Pay when it arrives, anywhere in Bangladesh.' },
  { icon: Sparkles, title: 'Gift Ready', text: 'Every sari arrives folded in our keepsake wrap.' },
  { icon: MessageCircle, title: 'Personal Styling', text: 'Ask us anything on WhatsApp before you buy.' },
]

export default function Promises() {
  return (
    <section className="border-t border-base-300">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08} className="text-center">
              <Icon size={28} strokeWidth={1.1} className="mx-auto text-secondary" />
              <h3 className="mt-4 text-xl">{title}</h3>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed opacity-70">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="bg-primary px-4 py-14 text-center text-primary-content md:py-16">
        <Reveal>
          <p className="font-bangla text-lg text-gold-light">আপনার জন্য বাছাই</p>
          <h2 className="mt-2 text-3xl md:text-4xl">Not sure which Jamdani is yours?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-80">
            Send us the occasion and your favourite colours. We'll suggest pieces with real photos and videos.
          </p>
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn mt-7 border-ivory bg-ivory px-8 uppercase tracking-[0.2em] text-ink hover:bg-transparent hover:text-ivory"
          >
            <MessageCircle size={18} strokeWidth={1.5} /> Chat on WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  )
}

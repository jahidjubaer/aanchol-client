import { Clock, Mail, MessageCircle, Package, Phone } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import Reveal from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { BRAND, EXCHANGE_POLICY } from '../config/brand.js'
import { JAMDANI_SPECS } from '../config/jamdani.js'
import { deliveryRows, phoneLink } from '../utils/contact.js'
import { whatsappLink } from '../utils/whatsapp.js'

const facebook = BRAND.socials.find((s) => s.label === 'Facebook')

const CHANNELS = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    detail: 'The fastest way to reach us. Ask for photos or a video of any piece.',
    action: 'Chat now',
    href: whatsappLink(`Hello ${BRAND.name}, I have a question.`),
    external: true,
    primary: true,
  },
  { icon: Phone, title: 'Call us', detail: BRAND.phone, action: 'Call', href: phoneLink() },
  {
    icon: MessageCircle,
    title: 'Facebook',
    detail: 'Message our page on Messenger.',
    action: 'Open page',
    href: facebook?.href,
    external: true,
  },
  { icon: Mail, title: 'Email', detail: BRAND.email, action: 'Write to us', href: `mailto:${BRAND.email}` },
]

const FAQ = [
  {
    id: 'delivery',
    q: 'How long does delivery take?',
    a: (
      <>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          {deliveryRows().map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="opacity-60">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3">We call or message you to confirm every order before it is sent.</p>
      </>
    ),
  },
  {
    id: 'payment',
    q: 'How do I pay?',
    a: <p>Cash on delivery anywhere in Bangladesh. You pay the delivery person when your sari arrives.</p>,
  },
  {
    id: 'exchange',
    q: 'Can I exchange a sari?',
    a: (
      <p>
        Yes, {EXCHANGE_POLICY.short.charAt(0).toLowerCase() + EXCHANGE_POLICY.short.slice(1)}. Message us on WhatsApp with
        your order number and a photo, and we will arrange it.
      </p>
    ),
  },
  {
    id: 'colour',
    q: 'Will the colour look the same as on screen?',
    a: (
      <p>
        We photograph in daylight, but screens differ. Ask us on WhatsApp and we will send a short video of the exact
        piece.
      </p>
    ),
  },
  {
    id: 'care',
    q: 'How do I care for my Jamdani?',
    a: (
      <ul className="list-disc space-y-1 pl-5">
        {JAMDANI_SPECS.care.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    ),
  },
]

// Footer links like /contact#exchange open that answer and scroll to it.
function useOpenHash() {
  const { hash } = useLocation()
  useEffect(() => {
    const el = hash && document.getElementById(hash.slice(1))
    if (!el) return
    el.setAttribute('open', '')
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [hash])
}

export default function Contact() {
  useOpenHash()

  return (
    <>
      <title>{`Contact Us | ${BRAND.name}`}</title>
      <meta name="description" content={`Reach ${BRAND.name} on WhatsApp, by phone or by email. Delivery, payment and exchange answers.`} />

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
        <SectionHeading as="h1" eyebrow="Contact Us" title="We're here to help" bangla="যোগাযোগ করুন">
          Choosing a sari, checking an order or anything else: talk to us directly.
        </SectionHeading>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.filter((c) => c.href).map(({ icon: Icon, title, detail, action, href, external, primary }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08}>
              <a
                href={href}
                {...(external && { target: '_blank', rel: 'noreferrer' })}
                className={`flex h-full flex-col border p-6 transition ${
                  primary
                    ? 'border-accent bg-accent text-accent-content hover:bg-accent/90'
                    : 'border-base-300 bg-base-100 hover:border-secondary'
                }`}
              >
                <Icon size={26} strokeWidth={1.2} className={primary ? '' : 'text-secondary'} />
                <span className="mt-4 font-display text-2xl">{title}</span>
                <span className="mt-1 flex-1 text-sm break-words opacity-80">{detail}</span>
                <span className="mt-5 text-xs uppercase tracking-[0.2em]">{action} →</span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
          <p className="flex items-start gap-3 bg-base-200 p-5">
            <Clock size={18} strokeWidth={1.4} className="mt-0.5 shrink-0 text-secondary" />
            <span>
              <span className="font-medium">Hours: </span>
              {BRAND.hours}. Messages sent later are answered the next morning.
            </span>
          </p>
          <a
            href={whatsappLink(`Hello ${BRAND.name}, I have a question about my order. Order number: `)}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 bg-base-200 p-5 transition hover:bg-base-300"
          >
            <Package size={18} strokeWidth={1.4} className="mt-0.5 shrink-0 text-secondary" />
            <span>
              <span className="font-medium">Already ordered? </span>
              Send us your order number (it starts with <span className="font-mono">AN-</span>) and we&apos;ll check it
              for you.
            </span>
          </a>
        </Reveal>
      </section>

      <section className="bg-base-200">
        <div className="mx-auto max-w-3xl px-4 py-20 md:py-28">
          <SectionHeading eyebrow="Questions" title="Good to know" />
          <div className="mt-10 border-t border-base-300">
            {FAQ.map(({ id, q, a }) => (
              <details key={id} id={id} className="collapse collapse-plus scroll-mt-28 rounded-none border-b border-base-300">
                <summary className="collapse-title px-0 pr-10 font-display text-xl">{q}</summary>
                <div className="collapse-content px-0 text-sm leading-relaxed opacity-80">{a}</div>
              </details>
            ))}
          </div>
          <p className="mt-10 text-center text-sm opacity-70">
            Didn&apos;t find your answer?{' '}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
              Ask us on WhatsApp
            </a>{' '}
            or{' '}
            <Link to="/collections/jamdani" className="text-primary underline-offset-4 hover:underline">
              keep browsing
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}

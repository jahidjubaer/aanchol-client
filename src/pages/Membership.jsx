import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import MemberCard from '../components/rewards/MemberCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { BRAND } from '../config/brand.js'
import { useAccount } from '../context/account.js'
import { useSite } from '../context/site.js'
import { formatPrice } from '../utils/formatPrice.js'

const STEPS = [
  ['Shop signed in', 'Create a free account with your mobile number and place orders while signed in. Guest orders can be added with their order number.'],
  ['Your level rises by itself', 'Every delivered order counts towards your level. Cancelled orders don\'t, and a level, once reached, is yours to keep.'],
  ['Save on every order', 'Your member discount comes off automatically at checkout, even during a sale: it\'s taken off the sale price.'],
]

export default function Membership() {
  const { memberTiers: tiers } = useSite()
  const { signedIn, customer } = useAccount()
  const top = tiers[tiers.length - 1]

  return (
    <>
      <title>{`Membership | ${BRAND.name}`}</title>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 md:px-8 md:pt-16">
        <SectionHeading as="h1" eyebrow={`${BRAND.name} membership`} title="The more you weave in, the more you save" bangla="সদস্যপদ">
          Up to {top?.percent}% off every order, for life. No fee, no points to count: just shop, and your level rises with every delivered order.
        </SectionHeading>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => (
            <Reveal as="li" key={tier.name} delay={i * 0.08} className="grid justify-items-center gap-4 text-center">
              <MemberCard name={customer?.name ?? 'Your name'} tier={tier} tierIndex={i} className="max-w-xs" />
              <div>
                <p className="font-display text-2xl">{tier.name}</p>
                <p className="text-sm opacity-70">From {formatPrice(tier.min)} spent</p>
                <p className="mt-1 text-lg text-primary">{tier.percent}% off every order</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mx-auto mt-20 max-w-4xl">
          <ol className="grid gap-8 md:grid-cols-3">
            {STEPS.map(([title, text], i) => (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <span className="font-display text-4xl text-secondary">0{i + 1}</span>
                <p className="mt-2 font-display text-2xl">{title}</p>
                <p className="mt-2 text-sm leading-relaxed opacity-75">{text}</p>
              </Reveal>
            ))}
          </ol>

          <div className="mt-14 text-center">
            {signedIn ? (
              <Link to="/account/membership" className="btn btn-primary px-8 uppercase tracking-[0.2em]">
                See my membership <ArrowRight size={16} />
              </Link>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/account/login" state={{ mode: 'register', next: '/account/membership' }} className="btn btn-primary px-8 uppercase tracking-[0.2em]">
                  Join free
                </Link>
                <Link to="/account/login" state={{ next: '/account/membership' }} className="btn btn-outline px-8 uppercase tracking-[0.2em]">
                  Sign in
                </Link>
              </div>
            )}
            <p className="mt-4 text-xs opacity-60">Spend counts the pieces you buy after discounts; delivery and gift wrap aren't included.</p>
          </div>
        </div>
      </div>
    </>
  )
}

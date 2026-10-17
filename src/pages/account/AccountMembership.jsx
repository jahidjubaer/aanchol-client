import { Check } from 'lucide-react'
import { Link } from 'react-router'
import MemberCard from '../../components/rewards/MemberCard.jsx'
import { useAccount } from '../../context/account.js'
import { useMembership } from '../../hooks/useMembership.js'
import { formatPrice } from '../../utils/formatPrice.js'

export default function AccountMembership() {
  const { customer } = useAccount()
  const { membership, status, reload } = useMembership()

  if (status === 'error') {
    return (
      <p role="alert" className="py-10 text-center text-sm">
        We couldn't load your membership.{' '}
        <button type="button" onClick={reload} className="underline underline-offset-4">
          Try again
        </button>
      </p>
    )
  }
  if (!membership) {
    return (
      <div className="grid place-items-center py-20" role="status" aria-label="Loading membership">
        <span className="loading loading-spinner" />
      </div>
    )
  }

  const { spent, tier, next, tiers, memberNo, memberSince } = membership
  const tierIndex = tier ? tiers.findIndex((t) => t.name === tier.name) : -1
  // Progress from the current level (or zero) to the next one.
  const from = tier?.min ?? 0
  const progress = next ? Math.min(100, Math.round(((spent - from) / (next.min - from)) * 100)) : 100

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,24rem)_1fr] md:items-start">
      <div>
        <MemberCard name={customer?.name} tier={tier} tierIndex={tierIndex} memberNo={memberNo} memberSince={memberSince} />
        <p className="mt-3 text-xs opacity-60">
          {tier ? 'Show this card in our shop, or just sign in: the discount is applied at checkout.' : 'Your card appears here when you reach your first level.'}
        </p>
      </div>

      <div>
        <p className="eyebrow text-base-content/60">Spent on delivered orders</p>
        <p className="mt-1 font-display text-4xl">{formatPrice(spent)}</p>
        {tier && <p className="mt-1 text-sm text-primary">{tier.name} member · {tier.percent}% off every order</p>}

        {next ? (
          <div className="mt-6">
            <div className="h-2 overflow-hidden rounded-full bg-base-300" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress to ${next.name}`}>
              <div className="h-full rounded-full bg-secondary transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-sm">
              <strong className="font-normal">{formatPrice(next.remaining)}</strong> more to reach <strong className="font-normal">{next.name}</strong> and{' '}
              {next.percent}% off.
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm">You've reached our highest level. Thank you for being with us.</p>
        )}

        <ul className="mt-8 divide-y divide-base-300 border-y border-base-300">
          {tiers.map((t) => {
            const reached = spent >= t.min
            const current = tier?.name === t.name
            return (
              <li key={t.name} className={`flex items-center gap-3 py-3 text-sm ${current ? 'text-primary' : reached ? '' : 'opacity-60'}`}>
                <span className="grid size-5 place-items-center">{reached && <Check size={16} strokeWidth={1.5} />}</span>
                <span className="flex-1 font-display text-lg">{t.name}</span>
                <span className="opacity-80">from {formatPrice(t.min)}</span>
                <span className="w-16 text-right">{t.percent}%</span>
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-xs opacity-60">
          Only delivered orders count, and a level, once reached, stays. The discount comes off sale prices too.{' '}
          <Link to="/membership" className="underline underline-offset-4">
            About membership
          </Link>
        </p>
      </div>
    </div>
  )
}

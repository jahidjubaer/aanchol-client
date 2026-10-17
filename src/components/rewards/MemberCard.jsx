import { BRAND } from '../../config/brand.js'
import { LogoMark } from '../ui/Logo.jsx'

// Card colours by level, lowest first. Levels are named in the admin, so they're matched by position.
const FINISHES = [
  'bg-linear-135 from-[#d9d4cc] via-[#f3efe8] to-[#b9b2a7] text-ink', // silver
  'bg-linear-135 from-[#b8892d] via-[#e3c579] to-[#9a7022] text-ink', // gold
  'bg-linear-135 from-[#3d4651] via-[#6b7684] to-[#2c333b] text-ivory', // platinum
  'bg-linear-135 from-[#2b1d16] via-[#5a1520] to-[#2b1d16] text-ivory', // diamond
]
const finishFor = (index) => FINISHES[Math.min(index, FINISHES.length - 1)]

const groupDigits = (no) => no.replace(/(\d{4})(?=\d)/g, '$1 ')

// The digital membership card. Without a level it shows as a faded preview.
export default function MemberCard({ name, tier, tierIndex, memberNo, memberSince, className = '' }) {
  const finish = tier ? finishFor(tierIndex) : 'bg-base-200 text-base-content/50 border border-dashed border-base-300'
  return (
    <div className={`relative aspect-[1.586] w-full max-w-sm overflow-hidden rounded-xl p-5 text-left shadow-lg ${finish} ${className}`}>
      <LogoMark className="absolute -right-10 -top-10 size-48 opacity-15" flower="currentColor" />
      <div className="relative flex h-full flex-col justify-between">
        <span className="flex items-center gap-2">
          <LogoMark className="size-7 shrink-0" flower="currentColor" />
          <span className="font-display text-lg uppercase tracking-[0.25em]">{BRAND.name}</span>
        </span>
        <div>
          <p className="font-mono text-lg tracking-[0.15em]">{memberNo ? groupDigits(memberNo) : '•••• ••••'}</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <span className="min-w-0">
              <span className="block truncate font-display text-xl leading-tight">{name}</span>
              {memberSince && (
                <span className="block text-[10px] uppercase tracking-[0.2em] opacity-70">
                  Member since {new Date(memberSince).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-[10px] uppercase tracking-[0.25em] opacity-80">{tier ? tier.name : 'Member card'}</span>
              {tier && <span className="block font-display text-3xl leading-none">{tier.percent}%</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

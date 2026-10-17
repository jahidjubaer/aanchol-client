// Marks demo data (removed with npm run sample:remove on the server).
export default function SampleBadge({ className = '' }) {
  return (
    <span className={`inline-block border border-dashed border-info/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] whitespace-nowrap text-info ${className}`}>
      Sample
    </span>
  )
}

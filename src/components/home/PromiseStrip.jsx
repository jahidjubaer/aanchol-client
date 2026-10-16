const ITEMS = ['Handwoven in Tangail', 'Authentic Jamdani', 'Cash on Delivery', 'Free Delivery in Dhaka']

// Slow scrolling strip of brand promises. The list is doubled for a seamless loop.
export default function PromiseStrip() {
  return (
    <div className="overflow-hidden border-y border-base-300 bg-base-200 py-4" aria-label="Our promises">
      <ul className="flex w-max animate-[marquee_40s_linear_infinite] gap-12 pr-12 text-xs uppercase tracking-[0.3em] motion-reduce:animate-none">
        {[...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
          <li key={i} className="flex items-center gap-12 whitespace-nowrap" aria-hidden={i >= ITEMS.length}>
            {item}
            <span className="size-1.5 rotate-45 bg-gold" />
          </li>
        ))}
      </ul>
    </div>
  )
}

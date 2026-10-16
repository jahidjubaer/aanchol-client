import { BRAND } from '../../config/brand.js'

const YEAR = new Date().getFullYear()

// Placeholder footer; full design comes in the design task.
export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center md:px-8">
        <p className="font-display text-xl tracking-[0.15em] uppercase">{BRAND.name}</p>
        <p className="mt-2 text-sm opacity-70">
          © {YEAR} {BRAND.name}. Handwoven in Bangladesh.
        </p>
      </div>
    </footer>
  )
}

import { Minus, Plus } from 'lucide-react'

export default function QtyStepper({ value, max, onChange, label }) {
  return (
    <div className="inline-flex items-center border border-base-300" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
        className="grid size-9 place-items-center hover:bg-base-200"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid size-9 place-items-center hover:bg-base-200 disabled:opacity-30"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}

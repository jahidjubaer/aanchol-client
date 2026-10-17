import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'

// Labelled input for the shop's own forms (account pages). Passwords get a show/hide button.
export default function TextField({ label, error, hint, optional, type = 'text', className = '', ...props }) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs uppercase tracking-[0.15em]">
        {label} {optional && <span className="normal-case tracking-normal opacity-50">(optional)</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${id}-note` : undefined}
          className={`input w-full ${isPassword ? 'pr-12' : ''} ${error ? 'input-error' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center opacity-60 hover:opacity-100"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {(error || hint) && (
        <p id={`${id}-note`} className={`mt-1 text-xs ${error ? 'text-error' : 'opacity-60'}`}>
          {error || hint}
        </p>
      )}
    </div>
  )
}

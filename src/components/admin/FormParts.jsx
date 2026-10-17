import { Check } from 'lucide-react'

// Building blocks shared by every admin editor (products, slides, campaigns, categories).

export function Field({ label, hint, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs uppercase tracking-[0.15em]">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-error">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs opacity-50">{hint}</span>
      )}
    </label>
  )
}

export function Section({ title, children, aside }) {
  return (
    <section className="border border-base-300 bg-base-100 p-5 md:p-6">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h2 className="eyebrow">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block">{label}</span>
        {hint && <span className="block text-xs opacity-60">{hint}</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="toggle toggle-primary" />
    </label>
  )
}

// Always reachable with a thumb on phones.
export function SaveBar({ message, busy, disabled, label }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-2 border-t border-base-300 bg-base-100/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:mx-0 md:border-x">
      {message && (
        <p role={message.type === 'error' ? 'alert' : 'status'} className={`mb-2 text-sm ${message.type === 'error' ? 'text-error' : 'text-accent'}`}>
          {message.text}
        </p>
      )}
      <button type="submit" disabled={busy || disabled} className="btn btn-primary btn-block uppercase tracking-[0.2em]">
        {busy ? <span className="loading loading-spinner loading-sm" /> : <Check size={16} />}
        {label}
      </button>
    </div>
  )
}

export function UnsavedDialog({ blocker, what = 'this page' }) {
  if (blocker.state !== 'blocked') return null
  return (
    <div role="alertdialog" aria-label="Unsaved changes" className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-4 sm:place-items-center">
      <div className="w-full max-w-sm bg-base-100 p-6">
        <p className="font-display text-2xl">Leave without saving?</p>
        <p className="mt-2 text-sm opacity-70">Your changes to {what} will be lost.</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => blocker.proceed()} className="btn btn-outline">
            Leave
          </button>
          <button type="button" onClick={() => blocker.reset()} className="btn btn-primary">
            Keep editing
          </button>
        </div>
      </div>
    </div>
  )
}

// Two-step delete, so a stray tap never removes anything.
export function DeleteButton({ label, question, confirming, onAsk, onCancel, onConfirm }) {
  return (
    <div className="px-1 pt-2 text-sm">
      {confirming ? (
        <div className="flex flex-wrap items-center gap-3">
          <span>{question}</span>
          <button type="button" onClick={onConfirm} className="btn btn-error btn-outline btn-sm">
            Yes, delete
          </button>
          <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">
            Keep it
          </button>
        </div>
      ) : (
        <button type="button" onClick={onAsk} className="text-error underline underline-offset-4">
          {label}
        </button>
      )}
    </div>
  )
}

export function Loading() {
  return (
    <div className="grid place-items-center py-24">
      <span className="loading loading-spinner" />
    </div>
  )
}

export function LoadError({ error, onRetry }) {
  return (
    <div className="m-4 border border-error/40 bg-error/5 p-4 text-sm md:mx-8">
      {error.message}{' '}
      {onRetry && (
        <button type="button" onClick={onRetry} className="underline underline-offset-4">
          Try again
        </button>
      )}
    </div>
  )
}

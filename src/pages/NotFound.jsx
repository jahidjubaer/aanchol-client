import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl md:text-5xl">This page has unravelled</h1>
      <div className="gold-rule my-6" />
      <Link to="/" className="btn btn-primary px-8 uppercase tracking-[0.2em]">
        Return Home
      </Link>
    </section>
  )
}

import JamdaniDivider from './JamdaniDivider.jsx'
import Reveal from './Reveal.jsx'

export default function SectionHeading({ eyebrow, title, bangla, children, align = 'center' }) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <Reveal className={`flex flex-col ${alignment}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-4xl leading-tight md:text-5xl">{title}</h2>
      {bangla && <p className="mt-2 font-bangla text-lg text-primary">{bangla}</p>}
      <JamdaniDivider className="my-5" />
      {children && <p className="max-w-xl leading-relaxed opacity-80">{children}</p>}
    </Reveal>
  )
}

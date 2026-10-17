import SectionHeading from '../components/ui/SectionHeading.jsx'
import { photoCredits } from '../data/photoCredits.js'

export default function Credits() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <SectionHeading as="h1" eyebrow="Credits" title="Photo credits">
        Some photographs on this site are used under Creative Commons licences from Wikimedia Commons.
      </SectionHeading>

      <ul className="mt-12 divide-y divide-base-300 border-y border-base-300">
        {photoCredits.map((c) => (
          <li key={c.file} className="flex gap-4 py-4">
            <img src={`/images/placeholder/${c.file}`} alt="" loading="lazy" className="size-16 shrink-0 object-cover" />
            <div className="text-sm">
              <a href={c.source} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                {c.title}
              </a>
              <p className="opacity-70">
                by {c.author} ·{' '}
                <a
                  href={`https://creativecommons.org/licenses/by-sa/${c.license.split(' ').pop()}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {c.license}
                </a>
                , cropped
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

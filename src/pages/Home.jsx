import CraftStory from '../components/home/CraftStory.jsx'
import FeaturedEdit from '../components/home/FeaturedEdit.jsx'
import Hero from '../components/home/Hero.jsx'
import PromiseStrip from '../components/home/PromiseStrip.jsx'
import Promises from '../components/home/Promises.jsx'
import ShopByCategory from '../components/home/ShopByCategory.jsx'
import { useSite } from '../context/site.js'

// Sections after the hero. Order and visibility are set in Admin → Home.
const SECTIONS = {
  'promise-strip': PromiseStrip,
  featured: FeaturedEdit,
  categories: ShopByCategory,
  craft: CraftStory,
  promises: Promises,
}

export default function Home() {
  const { homeSections } = useSite()
  return (
    <>
      <Hero />
      {homeSections
        .filter((s) => s.visible && SECTIONS[s.id])
        .map(({ id }) => {
          const Section = SECTIONS[id]
          return <Section key={id} />
        })}
    </>
  )
}

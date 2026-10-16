import CraftStory from '../components/home/CraftStory.jsx'
import FeaturedEdit from '../components/home/FeaturedEdit.jsx'
import Hero from '../components/home/Hero.jsx'
import PromiseStrip from '../components/home/PromiseStrip.jsx'
import Promises from '../components/home/Promises.jsx'
import ShopByCategory from '../components/home/ShopByCategory.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <PromiseStrip />
      <FeaturedEdit />
      <CraftStory />
      <ShopByCategory />
      <Promises />
    </>
  )
}

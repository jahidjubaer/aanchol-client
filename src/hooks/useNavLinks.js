import { useSite } from '../context/site.js'
import { collectionPath } from '../utils/collections.js'

const STORY = { label: 'Our Story', bangla: 'আমাদের গল্প', to: '/our-story' }

// Categories marked "show in menu" in the admin, then Our Story.
export function useNavLinks() {
  const { categories } = useSite()
  const shop = categories
    .filter((c) => c.inNav)
    .map((c) => ({ label: shortName(c.name), bangla: c.nameBangla, to: collectionPath(c.slug) }))
  return [...shop, STORY]
}

// "Tangail Jamdani" → "Jamdani", "Handmade Jewellery" → "Jewellery": the menu has little room.
function shortName(name) {
  const words = name.split(' ')
  return words.length > 1 && /^(tangail|handmade|dhakai|sylheti)$/i.test(words[0]) ? words.slice(1).join(' ') : name
}

// Lines for the thin bar above the menu. A running campaign goes first.
export function useAnnouncements() {
  const { announcement, campaign } = useSite()
  return campaign ? [campaign.title, ...announcement] : announcement
}

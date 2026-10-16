import { motion } from 'motion/react'
import { EASE_LUXE } from '../../utils/motion.js'

// Slow fade-up when the element scrolls into view.
export default function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease: EASE_LUXE }}
    >
      {children}
    </Tag>
  )
}

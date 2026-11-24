import { useRef } from 'react'
import { useInView } from 'framer-motion'

export function useScrollReveal(options = { once: true, margin: '-40px' }) {
  const ref = useRef(null)
  const inView = useInView(ref, options)
  return { ref, inView }
}

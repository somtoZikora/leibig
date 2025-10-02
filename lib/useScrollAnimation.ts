import { useInView } from 'framer-motion'
import { useRef } from 'react'

export const useScrollAnimation = (threshold: number = 0.3) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold 
  })

  return { ref, isInView }
}

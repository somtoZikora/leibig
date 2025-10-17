"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants } from '@/lib/animations'

interface AnimatedLayoutProps {
  children: React.ReactNode
}

export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="main-content"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="min-h-screen"
        style={{ 
          // Ensure proper scrolling on mobile
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}

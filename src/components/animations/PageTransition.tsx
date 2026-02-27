'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

/**
 * PageTransition - Smooth page transitions with Framer Motion
 * Wraps page content with fade + slide animations
 *
 * Usage:
 * <PageTransition>
 *   {children}
 * </PageTransition>
 */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
}

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1], // Custom easing curve
  duration: 0.3,
}

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * FadeIn - Simple fade in animation for components
 * Use for card grids, content sections, etc.
 */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * SlideIn - Slide in from bottom animation
 * Use for modals, drawers, notifications
 */
export function SlideIn({
  children,
  direction = 'bottom',
  className,
}: {
  children: React.ReactNode
  direction?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}) {
  const directionOffset = {
    top: { y: -20 },
    bottom: { y: 20 },
    left: { x: -20 },
    right: { x: 20 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...directionOffset[direction] }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

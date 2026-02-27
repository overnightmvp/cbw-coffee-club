'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Home, Briefcase, PlusCircle, Search, BarChart3, Lock } from 'lucide-react'

/**
 * TabBar - Mobile bottom navigation
 * Auto-hides on scroll down, shows on scroll up (iOS Safari pattern)
 * Hidden on desktop (lg breakpoint and above)
 */

type Tab = {
  href: string
  label: string
  icon: typeof Home
  requiresAuth?: boolean
}

const tabs: Tab[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/app', label: 'Browse', icon: Search },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/jobs/create', label: 'Post', icon: PlusCircle },
  { href: '/dashboard', label: 'Analytics', icon: BarChart3, requiresAuth: true },
]

export function TabBar() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  // TODO: Replace with actual auth check
  const isAuthenticated = false

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          if (currentScrollY < 50) {
            // Always show near top
            setIsVisible(true)
          } else if (currentScrollY > lastScrollY.current + 10) {
            // Scrolling down significantly - hide
            setIsVisible(false)
          } else if (currentScrollY < lastScrollY.current - 10) {
            // Scrolling up significantly - show
            setIsVisible(true)
          }

          lastScrollY.current = currentScrollY
          ticking.current = false
        })

        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      animate={{ y: isVisible ? 0 : 120 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-4 left-4 right-4 z-50 lg:hidden"
    >
      <div className="mx-auto max-w-md rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-brown-200">
        <div className="flex items-center justify-around px-4 py-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            const Icon = tab.icon
            const isLocked = tab.requiresAuth && !isAuthenticated

            return (
              <Link
                key={tab.href}
                href={isLocked ? '#' : tab.href}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault()
                    // TODO: Open sign-up modal
                    console.log('Open sign-up modal')
                  }
                }}
                className="flex flex-col items-center gap-1 py-2 px-3 min-w-[56px] transition-all duration-150 active:scale-95"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-brown-600" />
                  ) : (
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-primary-600' : 'text-brown-600'
                      }`}
                    />
                  )}
                </motion.div>
                <span
                  className={`text-[10px] leading-tight ${
                    isActive ? 'font-bold text-brown-900' : 'font-medium text-brown-600'
                  }`}
                >
                  {isLocked ? 'Sign up' : tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-100 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}

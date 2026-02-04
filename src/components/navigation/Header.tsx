'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'

interface HeaderProps {
  variant?: 'landing' | 'app'
}

export function Header({ variant = 'landing' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
              <span className="text-[#F5C842] font-bold text-sm">C</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight" style={{ color: '#3B2A1A' }}>TBR</span>
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#A0785A' }}>The Bean Route</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {variant === 'landing' ? (
              <>
                <Link href="#vendors" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Vendors
                </Link>
                <Link href="/app" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Browse
                </Link>
                <Link href="/jobs" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Jobs
                </Link>
                <Link href="/contractors" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  For Events
                </Link>
                <Link href="/vendors-guide" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  For Vendors
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Home
                </Link>
                <Link href="/app" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Browse
                </Link>
                <Link href="/jobs" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Jobs
                </Link>
                <Link href="/contractors" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  For Events
                </Link>
                <Link href="/vendors-guide" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  For Vendors
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Link href="/app">
              <Button size="sm" className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
                Browse Vendors
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <div className="flex flex-col space-y-3">
              {variant === 'landing' ? (
                <>
                  <Link href="#vendors" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    Vendors
                  </Link>
                  <Link href="/app" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    Browse
                  </Link>
                  <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    Jobs
                  </Link>
                  <Link href="/contractors" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    For Events
                  </Link>
                  <Link href="/vendors-guide" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    For Vendors
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    Home
                  </Link>
                  <Link href="/app" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    Browse
                  </Link>
                  <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    Jobs
                  </Link>
                  <Link href="/contractors" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    For Events
                  </Link>
                  <Link href="/vendors-guide" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 hover:text-neutral-900 px-2 py-1 text-sm">
                    For Vendors
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
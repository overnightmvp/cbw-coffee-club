'use client'

import { useState } from 'react'
import { Header } from '@/components/navigation/Header'
import { AuthGate } from '@/components/admin/AuthGate'
import InquiriesTab from './InquiriesTab'
import ApplicationsTab from './ApplicationsTab'
import JobsTab from './JobsTab'

// Force dynamic rendering - prevent static generation at build time
// Admin page requires runtime env vars for Supabase client
export const dynamic = 'force-dynamic'

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'applications' | 'jobs'>('inquiries')
  const [message, setMessage] = useState('')

  const handleMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <AuthGate>
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
        <Header variant="app" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
                The Bean Route — Admin
              </h1>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex gap-2 mb-6">
            {(['inquiries', 'applications', 'jobs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-[#3B2A1A] text-white border-[#3B2A1A]'
                    : 'border-neutral-300 text-neutral-600 hover:bg-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-3 rounded-lg text-sm ${
              message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'inquiries' && <InquiriesTab onMessage={handleMessage} />}
          {activeTab === 'applications' && <ApplicationsTab onMessage={handleMessage} />}
          {activeTab === 'jobs' && <JobsTab onMessage={handleMessage} />}
        </div>
      </div>
    </AuthGate>
  )
}

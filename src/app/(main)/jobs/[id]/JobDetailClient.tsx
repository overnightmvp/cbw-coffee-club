'use client'

import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import type { Job, Quote } from '@/lib/supabase'

// Lazy load quote modal - only loads when needed
const QuoteModal = dynamic(() => import('@/components/jobs/QuoteModal'), {
  ssr: false,
})

export default function JobDetailClient({ id }: { id: string }) {
  const [job, setJob] = useState<Job | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [acceptingQuoteId, setAcceptingQuoteId] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')

  const fetchData = useCallback(async () => {
    const { supabase } = await import('@/lib/supabase')
    const { data: jobData } = await supabase.from('jobs').select('*').eq('id', id).single()
    if (!jobData) { setNotFound(true); setLoading(false); return }
    setJob(jobData)
    const { data: quoteData } = await supabase.from('quotes').select('*').eq('job_id', id).order('created_at', { ascending: false })
    setQuotes(quoteData || [])
    setLoading(false)
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAcceptQuote = async (quoteId: string, vendorName: string) => {
    setAcceptingQuoteId(quoteId)
    try {
      const response = await fetch(`/api/jobs/quotes/${quoteId}/accept`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to accept quote')
      }

      setMessage(`Quote from ${vendorName} accepted!`)
      setTimeout(() => setMessage(''), 3000)
      await fetchData()
    } catch (error) {
      console.error('Error accepting quote:', error)
      setMessage('Failed to accept quote. Please try again.')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setAcceptingQuoteId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
        <Header variant="app" />
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#F5C842] rounded-full animate-spin mx-auto" />
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
        <Header variant="app" />
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <h1 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Job not found</h1>
          <p className="text-neutral-500 text-sm">This job may have been removed or the link is incorrect.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success message */}
        {message && (
          <div className={`mb-6 p-3 rounded-lg text-sm ${
            message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Job card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>{job.event_type}</span>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
              {job.status === 'open' ? 'Open' : 'Closed'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1A1A1A' }}>{job.event_title}</h1>

          <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-neutral-200">
            <div><p className="text-xs text-neutral-500">Date</p><p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{job.event_date}</p></div>
            <div><p className="text-xs text-neutral-500">Duration</p><p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{job.duration_hours} hours</p></div>
            <div><p className="text-xs text-neutral-500">Guests</p><p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{job.guest_count}</p></div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-neutral-500">Location</p>
              <p className="text-sm" style={{ color: '#1A1A1A' }}>{job.location}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Budget</p>
              <p className="text-sm font-semibold" style={{ color: '#3B2A1A' }}>
                {job.budget_min ? `$${job.budget_min}–$${job.budget_max}/hr` : `Up to $${job.budget_max}/hr`}
              </p>
            </div>
            {job.special_requirements && (
              <div>
                <p className="text-xs text-neutral-500">Special requirements</p>
                <p className="text-sm text-neutral-600">{job.special_requirements}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-neutral-500">Posted by</p>
              <p className="text-sm text-neutral-600">{job.contact_name} · {job.contact_email}</p>
            </div>
          </div>
        </div>

        {/* Quotes section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>Quotes ({quotes.length})</h2>
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="px-5 py-2 text-sm font-semibold rounded-lg text-[#1A1A1A] hover:opacity-90"
              style={{ backgroundColor: '#F5C842' }}
            >
              Submit a Quote
            </button>
          </div>

          {quotes.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
              <p className="text-neutral-500 text-sm">No quotes yet. Vendors will submit quotes here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map(quote => (
                <div
                  key={quote.id}
                  className={`bg-white rounded-xl border p-5 ${
                    quote.status === 'accepted' ? 'border-green-300 bg-green-50' :
                    quote.status === 'rejected' ? 'border-neutral-200 opacity-60' :
                    'border-neutral-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: '#1A1A1A' }}>{quote.vendor_name}</span>
                      {quote.status === 'accepted' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Accepted
                        </span>
                      )}
                      {quote.status === 'rejected' && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600">
                          Not selected
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#3B2A1A' }}>${quote.price_per_hour}/hr</span>
                  </div>
                  {quote.message && <p className="text-sm text-neutral-600 mb-2">{quote.message}</p>}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-neutral-400">{quote.contact_email} · {new Date(quote.created_at).toLocaleDateString('en-AU')}</p>
                    {quote.status === 'pending' && job.status === 'open' && (
                      <button
                        onClick={() => handleAcceptQuote(quote.id, quote.vendor_name)}
                        disabled={acceptingQuoteId !== null}
                        className="px-3 py-1 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                        style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}
                      >
                        {acceptingQuoteId === quote.id ? 'Accepting...' : 'Accept'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <QuoteModal
          jobId={id}
          job={job}
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          onSuccess={() => { setQuoteModalOpen(false); fetchData() }}
        />
      </div>
      <Footer />
    </div>
  )
}

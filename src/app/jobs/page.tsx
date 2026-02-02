'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import type { Job } from '@/lib/supabase'

const EVENT_TYPES = ['All types', 'Corporate event', 'Wedding', 'Festival', 'Birthday party', 'Conference', 'Private gathering']
const SUBURBS = ['All suburbs', 'CBD', 'Camberwell', 'Carlton', 'Collingwood', 'Fitzroy', 'Fitzroy North', 'Glen Iris', 'Hawthorn', 'Kew', 'Malvern', 'North Melbourne', 'Northcote', 'Parkville', 'Prahran', 'Richmond', 'South Yarra', 'St Kilda', 'Southbank', 'Brunswick', 'Windsor', 'Toorak', 'Docklands']
const BUDGETS = ['Any budget', '$100', '$200', '$300', '$500', '$1000']

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [quoteCounts, setQuoteCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('All types')
  const [filterSuburb, setFilterSuburb] = useState('All suburbs')
  const [filterBudget, setFilterBudget] = useState('Any budget')

  useEffect(() => {
    const fetchData = async () => {
      const { supabase } = await import('@/lib/supabase')
      const { data: jobData } = await supabase.from('jobs').select('*').eq('status', 'open').order('created_at', { ascending: false })
      setJobs(jobData || [])
      if (jobData?.length) {
        const { data: quoteData } = await supabase.from('quotes').select('job_id')
        const counts: Record<string, number> = {}
        quoteData?.forEach((q: { job_id: string }) => { counts[q.job_id] = (counts[q.job_id] || 0) + 1 })
        setQuoteCounts(counts)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = jobs.filter(job => {
    if (filterType !== 'All types' && job.event_type !== filterType) return false
    if (filterSuburb !== 'All suburbs' && !job.location.toLowerCase().includes(filterSuburb.toLowerCase())) return false
    if (filterBudget !== 'Any budget') {
      const max = Number(filterBudget.replace('$', ''))
      if (job.budget_max > max) return false
    }
    return true
  })

  const clearFilters = () => { setFilterType('All types'); setFilterSuburb('All suburbs'); setFilterBudget('Any budget') }
  const hasFilters = filterType !== 'All types' || filterSuburb !== 'All suburbs' || filterBudget !== 'Any budget'

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
        <Header variant="app" />
        <div className="max-w-6xl mx-auto px-4 py-32 text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#F5C842] rounded-full animate-spin mx-auto" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A1A1A' }}>Open jobs</h1>
            <p className="text-neutral-600 text-sm mt-1">Find a coffee cart for your event</p>
          </div>
          <Link href="/jobs/create" className="inline-block px-5 py-2 text-sm font-semibold rounded-lg text-[#1A1A1A] hover:opacity-90" style={{ backgroundColor: '#F5C842' }}>
            Post a job
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm bg-white">
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterSuburb} onChange={e => setFilterSuburb(e.target.value)} className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm bg-white">
            {SUBURBS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterBudget} onChange={e => setFilterBudget(e.target.value)} className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm bg-white">
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-neutral-500 hover:text-neutral-800 underline">Clear filters</button>
          )}
        </div>

        {/* Job Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-500 mb-4">{jobs.length === 0 ? 'No jobs posted yet' : 'No jobs match your filters'}</p>
            <Link href="/jobs/create" className="text-sm font-semibold" style={{ color: '#3B2A1A' }}>
              {jobs.length === 0 ? 'Post the first job →' : 'Clear filters'}
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(job => (
              <div key={job.id} className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>{job.event_type}</span>
                  <span className="text-xs text-neutral-400">{quoteCounts[job.id] || 0} quotes</span>
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#1A1A1A' }}>{job.event_title}</h3>
                <p className="text-xs text-neutral-500 mb-1">{job.event_date} · {job.duration_hours}hr · {job.guest_count} guests</p>
                <p className="text-xs text-neutral-500 mb-3">{job.location}</p>
                <p className="text-sm font-semibold mt-auto mb-4" style={{ color: '#3B2A1A' }}>
                  {job.budget_min ? `$${job.budget_min}–$${job.budget_max}` : `Up to $${job.budget_max}`}
                </p>
                <Link href={`/jobs/${job.id}`} className="block w-full text-center px-4 py-2 text-sm font-semibold rounded-lg text-[#1A1A1A] hover:opacity-90" style={{ backgroundColor: '#F5C842' }}>
                  View Job
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

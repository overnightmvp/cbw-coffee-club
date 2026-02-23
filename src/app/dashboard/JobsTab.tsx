'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'

type Job = {
  id: string
  event_title: string
  event_type: string
  event_date: string
  duration_hours: number
  guest_count: number
  location: string
  budget_min: number | null
  budget_max: number
  special_requirements: string | null
  contact_name: string
  contact_email: string
  contact_phone: string | null
  status: 'open' | 'closed'
  created_at: string
}

type Quote = {
  id: string
  job_id: string
  vendor_name: string
  price_per_hour: number
  message: string | null
  contact_email: string
  created_at: string
}

export default function JobsTab({ onMessage }: { onMessage: (msg: string) => void }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/dashboard/jobs')
      if (!response.ok) throw new Error('Failed to fetch jobs')
      const { jobs: jobData, quotes: quoteData } = await response.json()
      setJobs(jobData || [])
      setQuotes(quoteData || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      onMessage('Error loading jobs')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchJobs() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (jobId: string, status: Job['status']) => {
    try {
      const response = await fetch(`/api/dashboard/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!response.ok) throw new Error('Failed to update job')
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j))
      if (selectedJob?.id === jobId) setSelectedJob(prev => prev ? { ...prev, status } : null)
      onMessage(`Job marked as ${status}`)
    } catch (error) {
      console.error('Error updating job:', error)
      onMessage('Error updating status')
    }
  }

  const filtered = filterStatus === 'all' ? jobs : jobs.filter(j => j.status === filterStatus)
  const jobQuotes = (jobId: string) => quotes.filter(q => q.job_id === jobId)

  if (loading) return <div className="text-center py-16 text-neutral-500">Loading jobs...</div>

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Jobs', value: jobs.length, color: '#1A1A1A' },
          { label: 'Open', value: jobs.filter(j => j.status === 'open').length, color: '#16A34A' },
          { label: 'Closed', value: jobs.filter(j => j.status === 'closed').length, color: '#6B7280' },
          { label: 'Total Quotes', value: quotes.length, color: '#2563EB' },
        ].map(m => (
          <div key={m.label} className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</div>
            <div className="text-sm text-neutral-600">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'open', 'closed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
              filterStatus === status
                ? 'border-[#3B2A1A] bg-[#3B2A1A] text-white'
                : 'border-neutral-300 text-neutral-600 hover:bg-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
          <p className="text-neutral-500">
            {jobs.length === 0 ? 'No jobs posted yet.' : 'No jobs match this filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead style={{ backgroundColor: '#FAFAF8' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Event Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Quotes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{formatDate(job.created_at)}</td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1A1A1A' }}>{job.event_title}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{job.event_type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{job.event_date}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{job.location}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                      {job.budget_min ? `$${job.budget_min}–$${job.budget_max}` : `Up to $${job.budget_max}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{jobQuotes(job.id).length}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-3">
                      <button onClick={() => setSelectedJob(job)} className="text-neutral-600 hover:underline font-medium">View</button>
                      {job.status === 'open' && (
                        <button onClick={() => updateStatus(job.id, 'closed')} className="text-red-600 hover:underline font-medium">Close</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>Job Details</h3>
                <button onClick={() => setSelectedJob(null)} className="text-neutral-400 hover:text-neutral-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>{selectedJob.event_type}</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${selectedJob.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>{selectedJob.status}</span>
                </div>
                <h4 className="text-base font-bold" style={{ color: '#1A1A1A' }}>{selectedJob.event_title}</h4>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Event Details</div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div><div className="text-neutral-500 text-xs">Date</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedJob.event_date}</div></div>
                  <div><div className="text-neutral-500 text-xs">Duration</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedJob.duration_hours}hr</div></div>
                  <div><div className="text-neutral-500 text-xs">Guests</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedJob.guest_count}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                  <div><div className="text-neutral-500 text-xs">Location</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedJob.location}</div></div>
                  <div><div className="text-neutral-500 text-xs">Budget</div><div className="font-medium" style={{ color: '#3B2A1A' }}>{selectedJob.budget_min ? `$${selectedJob.budget_min}–$${selectedJob.budget_max}/hr` : `Up to $${selectedJob.budget_max}/hr`}</div></div>
                </div>
                {selectedJob.special_requirements && (
                  <div className="mt-3"><div className="text-neutral-500 text-xs mb-1">Special requirements</div><div className="text-sm text-neutral-600">{selectedJob.special_requirements}</div></div>
                )}
                <div className="mt-3"><div className="text-neutral-500 text-xs">Posted by</div><div className="text-sm" style={{ color: '#1A1A1A' }}>{selectedJob.contact_name} · {selectedJob.contact_email}</div></div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Quotes ({jobQuotes(selectedJob.id).length})</div>
                {jobQuotes(selectedJob.id).length === 0 ? (
                  <div className="text-sm text-neutral-500 rounded-lg p-3" style={{ backgroundColor: '#FAFAF8' }}>No quotes yet.</div>
                ) : (
                  <div className="space-y-2">
                    {jobQuotes(selectedJob.id).map(q => (
                      <div key={q.id} className="rounded-lg p-3" style={{ backgroundColor: '#FAFAF8' }}>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{q.vendor_name}</span>
                          <span className="text-sm font-bold" style={{ color: '#3B2A1A' }}>${q.price_per_hour}/hr</span>
                        </div>
                        {q.message && <p className="text-xs text-neutral-600 mt-1">{q.message}</p>}
                        <p className="text-xs text-neutral-400 mt-1">{q.contact_email} · {formatDate(q.created_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Status</div>
                <div className="flex gap-2">
                  {(['open', 'closed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedJob.id, status)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                        selectedJob.status === status
                          ? (status === 'open' ? 'bg-green-100 text-green-800 border-current' : 'bg-neutral-100 text-neutral-600 border-current')
                          : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs text-neutral-500">Posted: {formatDate(selectedJob.created_at)}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

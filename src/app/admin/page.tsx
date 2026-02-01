'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Header } from '@/components/navigation/Header'

type Inquiry = {
  id: string
  vendor_id: string
  event_type: string | null
  event_date: string | null
  event_duration_hours: number | null
  guest_count: number | null
  location: string | null
  contact_name: string
  contact_email: string
  contact_phone: string | null
  special_requests: string | null
  estimated_cost: number | null
  status: 'pending' | 'contacted' | 'converted'
  created_at: string
}

type Application = {
  id: string
  business_name: string
  specialty: string
  description: string
  suburbs: string[]
  price_min: number
  price_max: number
  capacity_min: number
  capacity_max: number
  event_types: string[]
  contact_name: string
  contact_email: string
  contact_phone: string | null
  website: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

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

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'applications' | 'jobs'>('inquiries')
  const [message, setMessage] = useState('')

  // Inquiries
  const [leads, setLeads] = useState<Inquiry[]>([])
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null)
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [filterLeadStatus, setFilterLeadStatus] = useState('all')

  // Applications
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [loadingApps, setLoadingApps] = useState(false)
  const [filterAppStatus, setFilterAppStatus] = useState('all')

  // Jobs
  const [jobs, setJobs] = useState<Job[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [filterJobStatus, setFilterJobStatus] = useState('all')

  const fetchLeads = async () => {
    setLoadingLeads(true)
    try {
      const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
      setMessage('Error loading inquiries')
    } finally { setLoadingLeads(false) }
  }

  const fetchApplications = async () => {
    setLoadingApps(true)
    try {
      const { data } = await supabase.from('vendor_applications').select('*').order('created_at', { ascending: false })
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      setMessage('Error loading applications')
    } finally { setLoadingApps(false) }
  }

  const fetchJobs = async () => {
    setLoadingJobs(true)
    try {
      const { data: jobData } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
      setJobs(jobData || [])
      const { data: quoteData } = await supabase.from('quotes').select('*').order('created_at', { ascending: false })
      setQuotes(quoteData || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setMessage('Error loading jobs')
    } finally { setLoadingJobs(false) }
  }

  useEffect(() => {
    if (activeTab === 'inquiries') fetchLeads()
    else if (activeTab === 'applications') fetchApplications()
    else if (activeTab === 'jobs') fetchJobs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const updateLeadStatus = async (leadId: string, status: Inquiry['status']) => {
    try {
      await supabase.from('inquiries').update({ status }).eq('id', leadId)
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
      if (selectedLead?.id === leadId) setSelectedLead(prev => prev ? { ...prev, status } : null)
      setMessage(`Inquiry marked as ${status}`)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating lead:', error)
      setMessage('Error updating status')
    }
  }

  const updateAppStatus = async (appId: string, status: Application['status']) => {
    try {
      await supabase.from('vendor_applications').update({ status }).eq('id', appId)
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
      if (selectedApp?.id === appId) setSelectedApp(prev => prev ? { ...prev, status } : null)
      setMessage(`Application ${status}`)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating application:', error)
      setMessage('Error updating status')
    }
  }

  const updateJobStatus = async (jobId: string, status: Job['status']) => {
    try {
      await supabase.from('jobs').update({ status }).eq('id', jobId)
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j))
      if (selectedJob?.id === jobId) setSelectedJob(prev => prev ? { ...prev, status } : null)
      setMessage(`Job marked as ${status}`)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating job:', error)
      setMessage('Error updating status')
    }
  }

  const getLeadStatusColor = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      case 'converted': return 'bg-green-100 text-green-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getAppStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const filteredLeads = filterLeadStatus === 'all' ? leads : leads.filter(l => l.status === filterLeadStatus)
  const filteredApps = filterAppStatus === 'all' ? applications : applications.filter(a => a.status === filterAppStatus)
  const filteredJobs = filterJobStatus === 'all' ? jobs : jobs.filter(j => j.status === filterJobStatus)
  const jobQuotes = (jobId: string) => quotes.filter(q => q.job_id === jobId)

  return (
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
          <button
            onClick={() => {
              if (activeTab === 'inquiries') fetchLeads()
              else if (activeTab === 'applications') fetchApplications()
              else fetchJobs()
            }}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 hover:bg-white"
          >
            Refresh
          </button>
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

        {/* ===== INQUIRIES TAB ===== */}
        {activeTab === 'inquiries' && (
          loadingLeads ? (
            <div className="text-center py-16 text-neutral-500">Loading inquiries...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total', value: leads.length, color: '#1A1A1A' },
                  { label: 'Pending', value: leads.filter(l => l.status === 'pending').length, color: '#D97706' },
                  { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: '#2563EB' },
                  { label: 'Converted', value: leads.filter(l => l.status === 'converted').length, color: '#16A34A' },
                ].map(m => (
                  <div key={m.label} className="bg-white p-4 rounded-lg border border-neutral-200">
                    <div className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-sm text-neutral-600">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                {['all', 'pending', 'contacted', 'converted'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterLeadStatus(status)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                      filterLeadStatus === status
                        ? 'border-[#3B2A1A] bg-[#3B2A1A] text-white'
                        : 'border-neutral-300 text-neutral-600 hover:bg-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {filteredLeads.length === 0 ? (
                <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
                  <p className="text-neutral-500">
                    {leads.length === 0 ? 'No inquiries yet.' : 'No leads match this filter.'}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead style={{ backgroundColor: '#FAFAF8' }}>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Vendor</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Event</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Est. Value</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-200">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-neutral-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{formatDate(lead.created_at)}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="font-medium" style={{ color: '#1A1A1A' }}>{lead.contact_name}</div>
                              <div className="text-neutral-500 text-xs">{lead.contact_email}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-neutral-600">{lead.vendor_id}</td>
                            <td className="px-4 py-3 text-sm text-neutral-600">
                              <div>{lead.event_type || '—'}</div>
                              <div className="text-xs text-neutral-500">{lead.event_date || '—'} • {lead.guest_count || '—'} guests</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                              {lead.estimated_cost ? `$${lead.estimated_cost.toLocaleString('en-AU')}` : '—'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLeadStatusColor(lead.status)}`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm space-x-3">
                              <button onClick={() => setSelectedLead(lead)} className="text-neutral-600 hover:underline font-medium">View</button>
                              {lead.status === 'pending' && (
                                <button onClick={() => updateLeadStatus(lead.id, 'contacted')} className="text-green-600 hover:underline font-medium">Contacted</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )
        )}

        {/* ===== APPLICATIONS TAB ===== */}
        {activeTab === 'applications' && (
          loadingApps ? (
            <div className="text-center py-16 text-neutral-500">Loading applications...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total', value: applications.length, color: '#1A1A1A' },
                  { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: '#D97706' },
                  { label: 'Approved', value: applications.filter(a => a.status === 'approved').length, color: '#16A34A' },
                  { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#DC2626' },
                ].map(m => (
                  <div key={m.label} className="bg-white p-4 rounded-lg border border-neutral-200">
                    <div className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-sm text-neutral-600">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                {['all', 'pending', 'approved', 'rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterAppStatus(status)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                      filterAppStatus === status
                        ? 'border-[#3B2A1A] bg-[#3B2A1A] text-white'
                        : 'border-neutral-300 text-neutral-600 hover:bg-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {filteredApps.length === 0 ? (
                <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
                  <p className="text-neutral-500">
                    {applications.length === 0 ? 'No applications yet.' : 'No applications match this filter.'}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead style={{ backgroundColor: '#FAFAF8' }}>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Business</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Specialty</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Suburbs</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Contact</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-200">
                        {filteredApps.map((app) => (
                          <tr key={app.id} className="hover:bg-neutral-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">{formatDate(app.created_at)}</td>
                            <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1A1A1A' }}>{app.business_name}</td>
                            <td className="px-4 py-3 text-sm text-neutral-600">{app.specialty}</td>
                            <td className="px-4 py-3 text-sm text-neutral-600">{app.suburbs.slice(0, 3).join(', ')}{app.suburbs.length > 3 ? ` +${app.suburbs.length - 3}` : ''}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="font-medium" style={{ color: '#1A1A1A' }}>{app.contact_name}</div>
                              <div className="text-neutral-500 text-xs">{app.contact_email}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAppStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm space-x-3">
                              <button onClick={() => setSelectedApp(app)} className="text-neutral-600 hover:underline font-medium">View</button>
                              {app.status === 'pending' && (
                                <>
                                  <button onClick={() => updateAppStatus(app.id, 'approved')} className="text-green-600 hover:underline font-medium">Approve</button>
                                  <button onClick={() => updateAppStatus(app.id, 'rejected')} className="text-red-600 hover:underline font-medium">Reject</button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )
        )}

        {/* ===== JOBS TAB ===== */}
        {activeTab === 'jobs' && (
          loadingJobs ? (
            <div className="text-center py-16 text-neutral-500">Loading jobs...</div>
          ) : (
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
                    onClick={() => setFilterJobStatus(status)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                      filterJobStatus === status
                        ? 'border-[#3B2A1A] bg-[#3B2A1A] text-white'
                        : 'border-neutral-300 text-neutral-600 hover:bg-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {filteredJobs.length === 0 ? (
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
                        {filteredJobs.map((job) => (
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
                                <button onClick={() => updateJobStatus(job.id, 'closed')} className="text-red-600 hover:underline font-medium">Close</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>

      {/* ===== INQUIRY DETAIL MODAL ===== */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>Inquiry Details</h3>
                <button onClick={() => setSelectedLead(null)} className="text-neutral-400 hover:text-neutral-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Contact</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-neutral-500 text-xs">Name</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.contact_name}</div></div>
                  <div><div className="text-neutral-500 text-xs">Email</div><a href={`mailto:${selectedLead.contact_email}`} className="text-blue-600 hover:underline text-sm">{selectedLead.contact_email}</a></div>
                  {selectedLead.contact_phone && (
                    <div className="col-span-2"><div className="text-neutral-500 text-xs">Phone</div><a href={`tel:${selectedLead.contact_phone}`} className="text-blue-600 hover:underline text-sm">{selectedLead.contact_phone}</a></div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Event</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-neutral-500 text-xs">Vendor</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.vendor_id}</div></div>
                  <div><div className="text-neutral-500 text-xs">Type</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.event_type || '—'}</div></div>
                  <div><div className="text-neutral-500 text-xs">Date</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.event_date || '—'}</div></div>
                  <div><div className="text-neutral-500 text-xs">Duration</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.event_duration_hours ? `${selectedLead.event_duration_hours}hr` : '—'}</div></div>
                  <div><div className="text-neutral-500 text-xs">Guests</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.guest_count || '—'}</div></div>
                  <div><div className="text-neutral-500 text-xs">Location</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.location || '—'}</div></div>
                </div>
              </div>
              {selectedLead.estimated_cost && (
                <div className="rounded-lg p-3" style={{ backgroundColor: '#FAF5F0' }}>
                  <div className="text-xs text-neutral-500">Estimated cost</div>
                  <div className="text-xl font-bold" style={{ color: '#3B2A1A' }}>${selectedLead.estimated_cost.toLocaleString('en-AU')}</div>
                </div>
              )}
              {selectedLead.special_requests && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Special Requests</div>
                  <div className="text-sm text-neutral-600 rounded-lg p-3" style={{ backgroundColor: '#FAFAF8' }}>{selectedLead.special_requests}</div>
                </div>
              )}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Status</div>
                <div className="flex gap-2">
                  {(['pending', 'contacted', 'converted'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateLeadStatus(selectedLead.id, status)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                        selectedLead.status === status
                          ? `${getLeadStatusColor(status)} border-current`
                          : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs text-neutral-500">Submitted: {formatDate(selectedLead.created_at)}</div>
            </div>
          </div>
        </div>
      )}

      {/* ===== APPLICATION DETAIL MODAL ===== */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>Application Details</h3>
                <button onClick={() => setSelectedApp(null)} className="text-neutral-400 hover:text-neutral-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Business</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-neutral-500 text-xs">Name</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedApp.business_name}</div></div>
                  <div><div className="text-neutral-500 text-xs">Specialty</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedApp.specialty}</div></div>
                </div>
                <div className="mt-3">
                  <div className="text-neutral-500 text-xs mb-1">Description</div>
                  <div className="text-sm text-neutral-600">{selectedApp.description}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Offering</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-neutral-500 text-xs">Suburbs</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedApp.suburbs.join(', ')}</div></div>
                  <div><div className="text-neutral-500 text-xs">Pricing</div><div className="font-medium" style={{ color: '#1A1A1A' }}>${selectedApp.price_min}–${selectedApp.price_max}/hr</div></div>
                  <div><div className="text-neutral-500 text-xs">Capacity</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedApp.capacity_min}–{selectedApp.capacity_max} guests</div></div>
                  <div><div className="text-neutral-500 text-xs">Event Types</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedApp.event_types.join(', ')}</div></div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Contact</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-neutral-500 text-xs">Name</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedApp.contact_name}</div></div>
                  <div><div className="text-neutral-500 text-xs">Email</div><a href={`mailto:${selectedApp.contact_email}`} className="text-blue-600 hover:underline text-sm">{selectedApp.contact_email}</a></div>
                  {selectedApp.contact_phone && (<div><div className="text-neutral-500 text-xs">Phone</div><div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedApp.contact_phone}</div></div>)}
                  {selectedApp.website && (<div><div className="text-neutral-500 text-xs">Website</div><a href={selectedApp.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">{selectedApp.website}</a></div>)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Status</div>
                <div className="flex gap-2">
                  {(['pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateAppStatus(selectedApp.id, status)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                        selectedApp.status === status
                          ? `${getAppStatusColor(status)} border-current`
                          : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs text-neutral-500">Submitted: {formatDate(selectedApp.created_at)}</div>
            </div>
          </div>
        </div>
      )}

      {/* ===== JOB DETAIL MODAL ===== */}
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
                      onClick={() => updateJobStatus(selectedJob.id, status)}
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
    </div>
  )
}

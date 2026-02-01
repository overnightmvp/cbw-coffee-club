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

export default function AdminPortal() {
  const [leads, setLeads] = useState<Inquiry[]>([])
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null)
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [message, setMessage] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const fetchLeads = async () => {
    setLoadingLeads(true)
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
      setMessage('Error loading leads')
    } finally {
      setLoadingLeads(false)
    }
  }

  const updateLeadStatus = async (leadId: string, status: Inquiry['status']) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', leadId)

      if (error) throw error

      setLeads(prev => prev.map(lead =>
        lead.id === leadId ? { ...lead, status } : lead
      ))
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status } : null)
      }
      setMessage(`Lead marked as ${status}`)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating lead:', error)
      setMessage('Error updating lead status')
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const getStatusColor = (status: Inquiry['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      case 'converted': return 'bg-green-100 text-green-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const filteredLeads = filterStatus === 'all'
    ? leads
    : leads.filter(l => l.status === filterStatus)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
              CBW Admin — Inquiries
            </h1>
            <p className="text-neutral-600 text-sm mt-1">Manage vendor inquiries and track conversions</p>
          </div>
          <button
            onClick={fetchLeads}
            disabled={loadingLeads}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 hover:bg-white disabled:opacity-50 transition-colors"
          >
            {loadingLeads ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-3 rounded-lg text-sm ${
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {loadingLeads ? (
          <div className="text-center py-16 text-neutral-500">Loading inquiries...</div>
        ) : (
          <>
            {/* Metrics */}
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

            {/* Filter */}
            <div className="flex gap-2 mb-4">
              {['all', 'pending', 'contacted', 'converted'].map(status => (
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

            {filteredLeads.length === 0 ? (
              <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
                <p className="text-neutral-500">
                  {leads.length === 0
                    ? 'No inquiries yet. They\'ll appear here when contractors submit the form.'
                    : 'No leads match this filter.'}
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
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-600">
                            {formatDate(lead.created_at)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="font-medium" style={{ color: '#1A1A1A' }}>{lead.contact_name}</div>
                            <div className="text-neutral-500 text-xs">{lead.contact_email}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-600">
                            {lead.vendor_id}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-600">
                            <div>{lead.event_type || '—'}</div>
                            <div className="text-xs text-neutral-500">{lead.event_date || '—'} • {lead.guest_count || '—'} guests</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                            {lead.estimated_cost ? `$${lead.estimated_cost.toLocaleString('en-AU')}` : '—'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm space-x-3">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="text-neutral-600 hover:underline font-medium"
                            >
                              View
                            </button>
                            {lead.status === 'pending' && (
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'contacted')}
                                className="text-green-600 hover:underline font-medium"
                              >
                                Contacted
                              </button>
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
        )}
      </div>

      {/* Lead Details Modal */}
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
              {/* Contact */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Contact</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-neutral-500 text-xs">Name</div>
                    <div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.contact_name}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs">Email</div>
                    <a href={`mailto:${selectedLead.contact_email}`} className="text-blue-600 hover:underline text-sm">
                      {selectedLead.contact_email}
                    </a>
                  </div>
                  {selectedLead.contact_phone && (
                    <div className="col-span-2">
                      <div className="text-neutral-500 text-xs">Phone</div>
                      <a href={`tel:${selectedLead.contact_phone}`} className="text-blue-600 hover:underline text-sm">
                        {selectedLead.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Event */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Event</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-neutral-500 text-xs">Vendor</div>
                    <div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.vendor_id}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs">Type</div>
                    <div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.event_type || '—'}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs">Date</div>
                    <div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.event_date || '—'}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs">Duration</div>
                    <div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.event_duration_hours ? `${selectedLead.event_duration_hours}hr` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs">Guests</div>
                    <div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.guest_count || '—'}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500 text-xs">Location</div>
                    <div className="font-medium" style={{ color: '#1A1A1A' }}>{selectedLead.location || '—'}</div>
                  </div>
                </div>
              </div>

              {/* Estimated Cost */}
              {selectedLead.estimated_cost && (
                <div className="rounded-lg p-3" style={{ backgroundColor: '#FAF5F0' }}>
                  <div className="text-xs text-neutral-500">Estimated cost</div>
                  <div className="text-xl font-bold" style={{ color: '#3B2A1A' }}>
                    ${selectedLead.estimated_cost.toLocaleString('en-AU')}
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {selectedLead.special_requests && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Special Requests</div>
                  <div className="text-sm text-neutral-600 rounded-lg p-3" style={{ backgroundColor: '#FAFAF8' }}>
                    {selectedLead.special_requests}
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Status</div>
                <div className="flex gap-2">
                  {(['pending', 'contacted', 'converted'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateLeadStatus(selectedLead.id, status)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                        selectedLead.status === status
                          ? `${getStatusColor(status)} border-current`
                          : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-neutral-500">
                Submitted: {formatDate(selectedLead.created_at)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'

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

const getStatusColor = (status: Inquiry['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'contacted': return 'bg-blue-100 text-blue-800'
    case 'converted': return 'bg-green-100 text-green-800'
    default: return 'bg-neutral-100 text-neutral-800'
  }
}

export default function InquiriesTab({ onMessage }: { onMessage: (msg: string) => void }) {
  const [leads, setLeads] = useState<Inquiry[]>([])
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/inquiries')
      if (!response.ok) throw new Error('Failed to fetch inquiries')
      const { data } = await response.json()
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
      onMessage('Error loading inquiries')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchLeads() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (leadId: string, status: Inquiry['status']) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!response.ok) throw new Error('Failed to update inquiry')
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
      if (selectedLead?.id === leadId) setSelectedLead(prev => prev ? { ...prev, status } : null)
      onMessage(`Inquiry marked as ${status}`)
    } catch (error) {
      console.error('Error updating lead:', error)
      onMessage('Error updating status')
    }
  }

  const filtered = filterStatus === 'all' ? leads : leads.filter(l => l.status === filterStatus)

  if (loading) return <div className="text-center py-16 text-neutral-500">Loading inquiries...</div>

  return (
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
                {filtered.map((lead) => (
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
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-3">
                      <button onClick={() => setSelectedLead(lead)} className="text-neutral-600 hover:underline font-medium">View</button>
                      {lead.status === 'pending' && (
                        <button onClick={() => updateStatus(lead.id, 'contacted')} className="text-green-600 hover:underline font-medium">Contacted</button>
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
                      onClick={() => updateStatus(selectedLead.id, status)}
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
              <div className="text-xs text-neutral-500">Submitted: {formatDate(selectedLead.created_at)}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

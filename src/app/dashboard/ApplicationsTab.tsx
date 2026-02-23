'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'

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

const getStatusColor = (status: Application['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'approved': return 'bg-green-100 text-green-800'
    case 'rejected': return 'bg-red-100 text-red-800'
    default: return 'bg-neutral-100 text-neutral-800'
  }
}

export default function ApplicationsTab({ onMessage }: { onMessage: (msg: string) => void }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/dashboard/applications')
      if (!response.ok) throw new Error('Failed to fetch applications')
      const { data } = await response.json()
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      onMessage('Error loading applications')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchApplications() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (appId: string, status: Application['status']) => {
    try {
      const response = await fetch(`/api/dashboard/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!response.ok) throw new Error('Failed to update application')
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
      if (selectedApp?.id === appId) setSelectedApp(prev => prev ? { ...prev, status } : null)
      onMessage(`Application ${status}`)
    } catch (error) {
      console.error('Error updating application:', error)
      onMessage('Error updating status')
    }
  }

  const filtered = filterStatus === 'all' ? applications : applications.filter(a => a.status === filterStatus)

  if (loading) return <div className="text-center py-16 text-neutral-500">Loading applications...</div>

  return (
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
                {filtered.map((app) => (
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
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm space-x-3">
                      <button onClick={() => setSelectedApp(app)} className="text-neutral-600 hover:underline font-medium">View</button>
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(app.id, 'approved')} className="text-green-600 hover:underline font-medium">Approve</button>
                          <button onClick={() => updateStatus(app.id, 'rejected')} className="text-red-600 hover:underline font-medium">Reject</button>
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

      {/* Detail Modal */}
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
                      onClick={() => updateStatus(selectedApp.id, status)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors capitalize ${
                        selectedApp.status === status
                          ? `${getStatusColor(status)} border-current`
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
    </>
  )
}

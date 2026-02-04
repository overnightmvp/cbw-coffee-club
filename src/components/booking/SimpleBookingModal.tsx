'use client'

import React, { useState } from 'react'
import { Card, CardContent, Button } from '@/components/ui'
import { type LegacyVendor as Vendor, formatPriceRange } from '@/lib/supabase'

interface InquiryFormData {
  contactName: string
  contactEmail: string
  contactPhone: string
  eventType: string
  eventDate: string
  durationHours: number
  guestCount: number
  location: string
  specialRequests: string
}

interface InquiryModalProps {
  vendor: Vendor | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InquiryModal({ vendor, isOpen, onClose, onSuccess }: InquiryModalProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    eventType: '',
    eventDate: '',
    durationHours: 3,
    guestCount: 50,
    location: '',
    specialRequests: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen || !vendor) return null

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.contactName) {
      newErrors.contactName = 'Your name is required'
    }
    if (!formData.contactEmail) {
      newErrors.contactEmail = 'Email is required so the vendor can get back to you'
    } else if (!validateEmail(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }
    if (!formData.eventType) {
      newErrors.eventType = 'What kind of event is this?'
    }
    if (!formData.eventDate) {
      newErrors.eventDate = 'When is your event?'
    }
    if (!formData.location) {
      newErrors.location = 'Where is your event being held?'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const estimatedCost = Math.round(
    ((vendor.priceMin + vendor.priceMax) / 2) * formData.durationHours
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('inquiries')
        .insert({
          id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          vendor_id: vendor.id,
          event_type: formData.eventType,
          event_date: formData.eventDate,
          event_duration_hours: formData.durationHours,
          guest_count: formData.guestCount,
          location: formData.location,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone || null,
          special_requests: formData.specialRequests || null,
          estimated_cost: estimatedCost,
          status: 'pending',
        })

      if (error) {
        console.error('Inquiry submission error:', error)
        alert('Something went wrong. Please try again or contact us directly.')
        return
      }

      // Send email notification to vendor
      if (vendor.contactEmail) {
        try {
          await fetch('/api/notify/inquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vendorEmail: vendor.contactEmail,
              vendorName: vendor.businessName,
              planner: {
                name: formData.contactName,
                email: formData.contactEmail,
                phone: formData.contactPhone || 'Not provided'
              },
              event: {
                type: formData.eventType,
                date: formData.eventDate,
                duration: formData.durationHours,
                guests: formData.guestCount,
                location: formData.location,
                specialRequests: formData.specialRequests || 'None'
              },
              estimatedCost
            })
          })
        } catch (emailError) {
          // Don't block submission if email fails
          console.error('Failed to send email notification:', emailError)
        }
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof InquiryFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setFormData({
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      eventType: '',
      eventDate: '',
      durationHours: 3,
      guestCount: 50,
      location: '',
      specialRequests: '',
    })
    setErrors({})
    onClose()
  }

  // Success state
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5C842' }}>
              <svg className="w-8 h-8" fill="none" stroke="#1A1A1A" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Inquiry sent</h2>
            <p className="text-sm text-neutral-600 mb-1">
              <span className="font-semibold" style={{ color: '#3B2A1A' }}>{vendor.businessName}</span> will be in touch shortly.
            </p>
            <p className="text-xs text-neutral-500 mb-6">
              We've sent a confirmation to {formData.contactEmail}
            </p>
            <Button onClick={handleClose} fullWidth className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const eventTypes = ['Corporate event', 'Wedding', 'Festival', 'Birthday party', 'Conference', 'Private gathering']
  const guestOptions = [20, 30, 50, 75, 100, 150, 200, 300]
  const durationOptions = [1, 2, 3, 4, 5, 6, 8]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-[10000]">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 sm:p-6 rounded-t-lg z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#1A1A1A' }}>
                Get a quote from {vendor.businessName}
              </h2>
              <p className="text-sm text-neutral-600 mt-0.5">
                {vendor.specialty} • {formatPriceRange(vendor)}/hr
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-neutral-600 p-1 -m-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Your details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                    placeholder="Jane Smith"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] ${errors.contactName ? 'border-red-300' : 'border-neutral-300'}`}
                  />
                  {errors.contactName && <p className="text-red-600 text-xs mt-1">{errors.contactName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                    placeholder="jane@company.com"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] ${errors.contactEmail ? 'border-red-300' : 'border-neutral-300'}`}
                  />
                  {errors.contactEmail && <p className="text-red-600 text-xs mt-1">{errors.contactEmail}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData('contactPhone', e.target.value)}
                  placeholder="+61 4XX XXX XXX"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
                />
                <p className="text-xs text-neutral-500 mt-1">Optional — for faster response</p>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Event details</div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Event type *</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => updateFormData('eventType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] ${errors.eventType ? 'border-red-300' : 'border-neutral-300'}`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.eventType && <p className="text-red-600 text-xs mt-1">{errors.eventType}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Event date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => updateFormData('eventDate', e.target.value)}
                    min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] ${errors.eventDate ? 'border-red-300' : 'border-neutral-300'}`}
                  />
                  {errors.eventDate && <p className="text-red-600 text-xs mt-1">{errors.eventDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Duration (hours)</label>
                  <select
                    value={formData.durationHours}
                    onChange={(e) => updateFormData('durationHours', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
                  >
                    {durationOptions.map(h => (
                      <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Guests</label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => updateFormData('guestCount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
                  >
                    {guestOptions.map(n => (
                      <option key={n} value={n}>{n} guests</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="e.g. Fitzroy Gardens, VIC"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] ${errors.location ? 'border-red-300' : 'border-neutral-300'}`}
                  />
                  {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Estimated Cost */}
            <div className="rounded-lg p-4" style={{ backgroundColor: '#FAF5F0' }}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Estimated cost</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Based on avg rate • {formData.durationHours}hr • Final price confirmed by vendor
                  </div>
                </div>
                <div className="text-2xl font-bold" style={{ color: '#3B2A1A' }}>
                  ${estimatedCost.toLocaleString('en-AU')}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Special requests</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => updateFormData('specialRequests', e.target.value)}
                placeholder="Dietary requirements, specific setup needs, anything else..."
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842]"
              />
            </div>

            {/* Trust elements */}
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free to inquire
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No commitment
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Direct vendor contact
              </span>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isSubmitting}
              className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold min-h-[48px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Send Inquiry'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

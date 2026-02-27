'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type LegacyVendor as Vendor, formatPriceRange } from '@/lib/supabase'
import { CheckCircle2 } from 'lucide-react'

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

  if (!vendor) return null

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
      const id = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
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
          vendorEmail: vendor.contactEmail,
          vendorName: vendor.businessName
        })
      })

      if (!response.ok) {
        const errData = await response.json()
        console.error('Inquiry submission error:', errData)
        toast.error('Failed to send inquiry', {
          description: 'Please try again or contact us directly.',
        })
        return
      }

      setSubmitted(true)
      onSuccess() // Trigger confetti + toast in parent
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Failed to send inquiry', {
        description: 'Please check your connection and try again.',
      })
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

  const eventTypes = ['Corporate event', 'Wedding', 'Festival', 'Birthday party', 'Conference', 'Private gathering']
  const guestOptions = [20, 30, 50, 75, 100, 150, 200, 300]
  const durationOptions = [1, 2, 3, 4, 5, 6, 8]

  // Success state
  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-20 h-20 rounded-full bg-primary-400 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-brown-700" />
            </div>

            <DialogTitle className="text-2xl mb-3">Inquiry Sent Successfully</DialogTitle>
            <DialogDescription className="text-base mb-6">
              Your quote request has been sent to <strong>{vendor.businessName}</strong>.
            </DialogDescription>

            <div className="w-full bg-neutral-50 rounded-lg p-5 mb-6 text-left">
              <h3 className="text-sm font-semibold mb-3 text-brown-700">What Happens Next?</h3>
              <ul className="space-y-2.5 text-sm text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
                    1
                  </span>
                  <span>
                    <strong>{vendor.businessName}</strong> will review your event details
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
                    2
                  </span>
                  <span>
                    You'll receive a quote via email within <strong>24-48 hours</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
                    3
                  </span>
                  <span>
                    You can discuss details directly with the vendor
                  </span>
                </li>
              </ul>
            </div>

            <div className="w-full space-y-3">
              <p className="text-xs text-neutral-500 mb-3">
                A confirmation email has been sent to <strong>{formData.contactEmail}</strong>
              </p>

              <Button
                variant="primary"
                size="lg"
                onClick={handleClose}
                className="w-full h-12"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg max-h-[85vh] p-0">
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b z-10">
          <DialogTitle className="text-xl">Get a quote from {vendor.businessName}</DialogTitle>
          <DialogDescription className="text-sm mt-1">
            {vendor.specialty} • {formatPriceRange(vendor)}/hr
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Your details</div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="contactName" className="text-sm font-medium text-neutral-700">
                    Name *
                  </Label>
                  <Input
                    id="contactName"
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                    placeholder="Jane Smith"
                    className={`w-full mt-1 ${errors.contactName ? 'border-red-300' : ''}`}
                  />
                  {errors.contactName && <p className="text-red-600 text-sm mt-1">{errors.contactName}</p>}
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-sm font-medium text-neutral-700">
                    Email *
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                    placeholder="jane@company.com"
                    className={`w-full mt-1 ${errors.contactEmail ? 'border-red-300' : ''}`}
                  />
                  {errors.contactEmail && <p className="text-red-600 text-sm mt-1">{errors.contactEmail}</p>}
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-sm font-medium text-neutral-700">
                    Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData('contactPhone', e.target.value)}
                    placeholder="+61 4XX XXX XXX"
                    className="w-full mt-1"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Optional — for faster response</p>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Event details</div>
              <div>
                <Label htmlFor="eventType" className="text-sm font-medium text-neutral-700">
                  Event type *
                </Label>
                <Select value={formData.eventType} onValueChange={(val) => updateFormData('eventType', val)}>
                  <SelectTrigger id="eventType" className={`w-full mt-1 h-12 ${errors.eventType ? 'border-red-300' : ''}`}>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.eventType && <p className="text-red-600 text-sm mt-1">{errors.eventType}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="eventDate" className="text-sm font-medium text-neutral-700">
                    Event date *
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => updateFormData('eventDate', e.target.value)}
                    min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className={`w-full mt-1 ${errors.eventDate ? 'border-red-300' : ''}`}
                  />
                  {errors.eventDate && <p className="text-red-600 text-sm mt-1">{errors.eventDate}</p>}
                </div>
                <div>
                  <Label htmlFor="durationHours" className="text-sm font-medium text-neutral-700">
                    Duration (hours)
                  </Label>
                  <Select value={String(formData.durationHours)} onValueChange={(val) => updateFormData('durationHours', parseInt(val))}>
                    <SelectTrigger id="durationHours" className="w-full mt-1 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map(h => (
                        <SelectItem key={h} value={String(h)}>{h} hour{h > 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="guestCount" className="text-sm font-medium text-neutral-700">
                    Guests
                  </Label>
                  <Select value={String(formData.guestCount)} onValueChange={(val) => updateFormData('guestCount', parseInt(val))}>
                    <SelectTrigger id="guestCount" className="w-full mt-1 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {guestOptions.map(n => (
                        <SelectItem key={n} value={String(n)}>{n} guests</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-neutral-700">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="e.g. Fitzroy Gardens, VIC"
                    className={`w-full mt-1 ${errors.location ? 'border-red-300' : ''}`}
                  />
                  {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequests" className="text-sm font-medium text-neutral-700">
                  Special requests
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => updateFormData('specialRequests', e.target.value)}
                  placeholder="Dietary requirements, specific setup needs, anything else..."
                  rows={3}
                  className="w-full mt-1 min-h-[96px]"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <div className="space-y-4">
            {/* Estimated Cost */}
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wide text-brown-700">
                    Estimated Cost
                  </div>
                  <div className="text-xs text-neutral-600 mt-0.5">
                    Based on average rate • {formData.durationHours} hour{formData.durationHours > 1 ? 's' : ''}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">
                    Final price confirmed by vendor
                  </div>
                </div>
                <div className="text-3xl font-bold text-brown-700">
                  ${estimatedCost.toLocaleString('en-AU')}
                </div>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Free to inquire
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                No commitment
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Direct contact
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full h-12"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-brown-700 border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Send Inquiry'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

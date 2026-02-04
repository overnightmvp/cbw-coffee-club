'use client'

import React, { useState } from 'react'
import type { Job } from '@/lib/supabase'

interface QuoteModalProps {
  jobId: string
  job: Job | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function QuoteModal({ jobId, job, isOpen, onClose, onSuccess }: QuoteModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    vendorName: '',
    pricePerHour: '',
    message: '',
    contactEmail: '',
  })

  if (!isOpen) return null

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
  }

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}
    if (!formData.vendorName.trim()) errs.vendorName = 'Vendor name is required'
    if (!formData.pricePerHour) errs.pricePerHour = 'Price is required'
    else if (Number(formData.pricePerHour) <= 0) errs.pricePerHour = 'Price must be positive'
    if (!formData.contactEmail.trim()) errs.contactEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) errs.contactEmail = 'Enter a valid email'
    if (formData.message.length > 300) errs.message = 'Message must be under 300 characters'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setIsSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const id = `qte_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      const { error } = await supabase.from('quotes').insert({
        id,
        job_id: jobId,
        vendor_name: formData.vendorName.trim(),
        price_per_hour: Number(formData.pricePerHour),
        message: formData.message.trim() || null,
        contact_email: formData.contactEmail.trim(),
      })

      if (error) {
        console.error('Quote submission error:', error)
        setErrors({ submit: 'Something went wrong. Please try again.' })
        return
      }

      // Send email notifications to owner and vendor
      if (job) {
        try {
          await fetch('/api/notify/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ownerEmail: job.contact_email,
              ownerName: job.contact_name,
              jobTitle: job.event_title,
              vendor: {
                name: formData.vendorName.trim(),
                email: formData.contactEmail.trim()
              },
              quote: {
                pricePerHour: Number(formData.pricePerHour),
                message: formData.message.trim() || null
              },
              event: {
                type: job.event_type,
                date: job.event_date,
                duration: job.duration_hours,
                guests: job.guest_count,
                location: job.location
              }
            })
          })
        } catch (emailError) {
          // Don't block submission if email fails
          console.error('Failed to send email notification:', emailError)
        }
      }

      setSubmitted(true)
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (submitted) {
      onSuccess()
      setSubmitted(false)
      setFormData({ vendorName: '', pricePerHour: '', message: '', contactEmail: '' })
      setErrors({})
    }
    onClose()
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] outline-none ${errors[field] ? 'border-red-300' : 'border-neutral-300'}`

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#F5C842' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#1A1A1A' }}>Quote submitted</h2>
            <p className="text-sm text-neutral-600 mb-6">
              {formData.vendorName}&apos;s quote has been sent to the event owner.
            </p>
            <button onClick={handleClose} className="px-6 py-2 text-sm font-semibold rounded-lg text-[#1A1A1A] hover:opacity-90" style={{ backgroundColor: '#F5C842' }}>
              Done
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>Submit a Quote</h2>
              <button onClick={handleClose} className="text-neutral-400 hover:text-neutral-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Vendor name</label>
                <input type="text" placeholder="e.g. The Bean Cart" value={formData.vendorName} onChange={e => updateField('vendorName', e.target.value)} className={inputClass('vendorName')} />
                {errors.vendorName && <p className="text-red-500 text-xs mt-1">{errors.vendorName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Your price ($/hr)</label>
                <input type="number" placeholder="250" value={formData.pricePerHour} onChange={e => updateField('pricePerHour', e.target.value)} className={inputClass('pricePerHour')} />
                {errors.pricePerHour && <p className="text-red-500 text-xs mt-1">{errors.pricePerHour}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>
                  A message <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Tell the event owner about your cart, availability, and what's included…"
                  value={formData.message}
                  onChange={e => updateField('message', e.target.value)}
                  rows={3}
                  className={inputClass('message')}
                />
                <div className="flex justify-between mt-1">
                  {errors.message ? <p className="text-red-500 text-xs">{errors.message}</p> : <span />}
                  <span className="text-xs text-neutral-400">{formData.message.length}/300</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Your email</label>
                <input type="email" value={formData.contactEmail} onChange={e => updateField('contactEmail', e.target.value)} className={inputClass('contactEmail')} />
                {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
              </div>

              {errors.submit && <p className="text-red-500 text-xs">{errors.submit}</p>}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-6 py-2.5 text-sm font-semibold rounded-lg text-[#1A1A1A] hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#F5C842' }}
              >
                {isSubmitting ? 'Submitting…' : 'Submit Quote'}
              </button>
              <p className="text-xs text-neutral-400 text-center">Free to quote. The event owner will contact you directly.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

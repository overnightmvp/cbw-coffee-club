'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { StepIndicator } from '@/components/shared/StepIndicator'

interface JobFormData {
  eventTitle: string
  eventType: string
  eventDate: string
  durationHours: string
  guests: string
  location: string
  budgetMin: string
  budgetMax: string
  specialRequirements: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

const EVENT_TYPES = ['Corporate event', 'Wedding', 'Festival', 'Birthday party', 'Conference', 'Private gathering']
const DURATIONS = ['1', '2', '3', '4', '5', '6', '8']
const GUEST_OPTIONS = ['20', '30', '50', '75', '100', '150', '200', '300']

export default function CreateJob() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generatedId, setGeneratedId] = useState('')
  const [formData, setFormData] = useState<JobFormData>({
    eventTitle: '', eventType: '', eventDate: '',
    durationHours: '', guests: '', location: '',
    budgetMin: '', budgetMax: '', specialRequirements: '',
    contactName: '', contactEmail: '', contactPhone: '',
  })

  const minDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().split('T')[0]
  })()

  const updateField = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
  }

  const validateStep1 = (): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (!formData.eventTitle.trim()) errs.eventTitle = 'Event title is required'
    if (!formData.eventType) errs.eventType = 'Select an event type'
    if (!formData.eventDate) errs.eventDate = 'Select an event date'
    if (!formData.durationHours) errs.durationHours = 'Select a duration'
    if (!formData.guests) errs.guests = 'Select guest count'
    if (!formData.location.trim()) errs.location = 'Location is required'
    return errs
  }

  const validateStep2 = (): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (!formData.budgetMax) errs.budgetMax = 'Maximum budget is required'
    if (formData.budgetMin && formData.budgetMax && Number(formData.budgetMin) > Number(formData.budgetMax)) errs.budgetMax = 'Max budget must be greater than min'
    return errs
  }

  const validateStep3 = (): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (!formData.contactName.trim()) errs.contactName = 'Contact name is required'
    if (!formData.contactEmail.trim()) errs.contactEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) errs.contactEmail = 'Enter a valid email'
    return errs
  }

  const handleNext = () => {
    let errs: Record<string, string> = {}
    if (step === 1) errs = validateStep1()
    else if (step === 2) errs = validateStep2()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStep(prev => (prev + 1) as 1 | 2 | 3)
  }

  const handleBack = () => setStep(prev => (prev - 1) as 1 | 2 | 3)

  const handleSubmit = async () => {
    const errs = validateStep3()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setIsSubmitting(true)
    const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    setGeneratedId(id)
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('jobs').insert({
        id,
        event_title: formData.eventTitle.trim(),
        event_type: formData.eventType,
        event_date: formData.eventDate,
        duration_hours: Number(formData.durationHours),
        guest_count: Number(formData.guests),
        location: formData.location.trim(),
        budget_min: formData.budgetMin ? Number(formData.budgetMin) : null,
        budget_max: Number(formData.budgetMax),
        special_requirements: formData.specialRequirements.trim() || null,
        contact_name: formData.contactName.trim(),
        contact_email: formData.contactEmail.trim(),
        contact_phone: formData.contactPhone.trim() || null,
      })
      setSubmitted(true)
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
        <Header variant="app" />
        <div className="max-w-md mx-auto px-4 py-32 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F5C842' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#1A1A1A' }}>Your job is posted</h2>
          <p className="text-neutral-600 mb-8">
            Vendors can now submit quotes. We&apos;ll notify you at {formData.contactEmail} when quotes come in.
          </p>
          <Link href={`/jobs/${generatedId}`} className="inline-block text-sm font-semibold" style={{ color: '#3B2A1A' }}>
            View your job →
          </Link>
        </div>
      </div>
    )
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#F5C842] focus:border-[#F5C842] outline-none ${errors[field] ? 'border-red-300' : 'border-neutral-300'}`

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Post a job</h1>
          <p className="text-neutral-600 text-sm">Get quotes from Melbourne&apos;s best coffee carts.</p>
        </div>

        <StepIndicator currentStep={step} totalSteps={3} />

        {/* Step 1 — Your Event */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Event title</label>
              <input type="text" placeholder="e.g. Team breakfast at our Fitzroy office" value={formData.eventTitle} onChange={e => updateField('eventTitle', e.target.value)} className={inputClass('eventTitle')} />
              {errors.eventTitle && <p className="text-red-500 text-xs mt-1">{errors.eventTitle}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Event type</label>
                <select value={formData.eventType} onChange={e => updateField('eventType', e.target.value)} className={inputClass('eventType')}>
                  <option value="">Select type…</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.eventType && <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Event date</label>
                <input type="date" min={minDate} value={formData.eventDate} onChange={e => updateField('eventDate', e.target.value)} className={inputClass('eventDate')} />
                {errors.eventDate && <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Duration (hours)</label>
                <select value={formData.durationHours} onChange={e => updateField('durationHours', e.target.value)} className={inputClass('durationHours')}>
                  <option value="">Select…</option>
                  {DURATIONS.map(d => <option key={d} value={d}>{d} hour{Number(d) > 1 ? 's' : ''}</option>)}
                </select>
                {errors.durationHours && <p className="text-red-500 text-xs mt-1">{errors.durationHours}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Guest count</label>
                <select value={formData.guests} onChange={e => updateField('guests', e.target.value)} className={inputClass('guests')}>
                  <option value="">Select…</option>
                  {GUEST_OPTIONS.map(g => <option key={g} value={g}>{g} guests</option>)}
                </select>
                {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Location</label>
              <input type="text" placeholder="e.g. Fitzroy Gardens, VIC" value={formData.location} onChange={e => updateField('location', e.target.value)} className={inputClass('location')} />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          </div>
        )}

        {/* Step 2 — Budget & Preferences */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Budget min $/hr <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input type="number" placeholder="150" value={formData.budgetMin} onChange={e => updateField('budgetMin', e.target.value)} className={inputClass('budgetMin')} />
                {errors.budgetMin && <p className="text-red-500 text-xs mt-1">{errors.budgetMin}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Budget max $/hr</label>
                <input type="number" placeholder="350" value={formData.budgetMax} onChange={e => updateField('budgetMax', e.target.value)} className={inputClass('budgetMax')} />
                {errors.budgetMax && <p className="text-red-500 text-xs mt-1">{errors.budgetMax}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Special requirements <span className="text-neutral-400 font-normal">(optional)</span></label>
              <textarea
                placeholder="Dietary needs, power access, setup constraints…"
                value={formData.specialRequirements}
                onChange={e => updateField('specialRequirements', e.target.value)}
                rows={3}
                className={inputClass('specialRequirements')}
              />
            </div>
          </div>
        )}

        {/* Step 3 — Your Details + Review */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Your name</label>
                <input type="text" value={formData.contactName} onChange={e => updateField('contactName', e.target.value)} className={inputClass('contactName')} />
                {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Email</label>
                <input type="email" value={formData.contactEmail} onChange={e => updateField('contactEmail', e.target.value)} className={inputClass('contactEmail')} />
                {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Phone <span className="text-neutral-400 font-normal">(optional)</span></label>
              <input type="tel" value={formData.contactPhone} onChange={e => updateField('contactPhone', e.target.value)} className={inputClass('contactPhone')} />
            </div>

            {/* Review card */}
            <div className="rounded-xl p-5 mt-2" style={{ backgroundColor: '#FAF5F0' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: '#3B2A1A' }}>Review your job</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="font-semibold" style={{ color: '#1A1A1A' }}>{formData.eventTitle}</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>{formData.eventType}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div><span className="text-neutral-500">Date</span><p className="font-medium" style={{ color: '#1A1A1A' }}>{formData.eventDate}</p></div>
                  <div><span className="text-neutral-500">Duration</span><p className="font-medium" style={{ color: '#1A1A1A' }}>{formData.durationHours}hr</p></div>
                  <div><span className="text-neutral-500">Guests</span><p className="font-medium" style={{ color: '#1A1A1A' }}>{formData.guests}</p></div>
                </div>
                <div className="text-xs">
                  <span className="text-neutral-500">Location</span>
                  <p className="font-medium" style={{ color: '#1A1A1A' }}>{formData.location}</p>
                </div>
                <div className="text-xs">
                  <span className="text-neutral-500">Budget</span>
                  <p className="font-medium" style={{ color: '#1A1A1A' }}>
                    {formData.budgetMin ? `$${formData.budgetMin}–$${formData.budgetMax}/hr` : `Up to $${formData.budgetMax}/hr`}
                  </p>
                </div>
                {formData.specialRequirements && (
                  <div className="text-xs">
                    <span className="text-neutral-500">Special requirements</span>
                    <p className="text-neutral-600">{formData.specialRequirements}</p>
                  </div>
                )}
              </div>
            </div>

            {errors.submit && <p className="text-red-500 text-xs">{errors.submit}</p>}
          </div>
        )}

        {/* Navigation */}
        <div className={`flex gap-3 mt-8 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
          {step > 1 && (
            <button onClick={handleBack} className="px-5 py-2 text-sm font-medium border border-neutral-300 rounded-lg text-neutral-600 hover:bg-white">
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} className="px-6 py-2 text-sm font-semibold rounded-lg text-[#1A1A1A] hover:opacity-90" style={{ backgroundColor: '#F5C842' }}>
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-6 py-2.5 text-sm font-semibold rounded-lg text-[#1A1A1A] hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#F5C842' }}
            >
              {isSubmitting ? 'Posting…' : 'Post Job'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

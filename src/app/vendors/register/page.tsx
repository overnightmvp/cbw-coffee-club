'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { StepIndicator } from '@/components/shared/StepIndicator'

interface RegistrationFormData {
  businessName: string
  specialty: string
  description: string
  suburbs: string[]
  priceMin: string
  priceMax: string
  capacityMin: string
  capacityMax: string
  eventTypes: string[]
  contactName: string
  contactEmail: string
  contactPhone: string
  website: string
}

const SUBURBS = [
  'CBD', 'Camberwell', 'Carlton', 'Collingwood', 'Fitzroy', 'Fitzroy North',
  'Glen Iris', 'Hawthorn', 'Kew', 'Malvern', 'North Melbourne', 'Northcote',
  'Parkville', 'Prahran', 'Richmond', 'South Yarra', 'St Kilda', 'Southbank',
  'Brunswick', 'Windsor', 'Toorak', 'Docklands',
]

const EVENT_TYPES = [
  'Corporate event', 'Wedding', 'Festival', 'Birthday party', 'Conference', 'Private gathering',
]

export default function VendorRegister() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<RegistrationFormData>({
    businessName: '', specialty: '', description: '',
    suburbs: [], priceMin: '', priceMax: '',
    capacityMin: '', capacityMax: '',
    eventTypes: [],
    contactName: '', contactEmail: '', contactPhone: '', website: '',
  })

  const updateField = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
  }

  const toggleArrayField = (field: 'suburbs' | 'eventTypes', value: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[]
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
  }

  const validateStep1 = (): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (!formData.businessName.trim()) errs.businessName = 'Business name is required'
    if (!formData.specialty.trim()) errs.specialty = 'Specialty is required'
    if (!formData.description.trim()) errs.description = 'Description is required'
    else if (formData.description.trim().length < 30) errs.description = 'Description must be at least 30 characters'
    else if (formData.description.trim().length > 500) errs.description = 'Description must be under 500 characters'
    return errs
  }

  const validateStep2 = (): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (formData.suburbs.length === 0) errs.suburbs = 'Select at least one suburb'
    if (!formData.priceMin) errs.priceMin = 'Minimum price is required'
    else if (Number(formData.priceMin) < 50) errs.priceMin = 'Minimum price must be at least $50'
    if (!formData.priceMax) errs.priceMax = 'Maximum price is required'
    else if (formData.priceMin && Number(formData.priceMax) < Number(formData.priceMin)) errs.priceMax = 'Maximum must be greater than minimum'
    if (!formData.capacityMin) errs.capacityMin = 'Minimum capacity is required'
    else if (Number(formData.capacityMin) < 10) errs.capacityMin = 'Minimum must be at least 10'
    if (!formData.capacityMax) errs.capacityMax = 'Maximum capacity is required'
    else if (formData.capacityMin && Number(formData.capacityMax) < Number(formData.capacityMin)) errs.capacityMax = 'Maximum must be greater than minimum'
    if (formData.eventTypes.length === 0) errs.eventTypes = 'Select at least one event type'
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
    try {
      const { supabase } = await import('@/lib/supabase')
      const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      await supabase.from('vendor_applications').insert({
        id,
        business_name: formData.businessName.trim(),
        specialty: formData.specialty.trim(),
        description: formData.description.trim(),
        suburbs: formData.suburbs,
        price_min: Number(formData.priceMin),
        price_max: Number(formData.priceMax),
        capacity_min: Number(formData.capacityMin),
        capacity_max: Number(formData.capacityMax),
        event_types: formData.eventTypes,
        contact_name: formData.contactName.trim(),
        contact_email: formData.contactEmail.trim(),
        contact_phone: formData.contactPhone.trim() || null,
        website: formData.website.trim() || null,
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
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#1A1A1A' }}>Your application is in</h2>
          <p className="text-neutral-600 mb-8">
            We&apos;ll review your details and get back to {formData.contactEmail} within 24 hours.
          </p>
          <Link href="/app" className="inline-block text-sm font-semibold" style={{ color: '#3B2A1A' }}>
            Browse the marketplace →
          </Link>
        </div>
        <Footer />
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Register your coffee cart</h1>
          <p className="text-neutral-600 text-sm">Get listed on The Bean Route in a few minutes.</p>
        </div>

        <StepIndicator currentStep={step} totalSteps={3} />

        {/* Step 1 — Your Business */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Business name</label>
              <input
                type="text"
                placeholder="e.g. The Bean Cart"
                value={formData.businessName}
                onChange={e => updateField('businessName', e.target.value)}
                className={inputClass('businessName')}
              />
              {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Specialty</label>
              <input
                type="text"
                placeholder="e.g. Single Origin Espresso & Pour-Over"
                value={formData.specialty}
                onChange={e => updateField('specialty', e.target.value)}
                className={inputClass('specialty')}
              />
              {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Description</label>
              <textarea
                placeholder="Tell us about your coffee cart — what makes you special, your setup, your story…"
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                rows={4}
                className={inputClass('description')}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? <p className="text-red-500 text-xs">{errors.description}</p> : <span />}
                <span className={`text-xs ${formData.description.length < 30 ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {formData.description.length}/500
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — What You Offer */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Suburbs you serve</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {SUBURBS.map(suburb => (
                  <label key={suburb} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.suburbs.includes(suburb)}
                      onChange={() => toggleArrayField('suburbs', suburb)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: '#F5C842' }}
                    />
                    <span className="text-xs text-neutral-600">{suburb}</span>
                  </label>
                ))}
              </div>
              {errors.suburbs && <p className="text-red-500 text-xs mt-2">{errors.suburbs}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Price range ($/hr)</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="150"
                    value={formData.priceMin}
                    onChange={e => updateField('priceMin', e.target.value)}
                    className={inputClass('priceMin')}
                  />
                  {errors.priceMin && <p className="text-red-500 text-xs mt-1">{errors.priceMin}</p>}
                </div>
                <span className="text-neutral-400 text-sm">–</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="350"
                    value={formData.priceMax}
                    onChange={e => updateField('priceMax', e.target.value)}
                    className={inputClass('priceMax')}
                  />
                  {errors.priceMax && <p className="text-red-500 text-xs mt-1">{errors.priceMax}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Capacity (guests)</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="20"
                    value={formData.capacityMin}
                    onChange={e => updateField('capacityMin', e.target.value)}
                    className={inputClass('capacityMin')}
                  />
                  {errors.capacityMin && <p className="text-red-500 text-xs mt-1">{errors.capacityMin}</p>}
                </div>
                <span className="text-neutral-400 text-sm">–</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="150"
                    value={formData.capacityMax}
                    onChange={e => updateField('capacityMax', e.target.value)}
                    className={inputClass('capacityMax')}
                  />
                  {errors.capacityMax && <p className="text-red-500 text-xs mt-1">{errors.capacityMax}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Event types</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EVENT_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.eventTypes.includes(type)}
                      onChange={() => toggleArrayField('eventTypes', type)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: '#F5C842' }}
                    />
                    <span className="text-xs text-neutral-600">{type}</span>
                  </label>
                ))}
              </div>
              {errors.eventTypes && <p className="text-red-500 text-xs mt-2">{errors.eventTypes}</p>}
            </div>
          </div>
        )}

        {/* Step 3 — Contact + Review */}
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Phone <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input type="tel" value={formData.contactPhone} onChange={e => updateField('contactPhone', e.target.value)} className={inputClass('contactPhone')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Website <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input type="url" value={formData.website} onChange={e => updateField('website', e.target.value)} className={inputClass('website')} />
              </div>
            </div>

            {/* Review summary */}
            <div className="rounded-xl p-5 mt-2" style={{ backgroundColor: '#FAF5F0' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: '#3B2A1A' }}>Review your listing</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold" style={{ color: '#1A1A1A' }}>{formData.businessName}</span>
                  <span className="text-neutral-500 ml-2">— {formData.specialty}</span>
                </div>
                <p className="text-neutral-600">{formData.description}</p>
                <div>
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Suburbs</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {formData.suburbs.map(s => (
                      <span key={s} className="inline-block px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#F5C842', color: '#1A1A1A' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <span className="text-xs text-neutral-500">Pricing</span>
                    <p className="font-semibold" style={{ color: '#1A1A1A' }}>${formData.priceMin}–${formData.priceMax}/hr</p>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500">Capacity</span>
                    <p className="font-semibold" style={{ color: '#1A1A1A' }}>{formData.capacityMin}–{formData.capacityMax} guests</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Event types</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {formData.eventTypes.map(t => (
                      <span key={t} className="inline-block px-2 py-0.5 rounded-full text-xs border border-neutral-300 text-neutral-600">{t}</span>
                    ))}
                  </div>
                </div>
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
              {isSubmitting ? 'Submitting…' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

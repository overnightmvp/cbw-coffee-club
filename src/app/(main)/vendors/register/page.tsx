'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { StepIndicator } from '@/components/shared/StepIndicator'
import { VendorCard } from '@/components/vendors/VendorCard'
import { LocationAutocomplete } from '@/components/shared/LocationAutocomplete'
import confetti from 'canvas-confetti'

interface RegistrationFormData {
  vendorType: 'mobile_cart' | 'coffee_shop' | 'barista'
  businessName: string
  specialty: string
  description: string
  physical_address: string
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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<RegistrationFormData>({
    vendorType: 'mobile_cart',
    businessName: '', specialty: '', description: '',
    physical_address: '',
    suburbs: [], priceMin: '', priceMax: '',
    capacityMin: '', capacityMax: '',
    eventTypes: [],
    contactName: '', contactEmail: '', contactPhone: '', website: '',
  })

  const updateField = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be under 2MB' }))
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      if (errors.image) setErrors(prev => { const next = { ...prev }; delete next.image; return next })
    }
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

    if (formData.vendorType === 'coffee_shop' && !formData.physical_address.trim()) {
      errs.physical_address = 'Shop address is required'
    }
    return errs
  }

  const validateStep2 = (): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (formData.suburbs.length === 0) errs.suburbs = 'Select at least one suburb'
    if (!formData.priceMin) errs.priceMin = 'Minimum price is required'
    else if (Number(formData.priceMin) < 30) errs.priceMin = 'Price must be at least $30'
    if (!formData.priceMax) errs.priceMax = 'Maximum price is required'
    else if (formData.priceMin && Number(formData.priceMax) < Number(formData.priceMin)) errs.priceMax = 'Maximum must be greater than minimum'

    // Capacity only required for non-baristas
    if (formData.vendorType !== 'barista') {
      if (!formData.capacityMin) errs.capacityMin = 'Minimum capacity is required'
      else if (Number(formData.capacityMin) < 1) errs.capacityMin = 'Minimum must be at least 1'
      if (!formData.capacityMax) errs.capacityMax = 'Maximum capacity is required'
      else if (formData.capacityMin && Number(formData.capacityMax) < Number(formData.capacityMin)) errs.capacityMax = 'Maximum must be greater than minimum'
    }

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

  const uploadImage = async (appId: string): Promise<string | null> => {
    if (!imageFile) return null

    // Import supabase client dynamically to avoid any client-side issues
    const { supabase } = await import('@/lib/supabase-client')

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${appId}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('vendor-images')
      .upload(filePath, imageFile, { upsert: true })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('vendor-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async () => {
    const errs = validateStep3()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setIsSubmitting(true)
    try {
      const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(id)
      }

      const response = await fetch('/api/vendors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          vendor_type: formData.vendorType,
          business_name: formData.businessName.trim(),
          specialty: formData.specialty.trim(),
          description: formData.description.trim(),
          suburbs: formData.suburbs,
          price_min: Number(formData.priceMin),
          price_max: Number(formData.priceMax),
          capacity_min: formData.vendorType === 'barista' ? 0 : Number(formData.capacityMin),
          capacity_max: formData.vendorType === 'barista' ? 999 : Number(formData.capacityMax),
          event_types: formData.eventTypes,
          contact_name: formData.contactName.trim(),
          contact_email: formData.contactEmail.trim(),
          contact_phone: formData.contactPhone.trim() || null,
          website: formData.website.trim() || null,
          image_url: imageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 400 && errorData.details) {
          const fieldErrors: Record<string, string> = {}
          const keyMap: Record<string, string> = {
            business_name: 'businessName',
            price_min: 'priceMin',
            price_max: 'priceMax',
            capacity_min: 'capacityMin',
            capacity_max: 'capacityMax',
            event_types: 'eventTypes',
            contact_name: 'contactName',
            contact_email: 'contactEmail',
            contact_phone: 'contactPhone'
          }

          Object.entries(errorData.details).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              const frontendKey = keyMap[field] || field
              fieldErrors[frontendKey] = messages[0]
            }
          })
          console.log('Validation errors from server:', fieldErrors)
          setErrors(fieldErrors)
          throw new Error('Validation failed')
        }
        throw new Error('Failed to submit application')
      }

      setSubmitted(true)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5C842', '#3B2A1A', '#FAF5F0']
      })
    } catch (err: any) {
      if (err.message !== 'Validation failed') {
        setErrors({ submit: 'Something went wrong. Please try again.' })
      }
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Join the marketplace</h1>
          <p className="text-neutral-600 text-sm">Get listed on The Bean Route in a few minutes.</p>
        </div>

        <StepIndicator currentStep={step} totalSteps={3} />

        {/* Step 1 — Your Business */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#1A1A1A' }}>What kind of vendor are you?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'mobile_cart', label: 'Mobile Cart', icon: '🚐' },
                  { id: 'coffee_shop', label: 'Coffee Shop', icon: '🏠' },
                  { id: 'barista', label: 'Independent Barista', icon: '☕' }
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => updateField('vendorType', type.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.vendorType === type.id ? 'border-[#F5C842] bg-[#FAF5F0]' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}
                  >
                    <span className="text-2xl mb-2">{type.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>
                {formData.vendorType === 'barista' ? 'Display Name / Name' : 'Business name'}
              </label>
              <input
                id="businessName"
                type="text"
                placeholder="e.g. The Bean Cart"
                value={formData.businessName}
                onChange={e => updateField('businessName', e.target.value)}
                className={inputClass('businessName')}
              />
              {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
            </div>
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Specialty</label>
              <input
                id="specialty"
                type="text"
                placeholder="e.g. Single Origin Espresso & Pour-Over"
                value={formData.specialty}
                onChange={e => updateField('specialty', e.target.value)}
                className={inputClass('specialty')}
              />
              {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Description</label>
              <textarea
                id="description"
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

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Vendor Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">📸</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-block px-4 py-2 border border-neutral-300 rounded-lg text-xs font-bold cursor-pointer hover:bg-white active:bg-neutral-50"
                  >
                    {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <p className="text-[10px] text-neutral-400 mt-2 italic">Max 2MB. A photo of your cart or setup makes you 3x more likely to be booked.</p>
                </div>
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>{formData.vendorType === 'coffee_shop' ? 'Shop Address' : 'Primary Base Location'}</label>
              <LocationAutocomplete
                value={formData.physical_address}
                onChange={val => updateField('physical_address', val)}
                placeholder={formData.vendorType === 'coffee_shop' ? 'e.g. 123 Gertrude St, Fitzroy' : 'e.g. Richmond, VIC'}
                className={inputClass('physical_address')}
                error={errors.physical_address}
              />
              {errors.physical_address && <p className="text-red-500 text-xs mt-1">{errors.physical_address}</p>}
              <p className="text-[10px] text-neutral-400 mt-1.5 italic">
                {formData.vendorType === 'coffee_shop'
                  ? 'Your exact shop location so customers can find you.'
                  : 'The general area where you are based.'}
              </p>
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
                  <label key={suburb} htmlFor={`suburb-${suburb}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      id={`suburb-${suburb}`}
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
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                {formData.vendorType === 'barista' ? 'Hourly Rate ($/hr)' : 'Price range ($/hr)'}
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder={formData.vendorType === 'barista' ? '65' : '150'}
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

            {formData.vendorType !== 'barista' && (
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
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Event types</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EVENT_TYPES.map(type => (
                  <label key={type} htmlFor={`event-type-${type}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      id={`event-type-${type}`}
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
                <label htmlFor="contactName" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Your name</label>
                <input id="contactName" type="text" value={formData.contactName} onChange={e => updateField('contactName', e.target.value)} className={inputClass('contactName')} />
                {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Email</label>
                <input id="contactEmail" type="email" value={formData.contactEmail} onChange={e => updateField('contactEmail', e.target.value)} className={inputClass('contactEmail')} />
                {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Phone <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input id="contactPhone" type="tel" value={formData.contactPhone} onChange={e => updateField('contactPhone', e.target.value)} className={inputClass('contactPhone')} />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>Website <span className="text-neutral-400 font-normal">(optional)</span></label>
                <input id="website" type="url" value={formData.website} onChange={e => updateField('website', e.target.value)} className={inputClass('website')} />
              </div>
            </div>

            {/* Review summary */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400" style={{ color: '#3B2A1A' }}>Marketplace Preview</h3>
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded italic">Draft</span>
              </div>

              <VendorCard
                vendor={{
                  business_name: formData.businessName,
                  vendor_type: formData.vendorType,
                  specialty: formData.specialty,
                  description: formData.description,
                  suburbs: formData.suburbs,
                  price_min: Number(formData.priceMin),
                  price_max: Number(formData.priceMax),
                  capacity_min: formData.vendorType === 'barista' ? 0 : Number(formData.capacityMin),
                  capacity_max: formData.vendorType === 'barista' ? 999 : Number(formData.capacityMax),
                  image_url: imagePreview,
                  physical_address: formData.physical_address
                }}
                showActions={false}
              />

              <p className="text-[11px] text-center text-neutral-400 italic">This is how customers will see you in the marketplace. You can edit this later.</p>
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

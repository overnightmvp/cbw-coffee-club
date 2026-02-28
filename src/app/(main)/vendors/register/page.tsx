'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { StepIndicator } from '@/components/shared/StepIndicator'
import { VendorCard } from '@/components/vendors/VendorCard'
import { LocationAutocomplete } from '@/components/shared/LocationAutocomplete'
import { RegistrationSuccessModal } from '@/components/vendors/RegistrationSuccessModal'
import { triggerConfetti } from '@/lib/confetti'

// Zod schemas for each step
const step1Schema = z.object({
  vendorType: z.enum(['mobile_cart', 'coffee_shop', 'barista']),
  businessName: z.string().min(1, 'Business name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  description: z.string()
    .min(30, 'Description must be at least 30 characters')
    .max(500, 'Description must be under 500 characters'),
  physical_address: z.string().optional(),
}).refine((data) => {
  if (data.vendorType === 'coffee_shop' && !data.physical_address) {
    return false
  }
  return true
}, {
  message: 'Shop address is required',
  path: ['physical_address'],
})

const step2Schema = z.object({
  suburbs: z.array(z.string()).min(1, 'Select at least one suburb'),
  priceMin: z.string().min(1, 'Minimum price is required').refine((val) => {
    const num = Number(val)
    return !isNaN(num) && num >= 30
  }, 'Price must be at least $30'),
  priceMax: z.string().min(1, 'Maximum price is required'),
  capacityMin: z.string().optional(),
  capacityMax: z.string().optional(),
  eventTypes: z.array(z.string()).min(1, 'Select at least one event type'),
  vendorType: z.enum(['mobile_cart', 'coffee_shop', 'barista']),
}).refine((data) => {
  const priceMin = Number(data.priceMin)
  const priceMax = Number(data.priceMax)
  if (priceMax < priceMin) {
    return false
  }
  return true
}, {
  message: 'Maximum must be greater than minimum',
  path: ['priceMax'],
}).refine((data) => {
  if (data.vendorType === 'barista') return true
  if (!data.capacityMin) return false
  const num = Number(data.capacityMin)
  return !isNaN(num) && num >= 1
}, {
  message: 'Minimum capacity is required',
  path: ['capacityMin'],
}).refine((data) => {
  if (data.vendorType === 'barista') return true
  if (!data.capacityMax) return false
  return true
}, {
  message: 'Maximum capacity is required',
  path: ['capacityMax'],
}).refine((data) => {
  if (data.vendorType === 'barista') return true
  const capMin = Number(data.capacityMin)
  const capMax = Number(data.capacityMax)
  if (capMax < capMin) {
    return false
  }
  return true
}, {
  message: 'Maximum must be greater than minimum',
  path: ['capacityMax'],
})

const step3Schema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().min(1, 'Email is required').email('Enter a valid email'),
  contactPhone: z.string().optional(),
  website: z.string().optional(),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

interface RegistrationFormData extends Step1Data, Step2Data, Step3Data {}

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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const { register, handleSubmit, control, watch, trigger, formState: { errors } } = useForm<RegistrationFormData>({
    resolver: zodResolver(
      step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema
    ) as any,
    defaultValues: {
      vendorType: 'mobile_cart',
      businessName: '', specialty: '', description: '',
      physical_address: '',
      suburbs: [], priceMin: '', priceMax: '',
      capacityMin: '', capacityMax: '',
      eventTypes: [],
      contactName: '', contactEmail: '', contactPhone: '', website: '',
    },
  })

  const formData = watch()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError('Image must be under 2MB')
        toast.error('Image too large', { description: 'Please select an image under 2MB' })
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setImageError(null)
    }
  }

  const handleNext = async () => {
    const isValid = await trigger()
    if (!isValid) {
      const firstError = Object.values(errors)[0]
      if (firstError?.message) {
        toast.error('Please fix the errors', { description: firstError.message as string })
      }
      return
    }
    setStep(prev => (prev + 1) as 1 | 2 | 3)
  }

  const handleBack = () => setStep(prev => (prev - 1) as 1 | 2 | 3)

  const uploadImage = async (appId: string): Promise<string | null> => {
    if (!imageFile) return null

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

  const onSubmit = async (data: RegistrationFormData) => {
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
          vendor_type: data.vendorType,
          business_name: data.businessName.trim(),
          specialty: data.specialty.trim(),
          description: data.description.trim(),
          suburbs: data.suburbs,
          price_min: Number(data.priceMin),
          price_max: Number(data.priceMax),
          capacity_min: data.vendorType === 'barista' ? 0 : Number(data.capacityMin),
          capacity_max: data.vendorType === 'barista' ? 999 : Number(data.capacityMax),
          event_types: data.eventTypes,
          contact_name: data.contactName.trim(),
          contact_email: data.contactEmail.trim(),
          contact_phone: data.contactPhone?.trim() || null,
          website: data.website?.trim() || null,
          image_url: imageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Registration error:', errorData)
        toast.error('Failed to submit application', {
          description: 'Please check your details and try again.',
        })
        return
      }

      setSubmitted(true)
      setShowSuccessModal(true)
      triggerConfetti()
      toast.success('Application submitted!', {
        description: "We'll review it within 24 hours.",
      })
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Failed to submit application', {
        description: 'Please check your connection and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <Header variant="app" />
        <div className="max-w-md mx-auto px-4 py-32 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary-400">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-neutral-900">Your application is in</h2>
          <p className="text-neutral-600 mb-8">
            We&apos;ll review your details and get back to {formData.contactEmail} within 24 hours.
          </p>
          <Link href="/app" className="inline-block text-sm font-semibold text-brown-700">
            Browse the marketplace →
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const inputClass = (field: string) =>
    `w-full h-12 px-3 py-2 border rounded-lg text-base md:text-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none ${errors[field as keyof typeof errors] ? 'border-red-500' : 'border-neutral-300'}`

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Header variant="app" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-neutral-900">Join the marketplace</h1>
          <p className="text-neutral-600 text-sm">Get listed on The Bean Route in a few minutes.</p>
        </div>

        <StepIndicator currentStep={step} totalSteps={3} />

        {/* Registration Success Modal */}
        <RegistrationSuccessModal
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          businessName={formData.businessName}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1 — Your Business */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-neutral-900">What kind of vendor are you?</label>
                <Controller
                  name="vendorType"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'mobile_cart', label: 'Mobile Cart', icon: '🚐' },
                        { id: 'coffee_shop', label: 'Coffee Shop', icon: '🏠' },
                        { id: 'barista', label: 'Independent Barista', icon: '☕' }
                      ].map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => field.onChange(type.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${field.value === type.id ? 'border-[#F5C842] bg-[#FAF5F0]' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}
                        >
                          <span className="text-2xl mb-2">{type.icon}</span>
                          <span className="text-sm font-semibold text-neutral-900">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div>
                <label htmlFor="businessName" className="block text-sm font-medium mb-1.5 text-neutral-900">
                  {formData.vendorType === 'barista' ? 'Display Name / Name' : 'Business name'}
                </label>
                <input
                  id="businessName"
                  type="text"
                  placeholder="e.g. The Bean Cart"
                  {...register('businessName')}
                  className={inputClass('businessName')}
                />
                {errors.businessName && <p className="text-red-600 text-sm mt-1">{errors.businessName.message}</p>}
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium mb-1.5 text-neutral-900">Specialty</label>
                <input
                  id="specialty"
                  type="text"
                  placeholder="e.g. Single Origin Espresso & Pour-Over"
                  {...register('specialty')}
                  className={inputClass('specialty')}
                />
                {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty.message}</p>}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1.5 text-neutral-900">Description</label>
                <textarea
                  id="description"
                  placeholder="Tell us about your coffee cart — what makes you special, your setup, your story…"
                  {...register('description')}
                  rows={4}
                  className={inputClass('description')}
                />
                <div className="flex justify-between mt-1">
                  {errors.description ? <p className="text-red-600 text-sm">{errors.description.message}</p> : <span />}
                  <span className={`text-xs ${formData.description.length < 30 ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {formData.description.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-neutral-900">Vendor Photo</label>
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
                {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-neutral-900">{formData.vendorType === 'coffee_shop' ? 'Shop Address' : 'Primary Base Location'}</label>
                <Controller
                  name="physical_address"
                  control={control}
                  render={({ field }) => (
                    <LocationAutocomplete
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder={formData.vendorType === 'coffee_shop' ? 'e.g. 123 Gertrude St, Fitzroy' : 'e.g. Richmond, VIC'}
                      className={inputClass('physical_address')}
                      error={errors.physical_address?.message}
                    />
                  )}
                />
                {errors.physical_address && <p className="text-red-500 text-xs mt-1">{errors.physical_address.message}</p>}
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
                <label className="block text-sm font-medium mb-2 text-neutral-900">Suburbs you serve</label>
                <Controller
                  name="suburbs"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {SUBURBS.map(suburb => (
                        <label key={suburb} htmlFor={`suburb-${suburb}`} className="flex items-center gap-2 cursor-pointer">
                          <input
                            id={`suburb-${suburb}`}
                            type="checkbox"
                            checked={field.value.includes(suburb)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, suburb])
                              } else {
                                field.onChange(field.value.filter(s => s !== suburb))
                              }
                            }}
                            className="w-4 h-4 rounded accent-primary-400"
                          />
                          <span className="text-xs text-neutral-600">{suburb}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.suburbs && <p className="text-red-500 text-xs mt-2">{errors.suburbs.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900">
                  {formData.vendorType === 'barista' ? 'Hourly Rate ($/hr)' : 'Price range ($/hr)'}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder={formData.vendorType === 'barista' ? '65' : '150'}
                      {...register('priceMin')}
                      className={inputClass('priceMin')}
                    />
                    {errors.priceMin && <p className="text-red-500 text-xs mt-1">{errors.priceMin.message}</p>}
                  </div>
                  <span className="text-neutral-400 text-sm">–</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="350"
                      {...register('priceMax')}
                      className={inputClass('priceMax')}
                    />
                    {errors.priceMax && <p className="text-red-500 text-xs mt-1">{errors.priceMax.message}</p>}
                  </div>
                </div>
              </div>

              {formData.vendorType !== 'barista' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-900">Capacity (guests)</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="20"
                        {...register('capacityMin')}
                        className={inputClass('capacityMin')}
                      />
                      {errors.capacityMin && <p className="text-red-500 text-xs mt-1">{errors.capacityMin.message}</p>}
                    </div>
                    <span className="text-neutral-400 text-sm">–</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="150"
                        {...register('capacityMax')}
                        className={inputClass('capacityMax')}
                      />
                      {errors.capacityMax && <p className="text-red-500 text-xs mt-1">{errors.capacityMax.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900">Event types</label>
                <Controller
                  name="eventTypes"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {EVENT_TYPES.map(type => (
                        <label key={type} htmlFor={`event-type-${type}`} className="flex items-center gap-2 cursor-pointer">
                          <input
                            id={`event-type-${type}`}
                            type="checkbox"
                            checked={field.value.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, type])
                              } else {
                                field.onChange(field.value.filter(t => t !== type))
                              }
                            }}
                            className="w-4 h-4 rounded accent-primary-400"
                          />
                          <span className="text-xs text-neutral-600">{type}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.eventTypes && <p className="text-red-500 text-xs mt-2">{errors.eventTypes.message}</p>}
              </div>
            </div>
          )}

          {/* Step 3 — Contact + Review */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium mb-1.5 text-neutral-900">Your name</label>
                  <input id="contactName" type="text" {...register('contactName')} className={inputClass('contactName')} />
                  {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium mb-1.5 text-neutral-900">Email</label>
                  <input id="contactEmail" type="email" {...register('contactEmail')} className={inputClass('contactEmail')} />
                  {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium mb-1.5 text-neutral-900">Phone <span className="text-neutral-400 font-normal">(optional)</span></label>
                  <input id="contactPhone" type="tel" {...register('contactPhone')} className={inputClass('contactPhone')} />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium mb-1.5 text-neutral-900">Website <span className="text-neutral-400 font-normal">(optional)</span></label>
                  <input id="website" type="url" {...register('website')} className={inputClass('website')} />
                </div>
              </div>

              {/* Review summary */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brown-700">Marketplace Preview</h3>
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
            </div>
          )}

          {/* Navigation */}
          <div className={`flex gap-3 mt-8 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <button type="button" onClick={handleBack} className="px-5 py-2 text-sm font-medium border border-neutral-300 rounded-lg text-neutral-600 hover:bg-white">
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="h-12 px-6 text-sm font-semibold rounded-lg text-brown-700 bg-primary-400 hover:bg-primary-500 transition-colors">
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 px-6 text-sm font-semibold rounded-lg text-brown-700 bg-primary-400 hover:bg-primary-500 disabled:opacity-60 transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-brown-700 border-t-transparent rounded-full animate-spin"></div>
                    Submitting…
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

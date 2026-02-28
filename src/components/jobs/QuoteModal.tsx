'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2 } from 'lucide-react'
import type { Job } from '@/lib/supabase'
import { triggerConfetti } from '@/lib/confetti'

const quoteSchema = z.object({
  vendorName: z.string().min(1, 'Vendor name is required'),
  pricePerHour: z.string().min(1, 'Price is required').refine((val) => {
    const num = Number(val)
    return !isNaN(num) && num > 0
  }, 'Price must be a positive number'),
  message: z.string().max(300, 'Message must be under 300 characters').optional(),
  contactEmail: z.string().min(1, 'Email is required').email('Enter a valid email'),
})

type QuoteFormData = z.infer<typeof quoteSchema>

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

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      vendorName: '',
      pricePerHour: '',
      message: '',
      contactEmail: '',
    },
  })

  const formData = watch()

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset()
      setSubmitted(false)
    }
  }, [isOpen, reset])

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const id = `qte_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      const { error } = await supabase.from('quotes').insert({
        id,
        job_id: jobId,
        vendor_name: data.vendorName.trim(),
        price_per_hour: Number(data.pricePerHour),
        message: data.message?.trim() || null,
        contact_email: data.contactEmail.trim(),
      })

      if (error) {
        console.error('Quote submission error:', error)
        toast.error('Failed to submit quote', {
          description: 'Please try again or contact support.',
        })
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
                name: data.vendorName.trim(),
                email: data.contactEmail.trim()
              },
              quote: {
                pricePerHour: Number(data.pricePerHour),
                message: data.message?.trim() || null
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

      // Success feedback
      setSubmitted(true)
      toast.success('Quote submitted!', {
        description: 'The event organizer will review your quote.',
      })
      triggerConfetti()
      onSuccess()
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Failed to submit quote', {
        description: 'Please check your connection and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (submitted) {
      onSuccess()
      setSubmitted(false)
      reset()
    }
    onClose()
  }

  // Success state
  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-20 h-20 rounded-full bg-primary-400 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-brown-700" />
            </div>

            <DialogTitle className="text-2xl mb-3">Quote Submitted Successfully</DialogTitle>
            <DialogDescription className="text-base mb-6">
              Your quote has been sent to the event organizer.
            </DialogDescription>

            <div className="w-full bg-neutral-50 rounded-lg p-5 mb-6 text-left">
              <h3 className="text-sm font-semibold mb-3 text-brown-700">What Happens Next?</h3>
              <ul className="space-y-2.5 text-sm text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
                    1
                  </span>
                  <span>
                    The event organizer will review your quote
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
                    2
                  </span>
                  <span>
                    If interested, they'll contact you directly within <strong>24-48 hours</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
                    3
                  </span>
                  <span>
                    You can discuss booking details and finalize the arrangement
                  </span>
                </li>
              </ul>
            </div>

            <div className="w-full space-y-3">
              <p className="text-xs text-neutral-500 mb-3">
                A confirmation has been sent to <strong>{formData.contactEmail}</strong>
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
          <DialogTitle className="text-xl">Submit a Quote</DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Share your pricing and availability for this event
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="vendorName" className="text-sm font-medium text-neutral-700">
                Vendor name *
              </Label>
              <Input
                id="vendorName"
                type="text"
                placeholder="e.g. The Bean Cart"
                {...register('vendorName')}
                className={`w-full mt-1 ${errors.vendorName ? 'border-red-300' : ''}`}
              />
              {errors.vendorName && <p className="text-red-600 text-sm mt-1">{errors.vendorName.message}</p>}
            </div>

            <div>
              <Label htmlFor="pricePerHour" className="text-sm font-medium text-neutral-700">
                Your price ($/hr) *
              </Label>
              <Input
                id="pricePerHour"
                type="number"
                placeholder="250"
                {...register('pricePerHour')}
                className={`w-full mt-1 ${errors.pricePerHour ? 'border-red-300' : ''}`}
              />
              {errors.pricePerHour && <p className="text-red-600 text-sm mt-1">{errors.pricePerHour.message}</p>}
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-neutral-700">
                A message <span className="text-neutral-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Tell the event owner about your cart, availability, and what's included…"
                {...register('message')}
                rows={3}
                className={`w-full mt-1 min-h-[96px] ${errors.message ? 'border-red-300' : ''}`}
              />
              <div className="flex justify-between mt-1">
                {errors.message ? <p className="text-red-600 text-sm">{errors.message.message}</p> : <span />}
                <span className="text-xs text-neutral-400">{(formData.message || '').length}/300</span>
              </div>
            </div>

            <div>
              <Label htmlFor="contactEmail" className="text-sm font-medium text-neutral-700">
                Your email *
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="your@email.com"
                {...register('contactEmail')}
                className={`w-full mt-1 ${errors.contactEmail ? 'border-red-300' : ''}`}
              />
              {errors.contactEmail && <p className="text-red-600 text-sm mt-1">{errors.contactEmail.message}</p>}
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <div className="space-y-3">
            {/* Trust Elements */}
            <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Free to quote
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
              onClick={handleSubmit(onSubmit)}
              className="w-full h-12"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-brown-700 border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Quote'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

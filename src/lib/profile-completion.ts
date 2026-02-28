import { Vendor } from './supabase'

export interface CompletionTask {
  id: string
  label: string
  completed: boolean
  weight: number
}

export interface ProfileCompletion {
  percentage: number
  tasks: CompletionTask[]
  tier: 'basic' | 'standard' | 'premium'
}

/**
 * Calculate vendor profile completion percentage
 * Returns completion data with tasks checklist
 */
export function calculateProfileCompletion(vendor: Vendor): ProfileCompletion {
  const tasks: CompletionTask[] = [
    {
      id: 'business_name',
      label: 'Business name added',
      completed: !!vendor.business_name,
      weight: 10
    },
    {
      id: 'description',
      label: 'Description written',
      completed: !!vendor.description && vendor.description.length >= 50,
      weight: 15
    },
    {
      id: 'specialty',
      label: 'Specialty defined',
      completed: !!vendor.specialty,
      weight: 10
    },
    {
      id: 'suburbs',
      label: 'Service areas added',
      completed: vendor.suburbs && vendor.suburbs.length >= 3,
      weight: 10
    },
    {
      id: 'contact',
      label: 'Contact details complete',
      completed: !!(vendor.contact_email && vendor.contact_phone),
      weight: 15
    },
    {
      id: 'image',
      label: 'Profile image uploaded',
      completed: !!vendor.image_url,
      weight: 10
    },
    {
      id: 'tags',
      label: 'Tags added (at least 3)',
      completed: vendor.tags && vendor.tags.length >= 3,
      weight: 10
    },
    {
      id: 'pricing',
      label: 'Pricing information set',
      completed: vendor.price_min > 0 && vendor.price_max > 0,
      weight: 10
    },
    {
      id: 'capacity',
      label: 'Capacity range defined',
      completed: vendor.capacity_min > 0 && vendor.capacity_max > 0,
      weight: 10
    }
  ]

  const totalWeight = tasks.reduce((sum, task) => sum + task.weight, 0)
  const completedWeight = tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.weight, 0)

  const percentage = Math.round((completedWeight / totalWeight) * 100)
  const tier = getUnlockTier(percentage)

  return {
    percentage,
    tasks,
    tier
  }
}

/**
 * Determine unlock tier based on completion percentage
 */
export function getUnlockTier(percentage: number): 'basic' | 'standard' | 'premium' {
  if (percentage >= 80) return 'premium'
  if (percentage >= 50) return 'standard'
  return 'basic'
}

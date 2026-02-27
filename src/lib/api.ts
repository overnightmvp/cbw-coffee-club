/**
 * API Client - Centralized HTTP client for all API requests
 * Provides type-safe methods with consistent error handling
 */

export type InquiryData = {
  vendor_id: string
  event_type: string
  event_date: string
  duration_hours: number
  guest_count: number
  location: string
  contact_name: string
  contact_email: string
  contact_phone: string
  estimated_cost?: number
}

export type QuoteData = {
  job_id: string
  vendor_name: string
  price_per_hour: number
  message: string
  contact_email: string
}

export type ApplicationData = {
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
  contact_phone: string
}

export type JobData = {
  event_title: string
  event_type: string
  event_date: string
  duration_hours: number
  guest_count: number
  budget_min: number
  budget_max: number
  location: string
  special_requirements?: string
  contact_name: string
  contact_email: string
  contact_phone: string
}

class ApiClient {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(error || `HTTP ${res.status}: ${res.statusText}`)
    }

    return res.json()
  }

  // Inquiries
  async submitInquiry(data: InquiryData) {
    return this.request('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateInquiryStatus(id: string, status: string) {
    return this.request(`/api/dashboard/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  // Quotes
  async submitQuote(data: QuoteData) {
    return this.request('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Vendor applications
  async submitVendorApplication(data: ApplicationData) {
    return this.request('/api/vendors/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateApplicationStatus(id: string, status: 'approved' | 'rejected') {
    return this.request(`/api/dashboard/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  // Jobs
  async createJob(data: JobData) {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const api = new ApiClient()

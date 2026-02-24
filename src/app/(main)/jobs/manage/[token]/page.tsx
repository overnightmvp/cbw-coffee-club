import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface JobManagePageProps {
    params: Promise<{ token: string }>
}

export default async function JobManagePage({ params }: JobManagePageProps) {
    const { token } = await params

    // 1. Fetch job by management_token
    const { data: job, error: jobError } = await supabaseAdmin
        .from('jobs')
        .select('*')
        .eq('management_token', token)
        .single()

    if (jobError || !job) {
        return notFound()
    }

    // 2. Fetch quotes for this job
    const { data: quotes, error: quotesError } = await supabaseAdmin
        .from('quotes')
        .select('*')
        .eq('job_id', job.id)
        .order('created_at', { ascending: false })

    // 3. For each quote, fetch vendor profile if possible (via email match)
    const quotesWithVendors = await Promise.all((quotes || []).map(async (quote) => {
        const { data: vendor } = await supabaseAdmin
            .from('vendor_applications')
            .select('image_url, specialty, business_name')
            .eq('contact_email', quote.contact_email)
            .eq('status', 'approved') // Only show info for approved vendors
            .maybeSingle()

        return { ...quote, vendor }
    }))

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAF8' }}>
            <Header variant="app" />

            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4 uppercase tracking-widest font-bold">
                        <Link href="/app" className="hover:text-[#3B2A1A]">Marketplace</Link>
                        <span>/</span>
                        <span className="text-neutral-400">Job Management</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>{job.event_title}</h1>
                            <p className="text-neutral-600">Posted on {new Date(job.created_at).toLocaleDateString('en-AU')}</p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold inline-block self-start md:self-auto ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-600'
                            }`}>
                            {job.status === 'open' ? 'Currently Receiving Quotes' : 'Job Closed'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Details Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                            <h2 className="text-sm font-bold mb-4 uppercase tracking-wider text-neutral-400">Event Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Date & Time</label>
                                    <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{job.event_date}</p>
                                    <p className="text-xs text-neutral-500">{job.duration_hours} hours</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Location</label>
                                    <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{job.location}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Guest Count</label>
                                    <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{job.guest_count} guests</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Budget</label>
                                    <p className="text-sm font-semibold" style={{ color: '#3B2A1A' }}>
                                        {job.budget_min ? `$${job.budget_min}–$${job.budget_max}/hr` : `Up to $${job.budget_max}/hr`}
                                    </p>
                                </div>
                                {job.special_requirements && (
                                    <div>
                                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Requirements</label>
                                        <p className="text-xs text-neutral-600 leading-relaxed">{job.special_requirements}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#FAF5F0] rounded-2xl p-6 border border-[#EBE3D5]">
                            <h3 className="text-sm font-bold mb-2" style={{ color: '#3B2A1A' }}>Customer Support</h3>
                            <p className="text-xs text-[#3B2A1A]/70 mb-4">Need help choosing a vendor or changing event details?</p>
                            <a href="mailto:support@thebeanroute.com.au" className="text-xs font-bold underline text-[#3B2A1A]">Contact Support →</a>
                        </div>
                    </div>

                    {/* Quotes Section */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: '#1A1A1A' }}>
                            Received Quotes
                            <span className="bg-[#F5C842] text-[#1A1A1A] text-xs px-2.5 py-0.5 rounded-full">{quotesWithVendors.length}</span>
                        </h2>

                        {quotesWithVendors.length === 0 ? (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-200 p-12 text-center">
                                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⏳</span>
                                </div>
                                <h3 className="text-lg font-bold mb-2">Waiting for quotes...</h3>
                                <p className="text-neutral-500 text-sm max-w-xs mx-auto">
                                    We&apos;ve notified our network of coffee vendors. You&apos;ll receive an email as soon as the first quote arrives.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {quotesWithVendors.map((quote) => (
                                    <div key={quote.id} className={`bg-white rounded-3xl border transition-all ${quote.status === 'accepted' ? 'border-green-500 ring-4 ring-green-50' : 'border-neutral-200 hover:border-[#F5C842] shadow-sm'
                                        }`}>
                                        <div className="p-6">
                                            <div className="flex gap-4">
                                                {/* Vendor Photo */}
                                                <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex-shrink-0 overflow-hidden border border-neutral-100">
                                                    {quote.vendor?.image_url ? (
                                                        <img src={quote.vendor.image_url} alt={quote.vendor_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl bg-[#FAF5F0] text-[#3B2A1A]">☕</div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h3 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>{quote.vendor_name}</h3>
                                                            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{quote.vendor?.specialty || 'Specialty Coffee Vendor'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-black" style={{ color: '#3B2A1A' }}>${quote.price_per_hour}<span className="text-xs font-normal text-neutral-400">/hr</span></p>
                                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">EST. TOTAL: ${quote.price_per_hour * Number(job.duration_hours)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 relative">
                                                <div className="absolute -top-3 left-4 bg-neutral-50 px-2 text-[10px] font-bold text-neutral-400 uppercase">Vendor Message</div>
                                                <p className="text-sm text-neutral-600 leading-relaxed italic">
                                                    &quot;{quote.message || `Hi ${job.contact_name}, I'd love to serve coffee at your ${job.event_type}! Let me know if you have any questions.`}&quot;
                                                </p>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-neutral-400">Received {new Date(quote.created_at).toLocaleDateString('en-AU')}</span>
                                                </div>

                                                {quote.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <a
                                                            href={`mailto:${quote.contact_email}?subject=Inquiry about your quote for ${job.event_title}`}
                                                            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-neutral-300 hover:bg-neutral-50 transition-colors"
                                                        >
                                                            Message Vendor
                                                        </a>
                                                        <button
                                                            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#F5C842] text-[#1A1A1A] hover:opacity-90 transition-all shadow-md active:scale-95"
                                                            onClick={() => alert('This will notify the vendor and provide their full contact details. Feature coming soon in Epic 3!')}
                                                        >
                                                            Accept Quote
                                                        </button>
                                                    </div>
                                                ) : quote.status === 'accepted' ? (
                                                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-3 py-1.5 rounded-full ring-1 ring-green-100">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                        ACCEPTED
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Closed</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="mt-12 text-center text-xs text-neutral-400 max-w-sm mx-auto">
                            This is a secure private link. Your contact details are only shared with vendors once you accept their quote.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

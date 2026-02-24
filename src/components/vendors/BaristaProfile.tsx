import React from 'react'
import Link from 'next/link'
import type { Vendor } from '@/lib/supabase'
import { formatVendorPrice } from '@/lib/supabase'
import { Badge, Button } from '@/components/ui'

interface BaristaProfileProps {
    vendor: Vendor
    onGetQuoteClick: () => void
}

export function BaristaProfile({ vendor, onGetQuoteClick }: BaristaProfileProps) {
    return (
        <>
            {/* Hero */}
            <div className="relative h-56 sm:h-64" style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #3B2A1A 100%)' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-[#A0785A] flex items-center justify-center">
                        <svg className="w-10 h-10" fill="none" stroke="#F5C842" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAFAF8] to-transparent" />
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
                                    {vendor.business_name}
                                </h1>
                                {vendor.verified && (
                                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 border border-blue-200">
                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-semibold text-blue-700">Verified Pro</span>
                                    </div>
                                )}
                                <Badge variant="outline" className="bg-neutral-50 text-neutral-600 border-neutral-200 font-medium">Independent Barista</Badge>
                            </div>
                            <p className="text-neutral-600 mt-1">{vendor.specialty}</p>

                            <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Fast Response</span>
                                </div>
                                <div className="flex items-center gap-1 text-amber-600 font-medium">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span>Elite Barista (5.0)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold"
                                onClick={onGetQuoteClick}
                            >
                                Hire this Barista
                            </Button>
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-neutral-100">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Hourly Rate</div>
                            <div className="text-xl font-bold" style={{ color: '#3B2A1A' }}>{formatVendorPrice(vendor)}</div>
                            <div className="text-xs text-neutral-400">AUD / hour</div>
                        </div>
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Availability</div>
                            <div className="text-xl font-bold text-emerald-600">Available</div>
                            <div className="text-xs text-neutral-400">Evenings & Weekends</div>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Suburbs Served</div>
                            <div className="flex flex-wrap gap-1">
                                {vendor.suburbs.slice(0, 4).map(suburb => (
                                    <Badge key={suburb} variant="secondary" size="xs" className="text-[10px] px-1.5 py-0 bg-neutral-100 text-neutral-600">
                                        {suburb}
                                    </Badge>
                                ))}
                                {vendor.suburbs.length > 4 && (
                                    <span className="text-xs text-neutral-400">+{vendor.suburbs.length - 4} more</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {vendor.description && (
                        <div className="mt-8">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Professional Bio</h3>
                            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{vendor.description}</p>
                        </div>
                    )}

                    {/* Expertise/Skills */}
                    <div className="mt-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Expertise & Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {vendor.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 capitalize"
                                    style={{ color: '#3B2A1A', backgroundColor: '#FAF5F0' }}
                                >
                                    {tag.replace(/-/g, ' ')}
                                </span>
                            ))}
                            {/* Fallback skills if no tags */}
                            {vendor.tags.length === 0 && (
                                <>
                                    <Badge variant="outline" className="border-neutral-200 text-neutral-600">Latte Art</Badge>
                                    <Badge variant="outline" className="border-neutral-200 text-neutral-600">Manual Brewing</Badge>
                                    <Badge variant="outline" className="border-neutral-200 text-neutral-600">Grinder Calibration</Badge>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Trust Sections */}
                    <div className="mt-10 grid sm:grid-cols-2 gap-6 p-6 rounded-xl border border-neutral-100" style={{ backgroundColor: '#FAFAF8' }}>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-neutral-100">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-neutral-900">Background Checked</h4>
                                <p className="text-xs text-neutral-500 mt-0.5">Verified identity and barista certifications on file.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-neutral-100">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-neutral-900">Transparent Rates</h4>
                                <p className="text-xs text-neutral-500 mt-0.5">Direct hiring with no middleman markups.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-10 pt-8 border-t border-neutral-100">
                        <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl sm:text-2xl font-bold mb-2">Need a barista for your next event?</h3>
                                <p className="text-neutral-400 text-sm mb-6 max-w-md">
                                    Hire {vendor.business_name} directly for corporate offices, private parties, or as emergency staff cover.
                                </p>
                                <Button
                                    className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-bold px-8 py-6 rounded-xl"
                                    onClick={onGetQuoteClick}
                                >
                                    Request Booking
                                </Button>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 opacity-10 -mr-20 -mt-20">
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#FFFFFF" d="M44.7,-76.4C58.2,-69.2,70,-59.1,79.6,-46.5C89.2,-33.9,96.6,-18.9,97.3,-3.8C98,11.3,92.1,26.6,83.1,40.1C74.1,53.6,62,65.3,48.1,73.1C34.2,80.9,18.5,84.8,3.2,80.8C-12.1,76.8,-27,64.9,-39.8,54.8C-52.6,44.7,-63.3,36.4,-70.5,25.3C-77.7,14.2,-81.4,0.3,-78.7,-12.4C-76,-25.1,-66.9,-36.6,-56.3,-45.5C-45.7,-54.4,-33.6,-60.7,-21.8,-69.2C-10,-77.7,1.5,-88.4,14.3,-88.4C27.1,-88.4,31.2,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suburbs Grid */}
                <div className="mt-12">
                    <h2 className="text-lg font-bold mb-6 text-neutral-900">Service Locations</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {vendor.suburbs.map(suburb => (
                            <div key={suburb} className="bg-white border border-neutral-200 rounded-lg p-3 text-center text-sm text-neutral-600 shadow-sm">
                                {suburb}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Internal Resources */}
                <div className="mt-12 grid sm:grid-cols-3 gap-6">
                    <Link href="/contractors/how-to-hire-barista" className="block group">
                        <h4 className="font-bold text-sm mb-2 group-hover:text-amber-600">How to Hire →</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">Guide on hiring freelance baristas for Melbourne events.</p>
                    </Link>
                    <Link href="/contractors/costs" className="block group">
                        <h4 className="font-bold text-sm mb-2 group-hover:text-amber-600">Pricing Guide →</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">What you should expect to pay for specialty barista staff.</p>
                    </Link>
                    <Link href="/app" className="block group">
                        <h4 className="font-bold text-sm mb-2 group-hover:text-amber-600">Browse Others →</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">See all coffee carts and baristas in your area.</p>
                    </Link>
                </div>
            </div>
        </>
    )
}

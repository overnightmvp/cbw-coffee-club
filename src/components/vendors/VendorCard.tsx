'use client'

import React from 'react'
import Link from 'next/link'
import { type Vendor, type VendorType, formatVendorPrice, isCoffeeShop, isMobileCart } from '@/lib/supabase'
import { Badge, Card, CardContent } from '@/components/ui'
import { OpenNowBadge } from '@/components/vendors/OpeningHoursDisplay'

interface VendorCardProps {
    vendor: Partial<Vendor>
    variant?: 'compact' | 'full'
    showActions?: boolean
    onActionClick?: (vendor: any) => void
    actionLabel?: string
}

export function VendorCard({
    vendor,
    variant = 'full',
    showActions = true,
    onActionClick,
    actionLabel = 'Get a Quote'
}: VendorCardProps) {
    const isShop = vendor.vendor_type === 'coffee_shop'
    const isCart = vendor.vendor_type === 'mobile_cart'
    const isBari = vendor.vendor_type === 'barista'

    return (
        <Card className={`overflow-hidden transition-all ${variant === 'full' ? 'hover:shadow-md' : 'shadow-none'}`} data-testid="vendor-card">
            {/* Card Image / Hero section */}
            <div
                className={`relative ${variant === 'full' ? 'h-40' : 'h-32'} bg-gradient-to-br from-brown-700 to-[#6B4226]`}
                style={vendor.image_url ? {
                    backgroundImage: `url(${vendor.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : undefined}
            >
                {!vendor.image_url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-2 border-[#A0785A] flex items-center justify-center bg-brown-700/50 backdrop-blur-sm">
                            <span className="text-2xl">☕</span>
                        </div>
                    </div>
                )}

                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider text-brown-700">
                        {isShop ? (vendor.price_range || '$$') : formatVendorPrice(vendor as Vendor)}
                    </span>
                </div>

                <div className="absolute top-3 left-3">
                    <span className="bg-primary-400 text-neutral-900 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {isShop ? 'Coffee Shop' : isBari ? 'Barista' : 'Mobile Cart'}
                    </span>
                </div>
            </div>

            {/* Card Content */}
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold truncate text-neutral-900">{vendor.business_name || 'Business Name'}</h3>
                    {isShop && vendor.opening_hours && <OpenNowBadge hours={vendor.opening_hours} />}
                </div>
                <p className="text-sm text-neutral-500 mb-3 font-medium">{vendor.specialty || 'Your specialty here'}</p>

                {isShop && vendor.physical_address && (
                    <div className="flex items-start gap-1.5 mb-3">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs text-neutral-500 line-clamp-1">{vendor.physical_address}</span>
                    </div>
                )}

                {(isCart || isBari) && (
                    <>
                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                            {vendor.description || 'No description provided yet.'}
                        </p>
                        <div className="flex items-center gap-1.5 mb-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            <span>Capacity: {vendor.capacity_min}–{vendor.capacity_max} guests</span>
                        </div>
                    </>
                )}

                {/* Suburbs */}
                <div className="flex flex-wrap gap-1 mb-5">
                    {vendor.suburbs?.slice(0, 3).map(suburb => (
                        <Badge key={suburb} variant="secondary" className="text-[10px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-600 border-none">
                            {suburb}
                        </Badge>
                    ))}
                    {(vendor.suburbs?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 border-neutral-200 text-neutral-400">
                            +{(vendor.suburbs?.length || 0) - 3}
                        </Badge>
                    )}
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onActionClick?.(vendor)}
                            className="flex-1 bg-primary-400 text-brown-700 py-2.5 rounded-xl text-xs font-bold hover:bg-primary-500 transition-colors active:scale-95 shadow-sm min-h-[44px]"
                        >
                            {actionLabel}
                        </button>
                        <Link href={`/vendors/${vendor.slug}`}>
                            <button className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-all min-h-[44px]">
                                View
                            </button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

'use client'

import React from 'react'
import { type Job } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui'

interface JobCardProps {
    job: Partial<Job>
    variant?: 'compact' | 'full'
    showStatus?: boolean
}

export function JobCard({ job, variant = 'full', showStatus = true }: JobCardProps) {
    return (
        <Card className={`overflow-hidden transition-all ${variant === 'full' ? 'hover:border-primary-400 shadow-sm' : 'shadow-none'} rounded-3xl`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em]">New Job Posting</span>
                            {showStatus && job.status === 'open' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            )}
                        </div>
                        <h3 className="text-xl font-black text-neutral-900 leading-tight">{job.event_title || 'Untitled Event'}</h3>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Budget</span>
                        <p className="text-lg font-black text-brown-700">
                            {job.budget_min ? `$${job.budget_min}–$${job.budget_max}/hr` : `Up to $${job.budget_max}/hr`}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-sm border border-neutral-100">📅</div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter leading-none mb-1">Date</p>
                            <p className="text-xs font-bold text-neutral-900">{job.event_date || 'Date TBC'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-sm border border-neutral-100">📍</div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter leading-none mb-1">Location</p>
                            <p className="text-xs font-bold text-neutral-900 truncate max-w-[120px]">{job.location || 'Melbourne'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-sm border border-neutral-100">👥</div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter leading-none mb-1">Guests</p>
                            <p className="text-xs font-bold text-neutral-900">{job.guest_count || 0} guests</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-sm border border-neutral-100">⏱️</div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter leading-none mb-1">Duration</p>
                            <p className="text-xs font-bold text-neutral-900">{job.duration_hours || 0} hours</p>
                        </div>
                    </div>
                </div>

                {job.special_requirements && (
                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 mb-2">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Requirements</p>
                        <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 italic">
                            &quot;{job.special_requirements}&quot;
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

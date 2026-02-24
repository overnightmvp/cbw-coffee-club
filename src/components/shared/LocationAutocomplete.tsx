'use client'

import React, { useEffect, useRef, useState } from 'react'

interface LocationAutocompleteProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    error?: string
}

declare global {
    interface Window {
        google: any
        initAutocomplete: () => void
    }
}

export function LocationAutocomplete({
    value,
    onChange,
    placeholder = 'Enter a location...',
    className = '',
    error
}: LocationAutocompleteProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const autocompleteRef = useRef<any>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

    useEffect(() => {
        if (!apiKey) {
            setIsLoaded(false)
            return
        }

        if (window.google?.maps?.places) {
            setIsLoaded(true)
            return
        }

        const scriptId = 'google-maps-script'
        if (document.getElementById(scriptId)) return

        const script = document.createElement('script')
        script.id = scriptId
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => setIsLoaded(true)
        document.head.appendChild(script)

        return () => {
            // We don't necessarily want to remove it on unmount if other components use it
        }
    }, [apiKey])

    useEffect(() => {
        if (isLoaded && inputRef.current && !autocompleteRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                componentRestrictions: { country: 'au' }, // Restricted to Australia for TBR MVP
                fields: ['formatted_address', 'address_components', 'geometry'],
                types: ['geocode', 'establishment']
            })

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace()
                if (place.formatted_address) {
                    onChange(place.formatted_address)
                }
            })
        }
    }, [isLoaded, onChange])

    // If no API key, fallback to a regular input with a helpful hint for the admin (if in dev)
    if (!apiKey) {
        return (
            <div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`${className} ${error ? 'border-red-300' : 'border-neutral-300'}`}
                />
                {process.env.NODE_ENV === 'development' && (
                    <p className="text-[10px] text-amber-600 mt-1 italic">
                        Tip: Set NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to enable address autocomplete.
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`${className} ${error ? 'border-red-300' : 'border-neutral-300'}`}
            />
            {!isLoaded && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-neutral-200 border-t-neutral-400 rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

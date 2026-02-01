import React from 'react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep

          return (
            <React.Fragment key={step}>
              {isCompleted ? (
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5C842' }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3B2A1A' }}>
                  <span className="text-white text-xs font-bold">{step}</span>
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-neutral-300 flex items-center justify-center">
                  <span className="text-neutral-400 text-xs font-bold">{step}</span>
                </div>
              )}

              {step < totalSteps && (
                <div className="w-8 h-0.5" style={{ backgroundColor: step < currentStep ? '#F5C842' : '#e5e7eb' }} />
              )}
            </React.Fragment>
          )
        })}
      </div>
      <div className="text-xs text-neutral-500 mt-3">Step {currentStep} of {totalSteps}</div>
    </div>
  )
}

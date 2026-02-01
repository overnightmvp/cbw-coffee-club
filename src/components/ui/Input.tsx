import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: 'sm' | 'base' | 'lg'
  variant?: 'default' | 'error' | 'success'
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    inputSize = 'base', 
    variant = 'default',
    type = "text",
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    id,
    ...props 
  }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const errorVariant = error ? "error" : variant

    const baseStyles = "flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

    const variantStyles = {
      default: "border-neutral-300 focus-visible:ring-blue-500",
      error: "border-red-500 focus-visible:ring-red-500",
      success: "border-green-500 focus-visible:ring-green-500"
    }

    const sizeStyles = {
      sm: "h-8 px-2 text-xs",
      base: "h-10 px-3",
      lg: "h-12 px-4 text-base"
    }

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-neutral-400 text-sm">{leftIcon}</span>
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              baseStyles,
              variantStyles[errorVariant],
              sizeStyles[inputSize],
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              className
            )}
            ref={ref}
            id={inputId}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-neutral-400 text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p className="text-sm text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
'use client'

import { useState, useCallback } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingDisplayProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  reviewCount?: number
  className?: string
}

const sizeMap = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function RatingDisplay({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  className,
}: RatingDisplayProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value)
          const partial = !filled && i < value
          const fraction = partial ? value - Math.floor(value) : 0

          return (
            <span key={i} className="relative">
              {/* Empty star (background) */}
              <Star
                className={cn(
                  sizeMap[size],
                  'text-dark-600'
                )}
                fill="currentColor"
              />
              {/* Filled star (overlay) */}
              {(filled || partial) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={partial ? { width: `${fraction * 100}%` } : undefined}
                >
                  <Star
                    className={cn(
                      sizeMap[size],
                      'text-amber-400'
                    )}
                    fill="currentColor"
                  />
                </span>
              )}
            </span>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-dark-300">
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-dark-500">
          ({reviewCount})
        </span>
      )}
    </div>
  )
}

interface RatingInputProps {
  value: number
  onChange: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export function RatingInput({
  value,
  onChange,
  max = 5,
  size = 'md',
  disabled = false,
  className,
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const handleMouseEnter = useCallback(
    (starValue: number) => {
      if (!disabled) setHoverValue(starValue)
    },
    [disabled]
  )

  const handleMouseLeave = useCallback(() => {
    setHoverValue(0)
  }, [])

  const handleClick = useCallback(
    (starValue: number) => {
      if (!disabled) {
        onChange(starValue === value ? 0 : starValue)
      }
    },
    [disabled, onChange, value]
  )

  const displayValue = hoverValue || value

  return (
    <div
      className={cn('flex items-center gap-0.5', disabled && 'opacity-50', className)}
      onMouseLeave={handleMouseLeave}
      role="radiogroup"
      aria-label="Avaliacao"
    >
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1
        const filled = starValue <= displayValue

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            className={cn(
              'p-0.5 transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded',
              !disabled && 'cursor-pointer hover:scale-110'
            )}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onClick={() => handleClick(starValue)}
            role="radio"
            aria-checked={starValue === value}
            aria-label={`${starValue} estrela${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeMap[size],
                'transition-colors duration-150',
                filled ? 'text-amber-400' : 'text-dark-600'
              )}
              fill="currentColor"
            />
          </button>
        )
      })}
    </div>
  )
}

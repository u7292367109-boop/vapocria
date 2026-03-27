'use client'

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

type QuantitySelectorSize = 'sm' | 'md' | 'lg'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: QuantitySelectorSize
  disabled?: boolean
  className?: string
}

const sizeStyles: Record<QuantitySelectorSize, { button: string; display: string; icon: string }> = {
  sm: {
    button: 'h-7 w-7',
    display: 'w-8 text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    button: 'h-9 w-9',
    display: 'w-10 text-sm',
    icon: 'h-4 w-4',
  },
  lg: {
    button: 'h-11 w-11',
    display: 'w-12 text-base',
    icon: 'h-5 w-5',
  },
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const styles = sizeStyles[size]
  const canDecrement = value > min && !disabled
  const canIncrement = value < max && !disabled

  const handleDecrement = useCallback(() => {
    if (canDecrement) onChange(value - 1)
  }, [canDecrement, onChange, value])

  const handleIncrement = useCallback(() => {
    if (canIncrement) onChange(value + 1)
  }, [canIncrement, onChange, value])

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-dark-600 bg-dark-800/60 backdrop-blur-sm',
        disabled && 'opacity-50',
        className
      )}
      role="group"
      aria-label="Quantidade"
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={!canDecrement}
        className={cn(
          'flex items-center justify-center rounded-l-lg transition-colors duration-150',
          'text-dark-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
          canDecrement
            ? 'hover:bg-dark-700 hover:text-dark-200 active:bg-dark-600'
            : 'cursor-not-allowed opacity-40',
          styles.button
        )}
        aria-label="Diminuir quantidade"
      >
        <Minus className={styles.icon} />
      </button>

      <div className={cn('flex items-center justify-center font-medium text-dark-100 select-none', styles.display)}>
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={!canIncrement}
        className={cn(
          'flex items-center justify-center rounded-r-lg transition-colors duration-150',
          'text-dark-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
          canIncrement
            ? 'hover:bg-dark-700 hover:text-dark-200 active:bg-dark-600'
            : 'cursor-not-allowed opacity-40',
          styles.button
        )}
        aria-label="Aumentar quantidade"
      >
        <Plus className={styles.icon} />
      </button>
    </div>
  )
}

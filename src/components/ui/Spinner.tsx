'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)} role="status">
      <Loader2
        className={cn(
          'animate-spin text-primary-500',
          sizeMap[size]
        )}
      />
      {label && (
        <span className="text-sm text-dark-400">{label}</span>
      )}
      <span className="sr-only">{label || 'Carregando...'}</span>
    </div>
  )
}

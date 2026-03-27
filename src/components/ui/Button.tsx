'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-gradient-to-r from-primary-500 to-accent-500',
    'text-white font-semibold',
    'shadow-lg shadow-primary-500/25',
    'hover:shadow-xl hover:shadow-primary-500/40',
    'hover:from-primary-400 hover:to-accent-400',
    'active:from-primary-600 active:to-accent-600',
    'border border-transparent',
  ].join(' '),
  secondary: [
    'bg-dark-700 text-dark-100',
    'border border-dark-600',
    'hover:bg-dark-600 hover:border-dark-500',
    'active:bg-dark-800',
  ].join(' '),
  outline: [
    'bg-transparent text-primary-400',
    'border border-primary-500/50',
    'hover:bg-primary-500/10 hover:border-primary-400',
    'active:bg-primary-500/20',
  ].join(' '),
  danger: [
    'bg-red-600 text-white',
    'border border-red-500',
    'shadow-lg shadow-red-600/25',
    'hover:bg-red-500 hover:shadow-red-500/40',
    'active:bg-red-700',
  ].join(' '),
  ghost: [
    'bg-transparent text-dark-300',
    'border border-transparent',
    'hover:bg-dark-800 hover:text-dark-100',
    'active:bg-dark-700',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'relative inline-flex items-center justify-center',
          'font-medium transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className={cn('animate-spin', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

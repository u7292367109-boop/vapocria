import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  glow?: boolean
  pill?: boolean
  icon?: ReactNode
  className?: string
  children: ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-dark-700 text-dark-200 border-dark-600',
  primary: 'bg-primary-500/15 text-primary-400 border-primary-500/30',
  accent: 'bg-accent-500/15 text-accent-400 border-accent-500/30',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/15 text-red-400 border-red-500/30',
  outline: 'bg-transparent text-dark-300 border-dark-500',
}

const glowStyles: Partial<Record<BadgeVariant, string>> = {
  primary: 'shadow-[0_0_8px_rgba(14,165,233,0.3)]',
  accent: 'shadow-[0_0_8px_rgba(217,70,239,0.3)]',
  success: 'shadow-[0_0_8px_rgba(16,185,129,0.3)]',
  danger: 'shadow-[0_0_8px_rgba(239,68,68,0.3)]',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function Badge({
  variant = 'default',
  size = 'md',
  glow = false,
  pill = true,
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium border',
        'transition-all duration-200',
        pill ? 'rounded-full' : 'rounded-md',
        variantStyles[variant],
        sizeStyles[size],
        glow && glowStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

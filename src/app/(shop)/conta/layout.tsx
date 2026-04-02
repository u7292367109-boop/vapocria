'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'

const accountLinks = [
  { href: '/conta', label: 'Minha Conta', icon: User },
  { href: '/conta/pedidos', label: 'Meus Pedidos', icon: ShoppingBag },
  { href: '/conta', label: 'Enderecos', icon: MapPin, hash: '#enderecos' },
  { href: '/conta', label: 'Favoritos', icon: Heart, hash: '#favoritos' },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-dark-950 pt-8 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Decria Outlet branding header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center lg:text-left"
        >
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl font-bold gradient-text tracking-wider">DECRIA</span>
            <span className="text-brand-gold text-xs font-heading tracking-[0.2em] ml-2 uppercase">Outlet</span>
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'sticky top-28 rounded-2xl p-6',
                'bg-dark-900/60 backdrop-blur-xl',
                'border border-dark-700/50',
                'shadow-xl shadow-dark-950/50'
              )}
            >
              {/* User avatar section */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-dark-700/50">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-glow-purple">
                  {(user?.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark-100 truncate">
                    {user?.full_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-dark-400 truncate">
                    {user?.email || 'usuario@email.com'}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                {accountLinks.map((link) => {
                  const isActive =
                    link.href === '/conta'
                      ? pathname === '/conta' && !link.hash
                      : pathname.startsWith(link.href)

                  return (
                    <Link
                      key={link.label}
                      href={link.href + (link.hash || '')}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                        'transition-all duration-200',
                        isActive
                          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                          : 'text-dark-300 hover:bg-dark-800 hover:text-dark-100'
                      )}
                    >
                      <link.icon className="h-4 w-4 shrink-0" />
                      <span>{link.label}</span>
                      <ChevronRight
                        className={cn(
                          'h-3.5 w-3.5 ml-auto transition-transform',
                          isActive ? 'text-primary-400' : 'text-dark-600'
                        )}
                      />
                    </Link>
                  )
                })}

                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-dark-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 mt-4 border-t border-dark-700/50 pt-5"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </nav>
            </motion.div>
          </aside>

          {/* Mobile Horizontal Tabs */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-4">
              {accountLinks.map((link) => {
                const isActive =
                  link.href === '/conta'
                    ? pathname === '/conta' && !link.hash
                    : pathname.startsWith(link.href)

                return (
                  <Link
                    key={link.label}
                    href={link.href + (link.hash || '')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap',
                      'border transition-all duration-200',
                      isActive
                        ? 'bg-primary-500/15 text-primary-400 border-primary-500/30'
                        : 'bg-dark-900/60 text-dark-300 border-dark-700/50 hover:border-dark-500'
                    )}
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}

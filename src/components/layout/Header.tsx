'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Truck,
  Zap,
  CreditCard,
} from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/categorias', label: 'Categorias' },
  { href: '/ofertas', label: 'Ofertas' },
]

const PROMOS = [
  { icon: Truck, text: 'Frete Gratis acima de R$200' },
  { icon: CreditCard, text: 'PIX com 10% OFF' },
  { icon: Zap, text: 'Entrega Express' },
]

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [promoIndex, setPromoIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { getItemCount, toggleCart } = useCartStore()
  const { user } = useAuthStore()
  const itemCount = useCartStore((s) => s.getItemCount())

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Rotate promos
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % PROMOS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const PromoIcon = PROMOS[promoIndex].icon

  return (
    <>
      {/* Announcement bar */}
      <div className="relative z-50 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 text-white text-xs sm:text-sm font-medium overflow-hidden">
        <div className="flex items-center justify-center gap-2 py-1.5 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={promoIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <PromoIcon className="h-3.5 w-3.5" />
              <span>{PROMOS[promoIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-dark-950/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-dark-700/50'
            : 'bg-dark-950/60 backdrop-blur-md border-b border-transparent'
        )}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-dark-300 hover:text-white transition-colors"
                aria-label="Abrir menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-display text-xl sm:text-2xl font-bold gradient-text tracking-wider group-hover:opacity-80 transition-opacity">
                  VAPOCRIA
                </span>
              </Link>
            </div>

            {/* Center: Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                      isActive
                        ? 'text-white'
                        : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="hidden sm:block overflow-hidden"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Buscar produtos..."
                      className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500"
                      onBlur={() => setSearchOpen(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setSearchOpen(false)
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setSearchOpen((prev) => !prev)}
                className="p-2 text-dark-300 hover:text-white transition-colors rounded-lg hover:bg-dark-800/50"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* User */}
              <Link
                href={user ? '/conta' : '/login'}
                className="p-2 text-dark-300 hover:text-white transition-colors rounded-lg hover:bg-dark-800/50"
                aria-label={user ? 'Minha conta' : 'Entrar'}
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-dark-300 hover:text-white transition-colors rounded-lg hover:bg-dark-800/50"
                aria-label="Carrinho"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-[10px] font-bold text-white shadow-lg shadow-primary-500/30 animate-pulse-neon"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search bar (visible on small screens when open) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden border-t border-dark-800"
            >
              <div className="px-4 py-3">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  autoFocus
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500"
                  onBlur={() => setSearchOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false)
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[320px] bg-dark-900 border-r border-dark-700/50 shadow-2xl lg:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/50">
                <span className="font-display text-lg font-bold gradient-text tracking-wider">
                  VAPOCRIA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-dark-400 hover:text-white transition-colors rounded-lg hover:bg-dark-800"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {NAV_LINKS.map((link, i) => {
                  const isActive =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href)
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1',
                          isActive
                            ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                            : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
                        )}
                      >
                        {link.label}
                        {isActive && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400" />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Drawer footer */}
              <div className="border-t border-dark-700/50 p-4 space-y-2">
                <Link
                  href={user ? '/conta' : '/login'}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-dark-300 hover:text-white hover:bg-dark-800/60 transition-all"
                >
                  <User className="h-4 w-4" />
                  {user ? 'Minha Conta' : 'Entrar / Cadastrar'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

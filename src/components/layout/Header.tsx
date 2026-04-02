'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Truck,
  Zap,
} from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'

const announcements = [
  { icon: Truck, text: 'Frete Gratis acima de R$200' },
  { icon: Zap, text: 'PIX com 10% de desconto' },
  { icon: null, text: 'Ate 70% OFF em todo o site' },
]

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Vapes', href: '/produtos?categoria=vapes', mega: true },
  { label: 'Cosmeticos', href: '/produtos?categoria=cosmeticos', mega: true },
  { label: 'Oculos & Lupas', href: '/produtos?categoria=oculos-lupas', mega: true },
  { label: 'Ofertas', href: '/produtos?ofertas=true' },
]

const megaMenuData: Record<
  string,
  { title: string; links: { label: string; href: string }[] }[]
> = {
  Vapes: [
    {
      title: 'Categorias',
      links: [
        { label: 'Pods Descartaveis', href: '/produtos?categoria=pods-descartaveis' },
        { label: 'Pods Recarregaveis', href: '/produtos?categoria=pods-recarregaveis' },
        { label: 'Liquidos', href: '/produtos?categoria=liquidos' },
        { label: 'Acessorios', href: '/produtos?categoria=acessorios-vape' },
      ],
    },
    {
      title: 'Marcas Populares',
      links: [
        { label: 'Ignite', href: '/produtos?marca=ignite' },
        { label: 'Elfbar', href: '/produtos?marca=elfbar' },
        { label: 'Lost Mary', href: '/produtos?marca=lost-mary' },
        { label: 'Oxbar', href: '/produtos?marca=oxbar' },
      ],
    },
  ],
  Cosmeticos: [
    {
      title: 'Categorias',
      links: [
        { label: 'Maquiagem', href: '/produtos?categoria=maquiagem' },
        { label: 'Skincare', href: '/produtos?categoria=skincare' },
        { label: 'Cabelos', href: '/produtos?categoria=cabelos' },
        { label: 'Perfumes', href: '/produtos?categoria=perfumes' },
      ],
    },
    {
      title: 'Destaques',
      links: [
        { label: 'Kits Promocionais', href: '/produtos?categoria=kits-cosmeticos' },
        { label: 'Lancamentos', href: '/produtos?categoria=lancamentos-cosmeticos' },
        { label: 'Mais Vendidos', href: '/produtos?categoria=mais-vendidos-cosmeticos' },
      ],
    },
  ],
  'Oculos & Lupas': [
    {
      title: 'Oculos',
      links: [
        { label: 'Oculos de Sol', href: '/produtos?categoria=oculos-sol' },
        { label: 'Oculos de Grau', href: '/produtos?categoria=oculos-grau' },
        { label: 'Armacoes', href: '/produtos?categoria=armacoes' },
      ],
    },
    {
      title: 'Lupas',
      links: [
        { label: 'Lupas de Aumento', href: '/produtos?categoria=lupas-aumento' },
        { label: 'Lupas Profissionais', href: '/produtos?categoria=lupas-profissionais' },
        { label: 'Acessorios', href: '/produtos?categoria=acessorios-oculos' },
      ],
    },
  ],
}

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [announcementIndex, setAnnouncementIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { getItemCount, toggleCart } = useCartStore()
  const { user } = useAuthStore()
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleMenuEnter = (label: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current)
    setActiveMenu(label)
  }

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 150)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/produtos?search=${encodeURIComponent(searchQuery.trim())}`
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href.split('?')[0])
  }

  return (
    <>
      {/* Promo Bar */}
      <div className="relative z-50 overflow-hidden bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700">
        <div className="flex h-9 items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={announcementIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex items-center gap-2 text-xs font-medium tracking-wide text-white sm:text-sm"
            >
              {announcements[announcementIndex].icon && (() => {
                const Icon = announcements[announcementIndex].icon!
                return <Icon className="h-3.5 w-3.5" />
              })()}
              <span>{announcements[announcementIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky Navbar */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b transition-all duration-300',
          scrolled
            ? 'border-dark-800/80 bg-dark-950/90 shadow-lg shadow-black/20 backdrop-blur-xl'
            : 'border-transparent bg-dark-950/60 backdrop-blur-md'
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-brand-gold">
              DECRIA
            </span>
            <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-gold">
              Outlet
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => (link.mega ? handleMenuEnter(link.label) : undefined)}
                onMouseLeave={link.mega ? handleMenuLeave : undefined}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(link.href) ? 'text-white' : 'text-dark-400 hover:text-white'
                  )}
                >
                  {link.label}
                  {link.mega && (
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        activeMenu === link.label ? 'rotate-180 opacity-80' : 'opacity-40'
                      )}
                    />
                  )}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary-500"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>

                {/* Mega Menu */}
                <AnimatePresence>
                  {link.mega && activeMenu === link.label && megaMenuData[link.label] && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute left-0 top-full pt-2"
                      onMouseEnter={() => handleMenuEnter(link.label)}
                      onMouseLeave={handleMenuLeave}
                    >
                      <div className="w-[480px] rounded-xl border border-dark-800 bg-dark-900/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-6">
                          {megaMenuData[link.label].map((section) => (
                            <div key={section.title}>
                              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-400">
                                {section.title}
                              </h4>
                              <ul className="space-y-2">
                                {section.links.map((subLink) => (
                                  <li key={subLink.href}>
                                    <Link
                                      href={subLink.href}
                                      className="block rounded-md px-2 py-1 text-sm text-dark-400 transition-colors hover:bg-dark-800 hover:text-white"
                                    >
                                      {subLink.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.form
                  key="search-form"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  onSubmit={handleSearchSubmit}
                  className="hidden overflow-hidden lg:block"
                >
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar produtos..."
                      className="h-9 w-full rounded-lg border border-dark-700 bg-dark-900 px-3 pr-9 text-sm text-white placeholder-dark-500 outline-none transition-colors focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.button
                  key="search-btn"
                  initial={false}
                  onClick={() => setSearchOpen(true)}
                  className="hidden rounded-lg p-2 text-dark-400 transition-colors hover:bg-dark-800 hover:text-white lg:flex"
                  aria-label="Buscar"
                >
                  <Search className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-lg p-2 text-dark-400 transition-colors hover:bg-dark-800 hover:text-white lg:hidden"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User */}
            <Link
              href={user ? '/conta' : '/auth/login'}
              className="rounded-lg p-2 text-dark-400 transition-colors hover:bg-dark-800 hover:text-white"
              aria-label="Conta"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative rounded-lg p-2 text-dark-400 transition-colors hover:bg-dark-800 hover:text-white"
              aria-label="Carrinho"
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-bold leading-none text-white"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-dark-400 transition-colors hover:bg-dark-800 hover:text-white lg:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>

        {/* Mobile Search Bar (below nav) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-dark-800/50 lg:hidden"
            >
              <form onSubmit={handleSearchSubmit} className="px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar produtos..."
                    autoFocus
                    className="h-10 w-full rounded-lg border border-dark-700 bg-dark-900 pl-10 pr-4 text-sm text-white placeholder-dark-500 outline-none focus:border-primary-500"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[300px] flex-col border-l border-dark-800 bg-dark-950"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-dark-800 px-5 py-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-xl font-bold text-white">DECRIA</span>
                  <span className="font-heading text-[8px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                    Outlet
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-dark-400 transition-colors hover:bg-dark-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="flex-1 overflow-y-auto py-2">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center px-5 py-3 text-sm font-medium transition-colors',
                        isActive(link.href)
                          ? 'border-r-2 border-primary-500 bg-primary-500/5 text-primary-400'
                          : 'text-dark-300 hover:bg-dark-900 hover:text-white'
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.mega && megaMenuData[link.label] && (
                      <div className="border-b border-dark-800/50 pb-2 pl-8 pr-5">
                        {megaMenuData[link.label].map((section) =>
                          section.links.map((subLink) => (
                            <Link
                              key={subLink.href}
                              href={subLink.href}
                              className="block py-1.5 text-xs text-dark-500 transition-colors hover:text-dark-300"
                            >
                              {subLink.label}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-dark-800 p-5">
                <Link
                  href={user ? '/conta' : '/auth/login'}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-dark-300 transition-colors hover:bg-dark-900 hover:text-white"
                >
                  <User className="h-5 w-5" />
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

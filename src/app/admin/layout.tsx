'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Search,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/cupons', label: 'Cupons', icon: Tag },
  { href: '/admin/configuracoes', label: 'Configuracoes', icon: Settings },
]

function getPageTitle(pathname: string): string {
  if (pathname.includes('/dashboard')) return 'Dashboard'
  if (pathname.includes('/produtos/novo')) return 'Novo Produto'
  if (pathname.includes('/produtos/')) return 'Editar Produto'
  if (pathname.includes('/produtos')) return 'Produtos'
  if (pathname.includes('/pedidos/')) return 'Detalhes do Pedido'
  if (pathname.includes('/pedidos')) return 'Pedidos'
  if (pathname.includes('/clientes')) return 'Clientes'
  if (pathname.includes('/cupons')) return 'Cupons'
  if (pathname.includes('/configuracoes')) return 'Configuracoes'
  return 'Admin'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const pageTitle = getPageTitle(pathname)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo - Decria Admin branding */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-dark-800/50">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-purple"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-white font-display text-xs font-bold">D</span>
          </motion.div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-baseline gap-1 whitespace-nowrap overflow-hidden"
              >
                <span className="font-display text-sm font-bold gradient-text">Decria</span>
                <span className="text-brand-gold text-[10px] font-heading tracking-wider uppercase">Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                }`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-500' : 'group-hover:text-primary-400'}`} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-3 py-4 border-t border-dark-800/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-glow-purple">
            <span className="text-white text-xs font-bold">
              {user?.full_name?.charAt(0) || 'A'}
            </span>
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-sm font-medium text-white truncate">
                  {user?.full_name || 'Administrador'}
                </p>
                <p className="text-xs text-dark-400 truncate">
                  {user?.email || 'admin@decria.com'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 p-1.5 rounded-md text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-dark-950 border-r border-dark-800/50"
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-dark-950 border-r border-dark-800/50"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="flex-1 flex flex-col min-h-screen"
        animate={{ marginLeft: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ marginLeft: 0 }}
      >
        <div className="hidden lg:block" />
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800/50 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white font-heading">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-dark-800/50 border border-dark-700/50 rounded-lg">
              <Search className="w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent text-sm text-white placeholder-dark-400 outline-none w-48"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
            </button>

            {/* Admin avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-purple">
              <span className="text-white text-xs font-bold">
                {user?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </motion.div>

      <style jsx global>{`
        @media (min-width: 1024px) {
          .flex-1.flex.flex-col {
            margin-left: ${sidebarOpen ? '256px' : '72px'} !important;
          }
        }
      `}</style>
    </div>
  )
}

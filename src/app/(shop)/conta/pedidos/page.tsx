'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Eye,
  Truck,
  ArrowLeft,
} from 'lucide-react'
import { sampleOrders } from '@/lib/mock-data'
import {
  formatCurrency,
  formatDate,
  getOrderStatusLabel,
  cn,
} from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { OrderStatus } from '@/types'

type FilterTab = 'all' | 'active' | 'delivered' | 'cancelled'

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Em Andamento' },
  { key: 'delivered', label: 'Entregues' },
  { key: 'cancelled', label: 'Cancelados' },
]

const activeStatuses: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
]

function getStatusBadgeTheme(status: OrderStatus) {
  const themes: Record<OrderStatus, string> = {
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    processing: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    shipped: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
    refunded: 'bg-dark-600/40 text-dark-400 border-dark-600/30',
  }
  return themes[status] || 'bg-dark-700 text-dark-300 border-dark-600'
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const filteredOrders = sampleOrders.filter((order) => {
    switch (activeFilter) {
      case 'active':
        return activeStatuses.includes(order.status)
      case 'delivered':
        return order.status === 'delivered'
      case 'cancelled':
        return order.status === 'cancelled' || order.status === 'refunded'
      default:
        return true
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          href="/conta"
          className="lg:hidden p-2 rounded-xl bg-dark-800/60 border border-dark-700/50 text-dark-400 hover:text-dark-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-dark-100 font-heading">Meus Pedidos</h1>
          <p className="text-sm text-dark-400 mt-0.5">
            {sampleOrders.length} pedido{sampleOrders.length !== 1 ? 's' : ''} no total
          </p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
      >
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap',
              'border transition-all duration-200',
              activeFilter === tab.key
                ? 'bg-primary-500/15 text-primary-400 border-primary-500/30 shadow-glow-purple'
                : 'bg-dark-900/60 text-dark-400 border-dark-700/50 hover:border-dark-500 hover:text-dark-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Orders List */}
      <AnimatePresence mode="wait">
        {filteredOrders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              'flex flex-col items-center justify-center py-16 rounded-2xl',
              'bg-dark-900/60 backdrop-blur-xl',
              'border border-dark-700/50'
            )}
          >
            <div className="h-16 w-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-dark-600" />
            </div>
            <p className="text-dark-300 font-medium">
              Nenhum pedido encontrado
            </p>
            <p className="text-dark-500 text-sm mt-1">
              Explore nossos produtos e faca seu primeiro pedido
            </p>
            <Link href="/produtos" className="mt-6">
              <Button variant="primary" size="md">
                Ver Produtos
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                variants={cardVariants}
                layout
                className={cn(
                  'rounded-2xl p-5',
                  'bg-dark-900/60 backdrop-blur-xl',
                  'border border-dark-700/50',
                  'hover:border-dark-600 transition-all duration-300'
                )}
              >
                {/* Order Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-sm font-semibold text-dark-100">
                        Pedido {order.id}
                      </h3>
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border',
                          getStatusBadgeTheme(order.status)
                        )}
                      >
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-xs text-dark-500 mt-1">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-dark-100 whitespace-nowrap">
                    {formatCurrency(order.total)}
                  </p>
                </div>

                {/* Item Thumbnails */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'relative h-14 w-14 shrink-0 rounded-xl overflow-hidden',
                        'bg-dark-800 border border-dark-700/50'
                      )}
                    >
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      {item.quantity > 1 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary-500 text-[9px] font-bold text-white flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="ml-2 text-xs text-dark-500">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} item
                    {order.items.reduce((sum, i) => sum + i.quantity, 0) !== 1
                      ? 's'
                      : ''}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/conta/pedidos/${order.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="h-3.5 w-3.5" />}
                    >
                      Ver Detalhes
                    </Button>
                  </Link>
                  {(order.status === 'shipped' || order.tracking_code) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Truck className="h-3.5 w-3.5" />}
                      onClick={() => {
                        window.open(
                          `https://www.linkcorreios.com.br/?id=${order.tracking_code}`,
                          '_blank'
                        )
                      }}
                    >
                      Rastrear
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

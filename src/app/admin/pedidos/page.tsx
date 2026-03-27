'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye } from 'lucide-react'
import { sampleOrders } from '@/lib/mock-data'
import {
  formatCurrency,
  formatDate,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentStatusLabel,
} from '@/lib/utils'
import type { OrderStatus } from '@/types'

const statusTabs: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Confirmados', value: 'confirmed' },
  { label: 'Enviados', value: 'shipped' },
  { label: 'Entregues', value: 'delivered' },
  { label: 'Cancelados', value: 'cancelled' },
]

export default function AdminPedidos() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let orders = sampleOrders

    if (activeTab !== 'all') {
      orders = orders.filter((o) => o.status === activeTab)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_email.toLowerCase().includes(q)
      )
    }

    return orders
  }, [activeTab, search])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pedidos</h1>
        <p className="text-sm text-dark-400 mt-1">{sampleOrders.length} pedidos no total</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-dark-800/50 border border-dark-700/50 rounded-lg overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`relative px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? 'text-white'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            {activeTab === tab.value && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary-500/20 border border-primary-500/30 rounded-md"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-dark-800/50 border border-dark-700/50 rounded-lg max-w-md">
        <Search className="w-4 h-4 text-dark-400" />
        <input
          type="text"
          placeholder="Buscar por ID do pedido ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-white placeholder-dark-400 outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Pedido</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Cliente</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Itens</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Pagamento</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Total</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Data</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/30">
              <AnimatePresence mode="popLayout">
                {filtered.map((order) => (
                  <motion.tr
                    key={order.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-dark-800/20 transition-colors"
                  >
                    <td className="p-4">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="text-sm font-medium text-primary-400 hover:text-primary-300"
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-white">{order.customer_name}</p>
                        <p className="text-xs text-dark-400">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-dark-300">{order.items.length} item(s)</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-dark-300 capitalize">
                        {getPaymentStatusLabel(order.payment_status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-white">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-dark-400">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/pedidos/${order.id}`}>
                        <button className="p-1.5 rounded-md text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-400 text-sm">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Eye,
  Tag,
} from 'lucide-react'
import { products, sampleOrders } from '@/lib/mock-data'
import {
  formatCurrency,
  formatDate,
  getOrderStatusLabel,
  getOrderStatusColor,
} from '@/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 40
    const stepTime = duration / steps
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(value, Math.round(increment * step))
      setDisplay(current)
      if (step >= steps) {
        setDisplay(value)
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {prefix}
      {display.toLocaleString('pt-BR')}
    </span>
  )
}

const mockChartData = [
  { label: '01', value: 1250 },
  { label: '05', value: 2100 },
  { label: '10', value: 1800 },
  { label: '15', value: 3200 },
  { label: '20', value: 2800 },
  { label: '25', value: 3600 },
  { label: '30', value: 4100 },
]

const maxChartValue = Math.max(...mockChartData.map((d) => d.value))

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Receita Total',
      value: 78432,
      prefix: 'R$ ',
      change: 12.5,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      label: 'Pedidos',
      value: 342,
      prefix: '',
      change: 8.2,
      icon: ShoppingCart,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
      borderColor: 'border-primary-500/20',
    },
    {
      label: 'Produtos',
      value: products.length,
      prefix: '',
      change: 3.1,
      icon: Package,
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-500/10',
      borderColor: 'border-accent-500/20',
    },
    {
      label: 'Clientes',
      value: 1284,
      prefix: '',
      change: -2.4,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
  ]

  const topProducts = products.slice(0, 5).map((p, i) => ({
    product: p,
    unitsSold: [245, 198, 176, 142, 128][i],
    revenue: [245, 198, 176, 142, 128][i] * p.price,
  }))

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.change > 0
          return (
            <motion.div
              key={stat.label}
              variants={item}
              className={`relative overflow-hidden rounded-xl border ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm p-5`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <Icon className="w-full h-full" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-dark-400">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.prefix === 'R$ ' ? (
                  <span>R$ <AnimatedNumber value={stat.value} /></span>
                ) : (
                  <AnimatedNumber value={stat.value} />
                )}
              </div>
              <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{isPositive ? '+' : ''}{stat.change}% vs mês anterior</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts and Quick Actions Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          variants={item}
          className="xl:col-span-2 rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Receita dos últimos 30 dias</h2>
            <span className="text-xs text-dark-400 px-3 py-1 rounded-full bg-dark-800/50 border border-dark-700/50">
              Últimos 30 dias
            </span>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {mockChartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary-500/80 to-primary-400/60 relative group cursor-pointer"
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxChartValue) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                  whileHover={{ opacity: 0.8 }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-dark-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    R$ {d.value.toLocaleString('pt-BR')}
                  </div>
                </motion.div>
                <span className="text-xs text-dark-500">{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={item}
          className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <Link href="/admin/produtos/novo">
              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 hover:bg-primary-500/20 transition-colors cursor-pointer"
                whileHover={{ x: 4 }}
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Novo Produto</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </motion.div>
            </Link>
            <Link href="/admin/pedidos">
              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-400 hover:bg-accent-500/20 transition-colors cursor-pointer"
                whileHover={{ x: 4 }}
              >
                <Eye className="w-5 h-5" />
                <span className="text-sm font-medium">Ver Pedidos</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </motion.div>
            </Link>
            <Link href="/admin/cupons">
              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-colors cursor-pointer"
                whileHover={{ x: 4 }}
              >
                <Tag className="w-5 h-5" />
                <span className="text-sm font-medium">Gerenciar Cupons</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders and Top Products Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          variants={item}
          className="xl:col-span-2 rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Pedidos Recentes</h2>
            <Link
              href="/admin/pedidos"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-dark-700/50">
                  <th className="pb-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Pedido</th>
                  <th className="pb-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Cliente</th>
                  <th className="pb-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Total</th>
                  <th className="pb-3 text-xs font-medium text-dark-400 uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/30">
                {sampleOrders.map((order) => (
                  <tr key={order.id} className="group">
                    <td className="py-3">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="text-sm font-medium text-primary-400 hover:text-primary-300"
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td className="py-3 text-sm text-dark-300">{order.customer_name}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-white font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-3 text-sm text-dark-400">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          variants={item}
          className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Mais Vendidos</h2>
          <div className="space-y-4">
            {topProducts.map(({ product, unitsSold, revenue }, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-dark-500 w-5">{index + 1}.</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-xs text-dark-400">
                    {unitsSold} vendidos &middot; {formatCurrency(revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

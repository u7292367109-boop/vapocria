'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Printer,
  Truck,
  CreditCard,
  MapPin,
  User,
  Package,
  Clock,
  MessageSquare,
  Copy,
} from 'lucide-react'
import { sampleOrders } from '@/lib/mock-data'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentStatusLabel,
  maskCPF,
  maskPhone,
  maskCEP,
} from '@/lib/utils'
import type { OrderStatus } from '@/types'
import toast from 'react-hot-toast'

const allStatuses: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

const timelineEvents = [
  { status: 'pending', label: 'Pedido criado', date: '' },
  { status: 'confirmed', label: 'Pagamento confirmado', date: '' },
  { status: 'processing', label: 'Em processamento', date: '' },
  { status: 'shipped', label: 'Enviado', date: '' },
  { status: 'delivered', label: 'Entregue', date: '' },
]

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const order = sampleOrders.find((o) => o.id === id)

  if (!order) {
    notFound()
  }

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status)
  const [trackingCode, setTrackingCode] = useState(order.tracking_code || '')
  const [notes, setNotes] = useState(order.notes || '')

  const statusIndex = allStatuses.indexOf(currentStatus)

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus)
    toast.success(`Status atualizado para ${getOrderStatusLabel(newStatus)}`)
  }

  const handlePrint = () => {
    window.print()
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id)
    toast.success('ID do pedido copiado!')
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  }

  const addr = order.shipping_address

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/pedidos">
            <button className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Pedido #{order.id}</h1>
              <button onClick={copyOrderId} className="p-1 text-dark-400 hover:text-white transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-dark-400 mt-1">
              Criado em {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(currentStatus)}`}>
            {getOrderStatusLabel(currentStatus)}
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 bg-dark-800/50 border border-dark-700/50 text-dark-300 hover:text-white rounded-lg text-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </motion.div>

      {/* Status Update */}
      <motion.div
        variants={item}
        className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
      >
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-400" />
          Atualizar Status
        </h2>
        <div className="flex flex-wrap gap-2">
          {allStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                currentStatus === status
                  ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                  : 'bg-dark-800/50 border-dark-700/50 text-dark-400 hover:text-white hover:border-dark-600'
              }`}
            >
              {getOrderStatusLabel(status)}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Order Items */}
          <motion.div
            variants={item}
            className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
          >
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary-400" />
              Itens do Pedido
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700/50">
                    <th className="pb-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Produto</th>
                    <th className="pb-3 text-right text-xs font-medium text-dark-400 uppercase tracking-wider">Qtd</th>
                    <th className="pb-3 text-right text-xs font-medium text-dark-400 uppercase tracking-wider">Unit.</th>
                    <th className="pb-3 text-right text-xs font-medium text-dark-400 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800/30">
                  {order.items.map((orderItem) => (
                    <tr key={orderItem.id}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                            <img
                              src={orderItem.product_image}
                              alt={orderItem.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-white">{orderItem.product_name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm text-dark-300">{orderItem.quantity}</td>
                      <td className="py-3 text-right text-sm text-dark-300">{formatCurrency(orderItem.unit_price)}</td>
                      <td className="py-3 text-right text-sm font-medium text-white">{formatCurrency(orderItem.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-dark-700/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Subtotal</span>
                <span className="text-dark-300">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Frete ({order.shipping_method?.toUpperCase() || 'N/A'})</span>
                <span className="text-dark-300">{order.shipping_cost > 0 ? formatCurrency(order.shipping_cost) : 'Grátis'}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Desconto</span>
                  <span className="text-emerald-400">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-dark-700/50">
                <span className="text-white">Total</span>
                <span className="text-white">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            variants={item}
            className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
          >
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-400" />
              Histórico do Pedido
            </h2>
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-dark-700" />
              {timelineEvents.map((event, i) => {
                const eventStatusIndex = allStatuses.indexOf(event.status as OrderStatus)
                const isCompleted = eventStatusIndex <= statusIndex
                const isCurrent = event.status === currentStatus
                return (
                  <div key={event.status} className="relative flex items-start gap-4 pb-6 last:pb-0">
                    <div
                      className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCurrent
                          ? 'bg-primary-500 ring-4 ring-primary-500/20'
                          : isCompleted
                          ? 'bg-primary-500/60'
                          : 'bg-dark-700'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-white' : 'bg-dark-500'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-dark-500'}`}>
                        {event.label}
                      </p>
                      {isCompleted && (
                        <p className="text-xs text-dark-400 mt-0.5">
                          {i === 0 ? formatDateTime(order.created_at) : formatDateTime(order.updated_at)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Tracking and Notes */}
          <motion.div
            variants={item}
            className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
          >
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary-400" />
              Rastreamento e Notas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Código de Rastreamento</label>
                <div className="flex gap-2">
                  <input
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm font-mono outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-colors"
                    placeholder="BR123456789"
                  />
                  <button
                    onClick={() => toast.success('Código de rastreamento salvo!')}
                    className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Notas do Pedido
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm placeholder-dark-500 outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-colors resize-none"
                  placeholder="Adicionar notas internas..."
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <motion.div
            variants={item}
            className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
          >
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-400" />
              Cliente
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-dark-400">Nome</span>
                <p className="text-sm text-white">{order.customer_name}</p>
              </div>
              <div>
                <span className="text-xs text-dark-400">E-mail</span>
                <p className="text-sm text-white">{order.customer_email}</p>
              </div>
              <div>
                <span className="text-xs text-dark-400">Telefone</span>
                <p className="text-sm text-white">{maskPhone(order.customer_phone)}</p>
              </div>
              <div>
                <span className="text-xs text-dark-400">CPF</span>
                <p className="text-sm text-white">{maskCPF(order.customer_cpf)}</p>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            variants={item}
            className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
          >
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-400" />
              Endereço de Entrega
            </h2>
            <div className="text-sm text-dark-300 space-y-1">
              <p className="text-white">
                {addr.street}, {addr.number}
              </p>
              {addr.complement && <p>{addr.complement}</p>}
              <p>{addr.neighborhood}</p>
              <p>
                {addr.city} - {addr.state}
              </p>
              <p>CEP: {maskCEP(addr.zip_code)}</p>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            variants={item}
            className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm p-6"
          >
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary-400" />
              Pagamento
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-dark-400">Método</span>
                <p className="text-sm text-white capitalize">
                  {order.payment_method === 'pix'
                    ? 'PIX'
                    : order.payment_method === 'credit_card'
                    ? 'Cartão de Crédito'
                    : order.payment_method === 'boleto'
                    ? 'Boleto'
                    : order.payment_method || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-xs text-dark-400">Status</span>
                <p className="text-sm text-white">{getPaymentStatusLabel(order.payment_status)}</p>
              </div>
              {order.payment_id && (
                <div>
                  <span className="text-xs text-dark-400">ID do Pagamento</span>
                  <p className="text-sm text-white font-mono">{order.payment_id}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

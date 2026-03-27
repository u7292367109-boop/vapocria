'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Truck,
  Home,
  Clock,
  CreditCard,
  MapPin,
  Copy,
  MessageCircle,
} from 'lucide-react'
import { sampleOrders } from '@/lib/mock-data'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  cn,
} from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { OrderStatus } from '@/types'

const timelineSteps = [
  { key: 'pending', label: 'Pedido', icon: Clock },
  { key: 'confirmed', label: 'Confirmado', icon: CheckCircle2 },
  { key: 'shipped', label: 'Enviado', icon: Truck },
  { key: 'delivered', label: 'Entregue', icon: Home },
] as const

const statusOrder: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
]

function getActiveStepIndex(status: OrderStatus): number {
  if (status === 'cancelled' || status === 'refunded') return -1
  // processing counts as confirmed
  if (status === 'processing') return 1
  const idx = ['pending', 'confirmed', 'shipped', 'delivered'].indexOf(status)
  return idx >= 0 ? idx : 0
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const order = sampleOrders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Package className="h-12 w-12 text-dark-600 mb-4" />
        <p className="text-dark-300 font-medium">Pedido nao encontrado</p>
        <Link href="/conta/pedidos" className="mt-4">
          <Button variant="outline" size="sm">
            Voltar aos Pedidos
          </Button>
        </Link>
      </div>
    )
  }

  const activeStep = getActiveStepIndex(order.status)
  const isCancelled =
    order.status === 'cancelled' || order.status === 'refunded'

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Back Button + Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Link
          href="/conta/pedidos"
          className="p-2 rounded-xl bg-dark-800/60 border border-dark-700/50 text-dark-400 hover:text-dark-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-dark-100">
            Pedido {order.id}
          </h1>
          <p className="text-xs text-dark-500 mt-0.5">
            Realizado em {formatDateTime(order.created_at)}
          </p>
        </div>
      </motion.div>

      {/* Order Status Timeline */}
      <motion.div
        variants={itemVariants}
        className={cn(
          'rounded-2xl p-6',
          'bg-dark-900/60 backdrop-blur-xl',
          'border border-dark-700/50'
        )}
      >
        <h2 className="text-sm font-semibold text-dark-200 mb-6">
          Status do Pedido
        </h2>

        {isCancelled ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-400">
                Pedido {getOrderStatusLabel(order.status)}
              </p>
              <p className="text-xs text-dark-500 mt-0.5">
                Atualizado em {formatDate(order.updated_at)}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-between">
              {timelineSteps.map((step, idx) => {
                const isCompleted = idx <= activeStep
                const isCurrent = idx === activeStep

                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center relative z-10"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.15, duration: 0.3 }}
                      className={cn(
                        'h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center',
                        'border-2 transition-all duration-500',
                        isCompleted
                          ? isCurrent
                            ? 'bg-primary-500/20 border-primary-500 shadow-[0_0_16px_rgba(14,165,233,0.3)]'
                            : 'bg-primary-500 border-primary-500'
                          : 'bg-dark-800 border-dark-600'
                      )}
                    >
                      <step.icon
                        className={cn(
                          'h-4 w-4 sm:h-5 sm:w-5',
                          isCompleted
                            ? isCurrent
                              ? 'text-primary-400'
                              : 'text-white'
                            : 'text-dark-500'
                        )}
                      />
                    </motion.div>
                    <span
                      className={cn(
                        'text-[10px] sm:text-xs mt-2 font-medium',
                        isCompleted ? 'text-primary-400' : 'text-dark-500'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
            {/* Connector lines */}
            <div className="absolute top-5 sm:top-6 left-[12%] right-[12%] h-0.5 bg-dark-700">
              <motion.div
                initial={{ width: '0%' }}
                animate={{
                  width:
                    activeStep <= 0
                      ? '0%'
                      : `${(activeStep / (timelineSteps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Order Info */}
      <motion.div
        variants={itemVariants}
        className={cn(
          'rounded-2xl p-6',
          'bg-dark-900/60 backdrop-blur-xl',
          'border border-dark-700/50'
        )}
      >
        <h2 className="text-sm font-semibold text-dark-200 mb-4">
          Informacoes do Pedido
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-dark-500 uppercase tracking-wider">
              Numero do Pedido
            </p>
            <p className="text-sm text-dark-200 font-mono">{order.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-dark-500 uppercase tracking-wider">
              Data
            </p>
            <p className="text-sm text-dark-200">
              {formatDateTime(order.created_at)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-dark-500 uppercase tracking-wider">
              Pagamento
            </p>
            <div className="flex items-center gap-2">
              <CreditCard className="h-3.5 w-3.5 text-dark-400" />
              <p className="text-sm text-dark-200">
                {order.payment_method === 'pix'
                  ? 'PIX'
                  : order.payment_method === 'credit_card'
                  ? 'Cartao de Credito'
                  : order.payment_method || 'Pendente'}
              </p>
              <span className="text-xs text-dark-500">
                ({getPaymentStatusLabel(order.payment_status)})
              </span>
            </div>
          </div>
          {order.tracking_code && (
            <div className="space-y-1">
              <p className="text-xs text-dark-500 uppercase tracking-wider">
                Codigo de Rastreio
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-primary-400 font-mono">
                  {order.tracking_code}
                </p>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(order.tracking_code || '')
                  }
                  className="p-1 rounded text-dark-500 hover:text-primary-400 transition-colors"
                  title="Copiar codigo"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Items List */}
      <motion.div
        variants={itemVariants}
        className={cn(
          'rounded-2xl p-6',
          'bg-dark-900/60 backdrop-blur-xl',
          'border border-dark-700/50'
        )}
      >
        <h2 className="text-sm font-semibold text-dark-200 mb-4">
          Itens do Pedido
        </h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/40 border border-dark-700/30"
            >
              <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-dark-800">
                <Image
                  src={item.product_image}
                  alt={item.product_name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-200 truncate">
                  {item.product_name}
                </p>
                <p className="text-xs text-dark-500 mt-0.5">
                  Qtd: {item.quantity} x {formatCurrency(item.unit_price)}
                </p>
              </div>
              <p className="text-sm font-semibold text-dark-100 whitespace-nowrap">
                {formatCurrency(item.total_price)}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Delivery Address */}
      <motion.div
        variants={itemVariants}
        className={cn(
          'rounded-2xl p-6',
          'bg-dark-900/60 backdrop-blur-xl',
          'border border-dark-700/50'
        )}
      >
        <h2 className="text-sm font-semibold text-dark-200 mb-4">
          Endereco de Entrega
        </h2>
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
          <div className="text-sm text-dark-300">
            <p>
              {order.shipping_address.street},{' '}
              {order.shipping_address.number}
              {order.shipping_address.complement
                ? ` - ${order.shipping_address.complement}`
                : ''}
            </p>
            <p className="text-dark-500 mt-0.5">
              {order.shipping_address.neighborhood} -{' '}
              {order.shipping_address.city}/{order.shipping_address.state}
            </p>
            <p className="text-dark-500">
              CEP:{' '}
              {order.shipping_address.zip_code.replace(
                /(\d{5})(\d{3})/,
                '$1-$2'
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Order Totals */}
      <motion.div
        variants={itemVariants}
        className={cn(
          'rounded-2xl p-6',
          'bg-dark-900/60 backdrop-blur-xl',
          'border border-dark-700/50'
        )}
      >
        <h2 className="text-sm font-semibold text-dark-200 mb-4">Resumo</h2>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-dark-400">Subtotal</span>
            <span className="text-dark-200">
              {formatCurrency(order.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark-400">Frete</span>
            <span className="text-dark-200">
              {order.shipping_cost > 0
                ? formatCurrency(order.shipping_cost)
                : 'Gratis'}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Desconto</span>
              <span className="text-emerald-400">
                -{formatCurrency(order.discount)}
              </span>
            </div>
          )}
          <div className="border-t border-dark-700/50 pt-2.5 mt-2.5">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-dark-200">Total</span>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        variants={itemVariants}
        className={cn(
          'rounded-2xl p-6',
          'bg-dark-900/60 backdrop-blur-xl',
          'border border-dark-700/50'
        )}
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-accent-500/15 flex items-center justify-center shrink-0">
            <MessageCircle className="h-5 w-5 text-accent-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-dark-200">
              Precisa de ajuda?
            </h3>
            <p className="text-xs text-dark-500 mt-0.5">
              Fale conosco sobre este pedido
            </p>
          </div>
          <Link href="/contato">
            <Button variant="ghost" size="sm">
              Falar Conosco
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

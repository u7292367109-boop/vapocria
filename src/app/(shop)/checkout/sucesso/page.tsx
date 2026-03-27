'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Package, ShoppingBag, Mail, ArrowRight } from 'lucide-react'

function generateOrderNumber() {
  const prefix = 'VP'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export default function CheckoutSucessoPage() {
  const [orderNumber] = useState(generateOrderNumber)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="section-padding py-12 md:py-20 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: -10,
                backgroundColor: [
                  '#0ea5e9',
                  '#d946ef',
                  '#22c55e',
                  '#f59e0b',
                  '#ef4444',
                  '#8b5cf6',
                ][i % 6],
              }}
              initial={{ y: -10, opacity: 1, rotate: 0 }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 50 : 900,
                opacity: [1, 1, 0],
                rotate: Math.random() * 720 - 360,
                x: Math.random() * 200 - 100,
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                delay: Math.random() * 1.5,
                ease: 'easeIn',
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative mx-auto w-28 h-28 mb-8"
        >
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.4 }}
            className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30"
          >
            <CheckCircle2 className="w-14 h-14 text-green-400" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          Pedido Realizado com Sucesso!
        </motion.h1>

        {/* Order Number */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <p className="text-dark-400 text-sm mb-2">Número do pedido</p>
          <div className="inline-flex items-center gap-2 bg-dark-800 border border-dark-600 rounded-xl px-5 py-3">
            <Package className="w-4 h-4 text-primary-400" />
            <span className="font-display text-lg font-bold text-primary-400 tracking-wider">
              {orderNumber}
            </span>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-6 mb-8 text-left space-y-4"
        >
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Confirmação por email</p>
              <p className="text-xs text-dark-400">
                Você receberá um email com os detalhes do pedido e informações de rastreamento.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Acompanhe seu pedido</p>
              <p className="text-xs text-dark-400">
                Acesse sua conta para acompanhar o status da entrega em tempo real.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/conta"
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Package className="w-4 h-4" />
            Acompanhar Pedido
          </Link>
          <Link
            href="/produtos"
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ShoppingBag className="w-4 h-4" />
            Continuar Comprando
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

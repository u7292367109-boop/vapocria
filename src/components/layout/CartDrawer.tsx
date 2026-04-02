'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { formatCurrency } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 200

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getItemCount } =
    useCartStore()

  const subtotal = getSubtotal()
  const itemCount = getItemCount()
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-dark-800 bg-dark-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dark-800 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-primary-400" />
                <h2 className="font-heading text-lg font-semibold text-white">Seu Carrinho</h2>
                {itemCount > 0 && (
                  <span className="rounded-full bg-dark-800 px-2 py-0.5 text-xs font-medium text-dark-400">
                    {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="rounded-lg p-1.5 text-dark-400 transition-colors hover:bg-dark-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty State */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-dark-900">
                  <ShoppingBag className="h-8 w-8 text-dark-600" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-dark-300">Seu carrinho esta vazio</p>
                  <p className="mt-1 text-sm text-dark-600">
                    Explore nossos produtos e encontre ofertas incriveis
                  </p>
                </div>
                <Link
                  href="/produtos"
                  onClick={closeCart}
                  className="mt-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-2.5 text-sm font-semibold text-white transition-all hover:from-primary-500 hover:to-primary-400 hover:shadow-glow-purple"
                >
                  EXPLORAR PRODUTOS
                </Link>
              </div>
            ) : (
              <>
                {/* Free Shipping Progress */}
                <div className="border-b border-dark-800 px-5 py-3">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <p className="text-center text-sm font-medium text-green-400">
                      Voce ganhou frete gratis!
                    </p>
                  ) : (
                    <p className="text-center text-sm text-dark-400">
                      Faltam{' '}
                      <span className="font-semibold text-primary-400">
                        {formatCurrency(remaining)}
                      </span>{' '}
                      para frete gratis
                    </p>
                  )}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-dark-800">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="mb-4"
                      >
                        <div className="flex gap-3 rounded-lg border border-dark-800 bg-dark-900/50 p-3">
                          {/* Thumbnail */}
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-dark-800">
                            <Image
                              src={item.product.thumbnail || '/placeholder.png'}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              {item.product.brand && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-400">
                                  {item.product.brand}
                                </span>
                              )}
                              <h4 className="line-clamp-2 text-sm font-medium leading-tight text-white">
                                {item.product.name}
                              </h4>
                            </div>
                            <div className="flex items-end justify-between">
                              <span className="text-sm font-semibold text-white">
                                {formatCurrency(item.product.price * item.quantity)}
                              </span>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.product.id, item.quantity - 1)
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded border border-dark-700 text-dark-400 transition-colors hover:border-dark-600 hover:text-white"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="flex h-7 w-8 items-center justify-center text-xs font-medium text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.product.id, item.quantity + 1)
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded border border-dark-700 text-dark-400 transition-colors hover:border-dark-600 hover:text-white"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => removeItem(item.product.id)}
                                  className="ml-1 flex h-7 w-7 items-center justify-center rounded text-dark-600 transition-colors hover:text-red-400"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="border-t border-dark-800 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-dark-400">Subtotal</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(subtotal)}</span>
                  </div>

                  <Link
                    href="/carrinho"
                    onClick={closeCart}
                    className="flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-sm font-bold uppercase tracking-wider text-white transition-all hover:from-primary-500 hover:to-primary-400 hover:shadow-glow-purple"
                  >
                    FINALIZAR COMPRA
                  </Link>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-dark-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="text-[11px]">Compra 100% segura e protegida</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

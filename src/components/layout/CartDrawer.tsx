'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { formatCurrency } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 200

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore()

  const subtotal = useCartStore((s) => s.getSubtotal())
  const itemCount = useCartStore((s) => s.getItemCount())
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
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-dark-900 border-l border-dark-700/50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-white">
                  Carrinho
                </h2>
                {itemCount > 0 && (
                  <span className="text-xs font-medium text-dark-400">
                    ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 text-dark-400 hover:text-white transition-colors rounded-lg hover:bg-dark-800"
                aria-label="Fechar carrinho"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-5 py-3 border-b border-dark-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-primary-400" />
                  {remaining > 0 ? (
                    <p className="text-xs text-dark-300">
                      Faltam{' '}
                      <span className="text-primary-400 font-semibold">
                        {formatCurrency(remaining)}
                      </span>{' '}
                      para frete gratis
                    </p>
                  ) : (
                    <p className="text-xs text-green-400 font-semibold">
                      Voce ganhou frete gratis!
                    </p>
                  )}
                </div>
                <div className="h-1.5 w-full rounded-full bg-dark-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      shippingProgress >= 100
                        ? 'bg-gradient-to-r from-green-500 to-green-400'
                        : 'bg-gradient-to-r from-primary-500 to-accent-500'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8 text-dark-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Carrinho vazio
                  </h3>
                  <p className="text-sm text-dark-400 mb-6">
                    Explore nossos produtos e adicione seus favoritos ao
                    carrinho.
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-primary text-sm"
                  >
                    Explorar Produtos
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-dark-700/30">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: 80,
                          transition: { duration: 0.2 },
                        }}
                        className="px-5 py-4"
                      >
                        <div className="flex gap-3">
                          {/* Product image */}
                          <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-dark-800 border border-dark-700/50">
                            <Image
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          {/* Product details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate mb-0.5">
                              {item.product.name}
                            </h4>
                            {item.product.brand && (
                              <p className="text-xs text-dark-400 mb-2">
                                {item.product.brand}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              {/* Quantity controls */}
                              <div className="flex items-center gap-0.5 bg-dark-800 rounded-lg border border-dark-700/50">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-1.5 text-dark-400 hover:text-white transition-colors"
                                  aria-label="Diminuir quantidade"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-7 text-center text-sm font-medium text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="p-1.5 text-dark-400 hover:text-white transition-colors"
                                  aria-label="Aumentar quantidade"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* Price */}
                              <span className="text-sm font-semibold text-primary-400">
                                {formatCurrency(
                                  item.product.price * item.quantity
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="self-start p-1 text-dark-500 hover:text-red-400 transition-colors"
                            aria-label="Remover item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer with totals and actions */}
            {items.length > 0 && (
              <div className="border-t border-dark-700/50 px-5 py-4 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-300">Subtotal</span>
                  <span className="text-lg font-bold text-white">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <Link
                    href="/carrinho"
                    onClick={closeCart}
                    className="btn-primary w-full text-center block text-sm"
                  >
                    Finalizar Compra
                  </Link>
                  <button
                    onClick={closeCart}
                    className="btn-secondary w-full text-sm"
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Lock, CreditCard, Truck, Tag, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cart-store'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { formatCurrency } from '@/lib/utils'
import { products } from '@/lib/mock-data'
import ProductCard from '@/components/shop/ProductCard'

const PIX_DISCOUNT_PERCENT = 10

const recommendedProducts = products.filter((p) => p.is_featured && p.is_active).slice(0, 4)

const shippingOptions = [
  { id: 'pac', label: 'PAC', price: 18.90, days: '8-12 dias úteis' },
  { id: 'sedex', label: 'SEDEX', price: 32.90, days: '3-5 dias úteis' },
]

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getItemCount, clearCart } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [cep, setCep] = useState('')
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null)
  const [shippingCalculated, setShippingCalculated] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const subtotal = getSubtotal()
  const itemCount = getItemCount()
  const shippingCost = selectedShipping ? shippingOptions.find(o => o.id === selectedShipping)?.price || 0 : 0
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0
  const total = subtotal + shippingCost - couponDiscount
  const pixSavings = total * (PIX_DISCOUNT_PERCENT / 100)

  const handleRemoveItem = (productId: string) => {
    setRemovingId(productId)
    setTimeout(() => {
      removeItem(productId)
      setRemovingId(null)
      toast.success('Item removido do carrinho')
    }, 300)
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Digite um cupom')
      return
    }
    if (couponCode.toUpperCase() === 'DECRIA10') {
      const discount = subtotal * 0.1
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount })
      toast.success('Cupom aplicado com sucesso!')
    } else {
      toast.error('Cupom inválido ou expirado')
    }
  }

  const handleCalculateShipping = () => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      toast.error('CEP inválido')
      return
    }
    setShippingCalculated(true)
    toast.success('Frete calculado!')
  }

  const handleCepChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 8)
    if (cleaned.length > 5) {
      setCep(`${cleaned.slice(0, 5)}-${cleaned.slice(5)}`)
    } else {
      setCep(cleaned)
    }
    setShippingCalculated(false)
    setSelectedShipping(null)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center section-padding py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="relative mx-auto w-40 h-40 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-center w-full h-full">
              <ShoppingBag className="w-20 h-20 text-dark-500" strokeWidth={1} />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Seu carrinho está vazio
          </h1>
          <p className="text-dark-400 mb-8">
            Explore nossa coleção de produtos premium e encontre o item perfeito para você.
          </p>
          <Link
            href="/produtos"
            className="btn-primary inline-flex items-center gap-2"
          >
            EXPLORAR PRODUTOS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="section-padding py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Meu Carrinho{' '}
            <span className="text-lg font-normal text-dark-400">
              ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
            </span>
          </h1>
          <button
            onClick={() => {
              clearCart()
              toast.success('Carrinho limpo')
            }}
            className="text-sm text-dark-400 hover:text-red-400 transition-colors"
          >
            Limpar carrinho
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: removingId === item.product.id ? 0 : 1,
                  x: removingId === item.product.id ? -100 : 0,
                  scale: removingId === item.product.id ? 0.95 : 1,
                }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass rounded-2xl p-4 md:p-6"
              >
                <div className="flex gap-4 md:gap-6">
                  {/* Thumbnail */}
                  <Link
                    href={`/produto/${item.product.slug}`}
                    className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-xl bg-dark-800 overflow-hidden relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80px, 112px"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-primary-400 font-medium mb-1">
                          {item.product.brand}
                        </p>
                        <Link
                          href={`/produto/${item.product.slug}`}
                          className="text-sm md:text-base font-semibold text-white hover:text-primary-400 transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="flex-shrink-0 p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.product.id, qty)}
                          min={1}
                          max={item.product.stock_quantity}
                          size="sm"
                        />
                        <span className="text-xs text-dark-500 hidden md:inline">
                          {formatCurrency(item.product.price)} / un.
                        </span>
                      </div>
                      <p className="text-lg font-bold text-white whitespace-nowrap">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="pt-4">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continuar Comprando
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-6">
                Resumo do Pedido
              </h2>

              {/* Subtotal */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>

                {/* Coupon */}
                <div className="pt-3 border-t border-dark-700/50">
                  <label className="text-xs text-dark-400 font-medium mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Cupom de Desconto
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mt-2">
                      <span className="text-green-400 text-sm font-medium">{appliedCoupon.code}</span>
                      <button
                        onClick={() => {
                          setAppliedCoupon(null)
                          setCouponCode('')
                          toast.success('Cupom removido')
                        }}
                        className="text-xs text-dark-400 hover:text-red-400"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="CÓDIGO"
                        className="input-field text-xs py-2 px-3 flex-1"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="btn-secondary text-xs py-2 px-3 whitespace-nowrap"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                </div>

                {/* Shipping */}
                <div className="pt-3 border-t border-dark-700/50">
                  <label className="text-xs text-dark-400 font-medium mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Calcular Frete
                  </label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="00000-000"
                      className="input-field text-xs py-2 px-3 flex-1"
                      maxLength={9}
                    />
                    <button
                      onClick={handleCalculateShipping}
                      className="btn-secondary text-xs py-2 px-3 whitespace-nowrap"
                    >
                      Calcular
                    </button>
                  </div>

                  <AnimatePresence>
                    {shippingCalculated && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2"
                      >
                        {shippingOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedShipping(option.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                              selectedShipping === option.id
                                ? 'border-primary-500/50 bg-primary-500/10'
                                : 'border-dark-600 bg-dark-800/60 hover:border-dark-500'
                            }`}
                          >
                            <div>
                              <p className="text-sm font-medium text-white">{option.label}</p>
                              <p className="text-xs text-dark-400">{option.days}</p>
                            </div>
                            <span className="text-sm font-semibold text-white">
                              {formatCurrency(option.price)}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Discount line */}
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Desconto ({appliedCoupon.code})</span>
                    <span className="text-green-400">-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}

                {/* Shipping line */}
                {selectedShipping && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Frete</span>
                    <span className="text-white">{formatCurrency(shippingCost)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-dark-700/50 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold gradient-text">{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-green-400 mt-1 text-right">
                  Economize {formatCurrency(pixSavings)} com PIX
                </p>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2 text-center text-base font-bold py-4"
              >
                FINALIZAR COMPRA
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Security Badges */}
              <div className="mt-6 pt-4 border-t border-dark-700/50">
                <div className="flex items-center justify-center gap-4 text-dark-400">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5 text-green-400" />
                    <span>SSL Seguro</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    <span>Pagamento Seguro</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-dark-500 bg-dark-800 rounded px-2 py-1">
                    <CreditCard className="w-3 h-3" />
                    Cartão
                  </div>
                  <div className="text-[10px] text-dark-500 bg-dark-800 rounded px-2 py-1">PIX</div>
                  <div className="text-[10px] text-dark-500 bg-dark-800 rounded px-2 py-1">Boleto</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-400" />
          Você também pode gostar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </motion.section>
    </div>
  )
}

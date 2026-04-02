'use client'

import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart-store'
import { formatCurrency, calculateDiscount } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : 0
  const installment = product.price / 12

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(`${product.name} adicionado ao carrinho!`, {
      style: {
        background: '#171717',
        color: '#fff',
        border: '1px solid #262626',
      },
      iconTheme: { primary: '#a855f7', secondary: '#fff' },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/produto/${product.slug}`} className="group block">
        <div className="relative rounded-2xl border border-[#262626] bg-[#141414] overflow-hidden transition-all duration-300 hover:border-[#404040] hover:shadow-card-hover">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Discount badge */}
            {discount > 0 && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold shadow-lg">
                -{discount}%
              </div>
            )}

            {/* Add to cart overlay - desktop */}
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden sm:block">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-heading font-semibold tracking-wide shadow-lg hover:from-purple-500 hover:to-purple-400 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                ADICIONAR
              </motion.button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {/* Brand */}
            <p className="text-xs text-neutral-500 font-heading uppercase tracking-wider mb-1">
              {product.brand}
            </p>

            {/* Name */}
            <h3 className="font-heading font-semibold text-white text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-3">
              {product.compare_at_price && product.compare_at_price > product.price && (
                <p className="text-xs text-neutral-500 line-through">
                  {formatCurrency(product.compare_at_price)}
                </p>
              )}
              <p className="text-lg font-heading font-bold text-purple-400">
                {formatCurrency(product.price)}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                12x de {formatCurrency(installment)}
              </p>
            </div>

            {/* Mobile add button - always visible */}
            <button
              onClick={handleAddToCart}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-heading font-semibold tracking-wide sm:hidden"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              ADICIONAR
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

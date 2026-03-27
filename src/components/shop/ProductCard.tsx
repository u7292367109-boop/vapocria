'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { Product } from '@/types'
import { formatCurrency, calculateDiscount, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  index?: number
  viewMode?: 'grid' | 'list'
}

export default function ProductCard({ product, index = 0, viewMode = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link
          href={`/produto/${product.id}`}
          className="group flex gap-4 sm:gap-6 rounded-2xl bg-dark-900/80 border border-dark-700/50 p-3 sm:p-4 transition-all duration-300 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5"
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-dark-800">
            {discount > 0 && (
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white">
                -{discount}%
              </div>
            )}
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              sizes="144px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div>
              <p className="text-xs text-primary-400 font-medium mb-1">{product.brand}</p>
              <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 group-hover:text-primary-300 transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-dark-400 mt-1 line-clamp-2 hidden sm:block">
                {product.short_description}
              </p>
            </div>
            <div className="flex items-end justify-between mt-2">
              <div>
                {product.compare_at_price && (
                  <span className="text-xs text-dark-500 line-through mr-2">
                    {formatCurrency(product.compare_at_price)}
                  </span>
                )}
                <span className="text-lg font-bold text-white">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold transition-all hover:shadow-lg hover:shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Adicionar
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/produto/${product.id}`}
        className="group block rounded-2xl bg-dark-900/80 border border-dark-700/50 overflow-hidden transition-all duration-300 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1"
      >
        <div className="relative aspect-square overflow-hidden bg-dark-800">
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {discount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white shadow-lg shadow-red-500/30"
              >
                -{discount}%
              </motion.span>
            )}
            {product.is_featured && (
              <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-white">
                Destaque
              </span>
            )}
          </div>

          {product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-medium border border-yellow-500/30">
                Restam {product.stock_quantity}
              </span>
            </div>
          )}

          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-700',
              isHovered ? 'scale-110' : 'scale-100'
            )}
            onLoad={() => setImageLoaded(true)}
          />

          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/20 to-transparent pointer-events-none"
          />

          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-3 left-3 right-3 z-10"
          >
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold transition-all hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.97]"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              ADICIONAR AO CARRINHO
            </button>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-3 right-3 z-10 flex flex-col gap-2"
          >
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-dark-900/80 backdrop-blur-sm text-dark-300 hover:text-red-400 hover:bg-dark-900 transition-all border border-dark-700/50"
              aria-label="Adicionar aos favoritos"
            >
              <Heart className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-dark-900/80 backdrop-blur-sm text-dark-300 hover:text-primary-400 hover:bg-dark-900 transition-all border border-dark-700/50"
              aria-label="Visualizar"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </div>

        <div className="p-3 sm:p-4 space-y-2">
          <p className="text-[10px] sm:text-xs text-primary-400 font-medium uppercase tracking-wider">
            {product.brand}
          </p>

          <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 leading-tight group-hover:text-primary-300 transition-colors">
            {product.name}
          </h3>

          {(product.puff_count || product.nicotine_strength) && (
            <div className="flex items-center gap-2 flex-wrap">
              {product.puff_count && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-800 text-dark-300 border border-dark-700">
                  {product.puff_count.toLocaleString()} puffs
                </span>
              )}
              {product.nicotine_strength && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-800 text-dark-300 border border-dark-700">
                  {product.nicotine_strength}
                </span>
              )}
            </div>
          )}

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg sm:text-xl font-bold text-white">
              {formatCurrency(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-dark-500 line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
          </div>

          <p className="text-[10px] sm:text-xs text-dark-400">
            ou 12x de {formatCurrency(product.price / 12)} sem juros
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

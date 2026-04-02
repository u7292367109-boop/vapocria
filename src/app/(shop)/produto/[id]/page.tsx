'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Star,
  ShoppingCart,
  Zap,
  Truck,
  Shield,
  Share2,
  Heart,
  Copy,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Package,
} from 'lucide-react'
import { products, categories } from '@/lib/mock-data'
import { Product, Review } from '@/types'
import { formatCurrency, calculateDiscount, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import ProductCard from '@/components/shop/ProductCard'
import toast from 'react-hot-toast'

// Mock reviews
const mockReviews: Review[] = [
  {
    id: '1',
    product_id: '1',
    user_id: 'u1',
    user_name: 'Carlos M.',
    rating: 5,
    comment: 'Excelente produto! Sabor muito bom e bateria dura bastante. Recomendo!',
    is_approved: true,
    created_at: '2024-03-01',
  },
  {
    id: '2',
    product_id: '1',
    user_id: 'u2',
    user_name: 'Ana L.',
    rating: 4,
    comment: 'Bom custo-beneficio. O sabor poderia ser um pouco mais intenso, mas no geral e otimo.',
    is_approved: true,
    created_at: '2024-02-20',
  },
  {
    id: '3',
    product_id: '1',
    user_id: 'u3',
    user_name: 'Pedro S.',
    rating: 5,
    comment: 'Melhor descartavel que ja usei. Vou comprar de novo com certeza!',
    is_approved: true,
    created_at: '2024-02-15',
  },
  {
    id: '4',
    product_id: '1',
    user_id: 'u4',
    user_name: 'Mariana R.',
    rating: 4,
    comment: 'Entrega rapida e produto original. Sabor fiel a descricao.',
    is_approved: true,
    created_at: '2024-02-10',
  },
]

const RATING_BREAKDOWN = [
  { stars: 5, count: 42 },
  { stars: 4, count: 18 },
  { stars: 3, count: 5 },
  { stars: 2, count: 2 },
  { stars: 1, count: 1 },
]

export default function ProdutoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  const product = useMemo(() => {
    const id = params.id as string
    return products.find((p) => p.id === id || p.slug === id) || null
  }, [params.id])

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [copied, setCopied] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="h-20 w-20 rounded-full bg-dark-800/60 flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-dark-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Produto nao encontrado</h2>
          <p className="text-dark-400 mb-6">O produto que voce procura nao existe ou foi removido.</p>
          <Link
            href="/produtos"
            className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            Ver Produtos
          </Link>
        </motion.div>
      </div>
    )
  }

  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : 0

  const pixPrice = product.price * 0.9
  const installmentPrice = product.price / 12
  const category = categories.find((c) => c.id === product.category_id)

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category_id === product.category_id && p.is_active)
    .slice(0, 4)

  // Average rating
  const totalReviews = RATING_BREAKDOWN.reduce((sum, r) => sum + r.count, 0)
  const avgRating =
    RATING_BREAKDOWN.reduce((sum, r) => sum + r.stars * r.count, 0) / totalReviews

  const allImages = product.images.length > 0 ? product.images : [product.thumbnail]

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    router.push('/carrinho')
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erro ao copiar link')
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const renderStars = (rating: number, size = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-dark-600'
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Breadcrumbs */}
      <div className="border-b border-dark-800/50">
        <div className="section-padding py-4">
          <nav className="flex items-center gap-2 text-sm text-dark-400 overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <Link href="/produtos" className="hover:text-white transition-colors whitespace-nowrap">
              Produtos
            </Link>
            {category && (
              <>
                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                <Link
                  href={`/produtos?categorias=${category.id}`}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-white font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="section-padding py-6 sm:py-10">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-dark-800 border border-dark-700/50 cursor-crosshair group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Badges */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg shadow-red-500/30">
                    -{discount}% OFF
                  </span>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={allImages[selectedImageIndex]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={cn(
                      'object-cover transition-transform duration-300',
                      isZoomed && 'scale-150'
                    )}
                    style={
                      isZoomed
                        ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                        : undefined
                    }
                  />
                </motion.div>
              </AnimatePresence>

              {/* Zoom indicator */}
              <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-dark-900/80 backdrop-blur-sm text-[10px] text-dark-300 border border-dark-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                Passe o mouse para zoom
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      'relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0',
                      i === selectedImageIndex
                        ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                        : 'border-dark-700/50 hover:border-dark-500 opacity-60 hover:opacity-100'
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Imagem ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Brand */}
            <p className="text-sm text-primary-400 font-medium uppercase tracking-wider">
              {product.brand}
            </p>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              {renderStars(avgRating)}
              <span className="text-sm text-dark-300">
                {avgRating.toFixed(1)} ({totalReviews} avaliacoes)
              </span>
            </div>

            {/* Price */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-primary-400">
                  {formatCurrency(product.price)}
                </span>
                {product.compare_at_price && (
                  <>
                    <span className="text-lg text-dark-500 line-through">
                      {formatCurrency(product.compare_at_price)}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-dark-300">
                ou <span className="text-white font-medium">12x de {formatCurrency(installmentPrice)}</span> sem juros
              </p>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                <Zap className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">
                  {formatCurrency(pixPrice)} no PIX{' '}
                  <span className="text-green-500">(10% OFF)</span>
                </span>
              </div>
            </div>

            {/* Flavor / Variant */}
            {product.flavor && (
              <div>
                <p className="text-sm font-medium text-dark-300 mb-3">
                  Sabor: <span className="text-white">{product.flavor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* Show current flavor as selected, plus some related flavors */}
                  {[product.flavor].map((flavor) => (
                    <button
                      key={flavor}
                      className="px-4 py-2 rounded-xl text-sm font-medium border bg-primary-500/10 text-primary-400 border-primary-500/30"
                    >
                      {flavor}
                    </button>
                  ))}
                  {products
                    .filter(
                      (p) =>
                        p.brand === product.brand &&
                        p.id !== product.id &&
                        p.flavor &&
                        p.category_id === product.category_id
                    )
                    .slice(0, 3)
                    .map((p) => (
                      <Link
                        key={p.id}
                        href={`/produto/${p.id}`}
                        className="px-4 py-2 rounded-xl text-sm font-medium border border-dark-600 text-dark-300 hover:border-dark-400 hover:text-white transition-all"
                      >
                        {p.flavor}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Nicotine Strength */}
            {product.nicotine_strength && (
              <div>
                <p className="text-sm font-medium text-dark-300 mb-3">
                  Nicotina: <span className="text-white">{product.nicotine_strength}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {['20mg', '35mg', '50mg'].map((nic) => (
                    <button
                      key={nic}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                        nic === product.nicotine_strength
                          ? 'bg-primary-500/10 text-primary-400 border-primary-500/30'
                          : 'border-dark-600 text-dark-300 hover:border-dark-400 hover:text-white'
                      )}
                    >
                      {nic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-dark-300 mb-2">Quantidade</p>
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={Math.min(product.stock_quantity, 10)}
                    size="lg"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-base shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                >
                  <ShoppingCart className="h-5 w-5" />
                  ADICIONAR AO CARRINHO
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 sm:flex-none sm:px-8 flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-base hover:shadow-lg hover:shadow-accent-500/25 transition-all"
                >
                  <Zap className="h-5 w-5" />
                  COMPRAR AGORA
                </motion.button>
              </div>
            </div>

            {/* Stock + Shipping */}
            <div className="space-y-3">
              {/* Stock */}
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Em estoque</span>
                <span className="text-xs text-dark-500">
                  ({product.stock_quantity} unidades disponiveis)
                </span>
              </div>

              {/* Shipping */}
              <div className="flex items-center gap-2 text-sm text-dark-300">
                <Truck className="h-4 w-4 text-primary-400" />
                <span>Envio em ate 2 dias uteis</span>
              </div>

              {/* Guarantee */}
              <div className="flex items-center gap-2 text-sm text-dark-300">
                <Shield className="h-4 w-4 text-primary-400" />
                <span>Garantia de produto original</span>
              </div>
            </div>

            {/* Share + Favorite */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-600 text-sm text-dark-300 hover:text-white hover:border-dark-500 transition-all"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {copied ? 'Copiado!' : 'Compartilhar'}
              </button>
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all',
                  isFavorited
                    ? 'border-red-500/30 text-red-400 bg-red-500/10'
                    : 'border-dark-600 text-dark-300 hover:text-white hover:border-dark-500'
                )}
              >
                <Heart
                  className={cn('h-4 w-4', isFavorited && 'fill-red-400')}
                />
                Favoritar
              </button>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 sm:mt-16"
        >
          {/* Tab headers */}
          <div className="flex items-center gap-1 border-b border-dark-700/50 overflow-x-auto no-scrollbar">
            {[
              { key: 'description' as const, label: 'Descricao' },
              { key: 'specs' as const, label: 'Especificacoes' },
              { key: 'reviews' as const, label: `Avaliacoes (${totalReviews})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.key ? 'text-white' : 'text-dark-400 hover:text-white'
                )}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="product-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass rounded-2xl p-6 sm:p-8"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Sobre o {product.name}
                  </h3>
                  <p className="text-dark-300 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                  {product.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-dark-800 text-xs text-dark-400 border border-dark-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  <table className="w-full">
                    <tbody>
                      {[
                        { label: 'Marca', value: product.brand },
                        { label: 'SKU', value: product.sku },
                        product.puff_count && {
                          label: 'Puffs',
                          value: product.puff_count.toLocaleString(),
                        },
                        product.battery_capacity && {
                          label: 'Bateria',
                          value: product.battery_capacity,
                        },
                        product.volume && { label: 'Volume', value: product.volume },
                        product.nicotine_strength && {
                          label: 'Nicotina',
                          value: product.nicotine_strength,
                        },
                        product.flavor && { label: 'Sabor', value: product.flavor },
                        product.weight && {
                          label: 'Peso',
                          value: `${product.weight}g`,
                        },
                        product.dimensions && {
                          label: 'Dimensoes',
                          value: product.dimensions,
                        },
                      ]
                        .filter(Boolean)
                        .map((spec, i) => (
                          <tr
                            key={i}
                            className={cn(
                              'border-b border-dark-700/30 last:border-0',
                              i % 2 === 0 ? 'bg-dark-800/30' : ''
                            )}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-dark-300 w-1/3">
                              {(spec as { label: string; value: string }).label}
                            </td>
                            <td className="px-6 py-4 text-sm text-white">
                              {(spec as { label: string; value: string }).value}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Ratings breakdown */}
                  <div className="glass rounded-2xl p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-8">
                      {/* Average */}
                      <div className="text-center sm:text-left">
                        <div className="text-5xl font-bold text-white mb-2">
                          {avgRating.toFixed(1)}
                        </div>
                        {renderStars(avgRating, 'lg')}
                        <p className="text-sm text-dark-400 mt-2">
                          {totalReviews} avaliacoes
                        </p>
                      </div>

                      {/* Bars */}
                      <div className="flex-1 space-y-2">
                        {RATING_BREAKDOWN.map((r) => {
                          const percentage =
                            totalReviews > 0 ? (r.count / totalReviews) * 100 : 0
                          return (
                            <div key={r.stars} className="flex items-center gap-3">
                              <span className="text-sm text-dark-400 w-12 text-right">
                                {r.stars} {r.stars === 1 ? 'star' : 'stars'}
                              </span>
                              <div className="flex-1 h-2 rounded-full bg-dark-700 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.8, delay: 0.1 * r.stars }}
                                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                                />
                              </div>
                              <span className="text-sm text-dark-500 w-8">
                                {r.count}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Individual reviews */}
                  <div className="space-y-4">
                    {mockReviews.map((review, i) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="glass rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                              {review.user_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {review.user_name}
                              </p>
                              <p className="text-xs text-dark-500">
                                {new Date(review.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-dark-300 leading-relaxed">
                          {review.comment}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 sm:mt-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Produtos{' '}
                <span className="gradient-text">Relacionados</span>
              </h2>
              <Link
                href="/produtos"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium"
              >
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}

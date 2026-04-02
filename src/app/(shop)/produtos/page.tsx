'use client'

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  ChevronDown,
  Package,
} from 'lucide-react'
import { products, categories } from '@/lib/mock-data'
import ProductCard from '@/components/shop/ProductCard'
import { cn, formatCurrency } from '@/lib/utils'

const ITEMS_PER_PAGE = 12

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'price_asc', label: 'Menor Preço' },
  { value: 'price_desc', label: 'Maior Preço' },
  { value: 'popular', label: 'Mais Populares' },
]

const PARENT_CATEGORIES = categories.filter((c) => c.parent_id === null)

const BRANDS = Array.from(new Set(products.map((p) => p.brand))).sort()

function ProdutosPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Filter state from URL
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const c = searchParams.get('categorias')
    return c ? c.split(',') : []
  })
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const b = searchParams.get('marcas')
    return b ? b.split(',') : []
  })
  const [minPrice, setMinPrice] = useState<string>(() => searchParams.get('min') || '')
  const [maxPrice, setMaxPrice] = useState<string>(() => searchParams.get('max') || '')
  const [sortBy, setSortBy] = useState(() => searchParams.get('ordenar') || 'newest')
  const [currentPage, setCurrentPage] = useState(() => {
    const p = searchParams.get('pagina')
    return p ? parseInt(p) : 1
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  // Collapsible filter sections
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    price: true,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Sync URL params
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedCategories.length) params.set('categorias', selectedCategories.join(','))
    if (selectedBrands.length) params.set('marcas', selectedBrands.join(','))
    if (minPrice) params.set('min', minPrice)
    if (maxPrice) params.set('max', maxPrice)
    if (sortBy !== 'newest') params.set('ordenar', sortBy)
    if (currentPage > 1) params.set('pagina', String(currentPage))
    const qs = params.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [selectedCategories, selectedBrands, minPrice, maxPrice, sortBy, currentPage, router, pathname])

  useEffect(() => {
    updateURL()
  }, [updateURL])

  // Apply filters
  const filteredProducts = useMemo(() => {
    let result = [...products].filter((p) => p.is_active)

    if (selectedCategories.length > 0) {
      result = result.filter((p) => p.category_id && selectedCategories.includes(p.category_id))
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand))
    }
    if (minPrice) {
      result = result.filter((p) => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(maxPrice))
    }
    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    return result
  }, [selectedCategories, selectedBrands, minPrice, maxPrice, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Active filter tags
  const activeFilters = useMemo(() => {
    const tags: { key: string; label: string; onRemove: () => void }[] = []
    selectedCategories.forEach((catId) => {
      const cat = categories.find((c) => c.id === catId)
      if (cat) {
        tags.push({
          key: `cat-${catId}`,
          label: cat.name,
          onRemove: () => setSelectedCategories((prev) => prev.filter((id) => id !== catId)),
        })
      }
    })
    selectedBrands.forEach((brand) => {
      tags.push({
        key: `brand-${brand}`,
        label: brand,
        onRemove: () => setSelectedBrands((prev) => prev.filter((b) => b !== brand)),
      })
    })
    if (minPrice || maxPrice) {
      const label = minPrice && maxPrice
        ? `${formatCurrency(parseFloat(minPrice))} - ${formatCurrency(parseFloat(maxPrice))}`
        : minPrice
          ? `A partir de ${formatCurrency(parseFloat(minPrice))}`
          : `Ate ${formatCurrency(parseFloat(maxPrice!))}`
      tags.push({
        key: 'price',
        label,
        onRemove: () => { setMinPrice(''); setMaxPrice('') },
      })
    }
    return tags
  }, [selectedCategories, selectedBrands, minPrice, maxPrice])

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setMinPrice('')
    setMaxPrice('')
    setCurrentPage(1)
  }

  const hasFilters = activeFilters.length > 0

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    )
    setCurrentPage(1)
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
    setCurrentPage(1)
  }

  // Filter sidebar content (shared between desktop and mobile)
  const filterContent = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-sm font-semibold text-white mb-3"
        >
          Categorias
          <ChevronDown
            className={cn('h-4 w-4 text-dark-400 transition-transform', openSections.category && 'rotate-180')}
          />
        </button>
        <AnimatePresence>
          {openSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {PARENT_CATEGORIES.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={cn(
                        'h-4 w-4 rounded border flex items-center justify-center transition-all',
                        selectedCategories.includes(cat.id)
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-dark-600 group-hover:border-dark-400'
                      )}
                    >
                      {selectedCategories.includes(cat.id) && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-dark-300 group-hover:text-white transition-colors flex-1">
                      {cat.name}
                    </span>
                    <span className="text-xs text-dark-500">{cat.product_count}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="border-t border-dark-700/50" />

      {/* Brand Filter */}
      <div>
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full text-sm font-semibold text-white mb-3"
        >
          Marcas
          <ChevronDown
            className={cn('h-4 w-4 text-dark-400 transition-transform', openSections.brand && 'rotate-180')}
          />
        </button>
        <AnimatePresence>
          {openSections.brand && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {BRANDS.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={cn(
                        'h-4 w-4 rounded border flex items-center justify-center transition-all',
                        selectedBrands.includes(brand)
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-dark-600 group-hover:border-dark-400'
                      )}
                    >
                      {selectedBrands.includes(brand) && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="border-t border-dark-700/50" />

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-sm font-semibold text-white mb-3"
        >
          Faixa de Preço
          <ChevronDown
            className={cn('h-4 w-4 text-dark-400 transition-transform', openSections.price && 'rotate-180')}
          />
        </button>
        <AnimatePresence>
          {openSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1) }}
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  />
                </div>
                <span className="text-dark-500 text-sm">-</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1) }}
                    className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <>
          <div className="border-t border-dark-700/50" />
          <button
            onClick={clearAllFilters}
            className="w-full py-2.5 rounded-xl border border-dark-600 text-sm text-dark-300 hover:text-white hover:border-dark-500 transition-all"
          >
            Limpar Filtros
          </button>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header area */}
      <div className="border-b border-dark-800/50">
        <div className="section-padding py-6 sm:py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-dark-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white font-medium">Produtos</span>
          </nav>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold"
          >
            Nossos{' '}
            <span className="gradient-text">Produtos</span>
          </motion.h1>
        </div>
      </div>

      <div className="section-padding py-6 sm:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden lg:block w-64 xl:w-72 flex-shrink-0"
          >
            <div className="sticky top-24 glass rounded-2xl p-5">
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary-400" />
                Filtros
              </h2>
              {filterContent}
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-800 border border-dark-600 text-sm text-dark-300 hover:text-white hover:border-dark-500 transition-all"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                  {hasFilters && (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary-500 text-[10px] font-bold text-white">
                      {activeFilters.length}
                    </span>
                  )}
                </button>

                {/* Results count */}
                <p className="text-sm text-dark-400">
                  Exibindo{' '}
                  <span className="text-white font-medium">
                    {Math.min(paginatedProducts.length, ITEMS_PER_PAGE)}
                  </span>{' '}
                  de{' '}
                  <span className="text-white font-medium">{filteredProducts.length}</span>{' '}
                  produtos
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Sort */}
                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center justify-between gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-dark-800 border border-dark-600 text-sm text-dark-300 hover:text-white hover:border-dark-500 transition-all min-w-[180px]"
                  >
                    <span>{SORT_OPTIONS.find((o) => o.value === sortBy)?.label}</span>
                    <ChevronDown className={cn('h-4 w-4 transition-transform', sortOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-full min-w-[180px] glass rounded-xl overflow-hidden z-30 shadow-xl"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value)
                              setSortOpen(false)
                              setCurrentPage(1)
                            }}
                            className={cn(
                              'w-full text-left px-4 py-2.5 text-sm transition-colors',
                              sortBy === option.value
                                ? 'bg-primary-500/10 text-primary-400'
                                : 'text-dark-300 hover:text-white hover:bg-dark-800'
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* View toggle */}
                <div className="flex items-center rounded-xl border border-dark-600 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2.5 transition-colors',
                      viewMode === 'grid'
                        ? 'bg-primary-500/10 text-primary-400'
                        : 'text-dark-400 hover:text-white'
                    )}
                    aria-label="Visualizar em grade"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2.5 transition-colors',
                      viewMode === 'list'
                        ? 'bg-primary-500/10 text-primary-400'
                        : 'text-dark-400 hover:text-white'
                    )}
                    aria-label="Visualizar em lista"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Active filter tags */}
            <AnimatePresence>
              {hasFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeFilters.map((filter) => (
                      <motion.button
                        key={filter.key}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={filter.onRemove}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium border border-primary-500/20 hover:bg-primary-500/20 transition-colors"
                      >
                        {filter.label}
                        <X className="h-3 w-3" />
                      </motion.button>
                    ))}
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-dark-400 hover:text-white transition-colors underline underline-offset-2"
                    >
                      Limpar tudo
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product grid / list */}
            {paginatedProducts.length > 0 ? (
              <div
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
                    : 'flex flex-col gap-4'
                )}
              >
                {paginatedProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="h-20 w-20 rounded-full bg-dark-800/60 flex items-center justify-center mb-6">
                  <Package className="h-10 w-10 text-dark-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-dark-400 text-sm mb-6 max-w-md">
                  Tente ajustar os filtros ou buscar por outros termos para encontrar o que procura.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary-500/25"
                >
                  Limpar Filtros
                </button>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 mt-10"
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'h-10 w-10 rounded-lg text-sm font-medium transition-all',
                      page === currentPage
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
                        : 'text-dark-300 hover:text-white hover:bg-dark-800'
                    )}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Proximo
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[300px] sm:w-[340px] bg-dark-900 border-r border-dark-700/50 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/50">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary-400" />
                  Filtros
                </h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="p-1.5 text-dark-400 hover:text-white transition-colors rounded-lg hover:bg-dark-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                {filterContent}
              </div>
              <div className="border-t border-dark-700/50 p-4">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary-500/25"
                >
                  Ver {filteredProducts.length} Resultados
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Close sort dropdown on click outside */}
      {sortOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setSortOpen(false)}
        />
      )}
    </div>
  )
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProdutosPageContent />
    </Suspense>
  )
}

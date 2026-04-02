'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import { products } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const ITEMS_PER_PAGE = 6

export default function AdminProdutos() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [productStates, setProductStates] = useState<Record<string, boolean>>(
    Object.fromEntries(products.map((p) => [p.id, p.is_active]))
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    )
  }, [search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const allSelected = paginated.length > 0 && paginated.every((p) => selectedIds.includes(p.id))

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !paginated.some((p) => p.id === id)))
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...paginated.map((p) => p.id)])))
    }
  }

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleActive = (id: string) => {
    setProductStates((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">Produtos</h1>
          <p className="text-sm text-dark-400 mt-1">{products.length} produtos cadastrados</p>
        </div>
        <Link href="/admin/produtos/novo">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-lg text-sm font-medium transition-all shadow-glow-purple"
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </motion.button>
        </Link>
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-dark-800/50 border border-dark-700/50 rounded-lg">
          <Search className="w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Buscar por nome, SKU ou marca..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent text-sm text-white placeholder-dark-400 outline-none w-full"
          />
        </div>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-dark-400">{selectedIds.length} selecionados</span>
            <button className="px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm hover:bg-red-500/20 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-dark-800/50 bg-dark-800/30 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500/20"
                  />
                </th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Imagem</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Nome</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">SKU</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Preco</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Estoque</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/30">
              {paginated.map((product) => {
                const isLowStock = product.stock_quantity <= product.low_stock_threshold
                const isActive = productStates[product.id] ?? product.is_active
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-dark-800/20 transition-colors"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleOne(product.id)}
                        className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500/20"
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-700">
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-dark-400">{product.brand}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-dark-300 font-mono">{product.sku}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-white">{formatCurrency(product.price)}</p>
                        {product.compare_at_price && (
                          <p className="text-xs text-dark-500 line-through">
                            {formatCurrency(product.compare_at_price)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isLowStock ? 'text-red-400' : 'text-white'}`}>
                          {product.stock_quantity}
                        </span>
                        {isLowStock && (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleActive(product.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          isActive ? 'bg-primary-500' : 'bg-dark-600'
                        }`}
                      >
                        <motion.div
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                          animate={{ left: isActive ? 21 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/produtos/${product.id}`}>
                          <button className="p-1.5 rounded-md text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-md text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-dark-700/50">
            <span className="text-sm text-dark-400">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md text-dark-400 hover:text-white hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary-500 text-white'
                      : 'text-dark-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md text-dark-400 hover:text-white hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

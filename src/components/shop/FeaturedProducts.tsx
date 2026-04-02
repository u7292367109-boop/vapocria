'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { products } from '@/lib/mock-data'
import ProductCard from './ProductCard'

const tabs = [
  { label: 'Todos', categoryId: null },
  { label: 'Vapes', categoryId: '1' },
  { label: 'Cosméticos', categoryId: '2' },
  { label: 'Óculos', categoryId: '3' },
]

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const featured = products.filter((p) => p.is_featured && p.is_active)
  const filtered = activeTab
    ? featured.filter((p) => p.category_id === activeTab)
    : featured

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Mais Vendidos
          </h2>
          <div className="mt-3 mx-auto w-16 h-px bg-brand-gold" />
        </motion.div>

        {/* Tab pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-10 flex-wrap"
        >
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.categoryId)}
              className={`px-5 py-2 rounded-full text-sm font-heading font-medium transition-all duration-300 ${
                activeTab === tab.categoryId
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-glow-purple'
                  : 'bg-[#141414] text-neutral-400 border border-[#262626] hover:border-[#404040] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab || 'all'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link href="/produtos">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 rounded-xl border border-[#404040] text-neutral-300 font-heading font-semibold text-sm tracking-wider hover:border-purple-500/50 hover:text-white transition-all duration-300"
            >
              Ver Todos os Produtos
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

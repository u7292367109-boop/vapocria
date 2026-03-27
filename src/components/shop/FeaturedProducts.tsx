'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { products } from '@/lib/mock-data'
import ProductCard from './ProductCard'

export default function FeaturedProducts() {
  const featuredProducts = products.filter((p) => p.is_featured)

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Subtle background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-5 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }}
      />

      <div className="section-padding relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Produtos em{' '}
            <span className="gradient-text">Destaque</span>
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mb-4" />
          <p className="text-dark-400 max-w-lg mx-auto">
            Os mais vendidos e mais bem avaliados pelos nossos clientes
          </p>
        </motion.div>

        {/* Products grid */}
        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/produtos">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(14,165,233,0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2"
            >
              Ver Todos os Produtos
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

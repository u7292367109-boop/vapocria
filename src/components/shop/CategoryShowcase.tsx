'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wind, Battery, Droplets, Package, Wrench, Cpu } from 'lucide-react'
import { categories } from '@/lib/mock-data'

const categoryIcons: Record<string, React.ElementType> = {
  descartaveis: Wind,
  pods: Battery,
  juices: Droplets,
  kits: Package,
  acessorios: Wrench,
  coils: Cpu,
}

const categoryGradients: Record<string, string> = {
  descartaveis: 'from-primary-500/20 to-blue-600/20',
  pods: 'from-accent-500/20 to-purple-600/20',
  juices: 'from-green-500/20 to-emerald-600/20',
  kits: 'from-orange-500/20 to-amber-600/20',
  acessorios: 'from-pink-500/20 to-rose-600/20',
  coils: 'from-cyan-500/20 to-teal-600/20',
}

export default function CategoryShowcase() {
  return (
    <section className="py-20 relative">
      <div className="section-padding">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Explore por{' '}
            <span className="gradient-text">Categoria</span>
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mb-4" />
          <p className="text-dark-400 max-w-lg mx-auto">
            Encontre exatamente o que voce procura
          </p>
        </motion.div>

        {/* Categories - horizontal scroll on mobile, grid on desktop */}
        <div className="flex lg:grid lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto no-scrollbar pb-4 lg:pb-0 snap-x snap-mandatory">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.slug] || Package
            const gradient = categoryGradients[category.slug] || 'from-primary-500/20 to-accent-500/20'

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="snap-start flex-shrink-0 w-[160px] sm:w-[200px] lg:w-auto"
              >
                <Link href={`/produtos?categoria=${category.slug}`}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      borderColor: 'rgba(14,165,233,0.5)',
                      boxShadow: '0 0 25px rgba(14,165,233,0.15)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative glass rounded-2xl p-6 text-center cursor-pointer group overflow-hidden h-full"
                    style={{ border: '1px solid rgba(148,163,184,0.08)' }}
                  >
                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center mb-4 group-hover:from-primary-500/20 group-hover:to-accent-500/20 transition-colors">
                        <Icon className="w-7 h-7 text-primary-400 group-hover:text-primary-300 transition-colors" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-primary-300 transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-dark-500 text-xs">
                        {category.product_count} produtos
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Wind, Sparkles, Glasses } from 'lucide-react'
import Link from 'next/link'
import { categories } from '@/lib/mock-data'

const categoryConfig = [
  {
    slug: 'vapes',
    icon: Wind,
    gradient: 'from-purple-600/30 via-purple-900/20 to-transparent',
    accentColor: 'text-purple-400',
    borderHover: 'hover:border-purple-500/50',
    glowHover: 'hover:shadow-glow-purple',
  },
  {
    slug: 'cosmeticos',
    icon: Sparkles,
    gradient: 'from-pink-600/30 via-pink-900/20 to-transparent',
    accentColor: 'text-pink-400',
    borderHover: 'hover:border-pink-500/50',
    glowHover: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]',
  },
  {
    slug: 'oculos-lupas',
    icon: Glasses,
    gradient: 'from-amber-600/30 via-amber-900/20 to-transparent',
    accentColor: 'text-brand-gold',
    borderHover: 'hover:border-brand-gold/50',
    glowHover: 'hover:shadow-glow-gold',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function CategoryShowcase() {
  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Categorias
          </h2>
          <div className="mt-3 mx-auto w-16 h-px bg-brand-gold" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {categoryConfig.map((config) => {
            const cat = categories.find((c) => c.slug === config.slug)
            if (!cat) return null
            const Icon = config.icon

            return (
              <motion.div key={cat.id} variants={cardVariants}>
                <Link href={`/produtos?categoria=${cat.slug}`}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className={`group relative overflow-hidden rounded-2xl border border-[#262626] bg-[#141414] p-8 min-h-[220px] flex flex-col justify-end transition-all duration-300 ${config.borderHover} ${config.glowHover} cursor-pointer`}
                  >
                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <Icon className={`w-10 h-10 ${config.accentColor} mb-4`} />
                      <h3 className="font-display text-2xl font-bold text-white mb-1">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-neutral-400 mb-4">
                        {cat.product_count} produtos
                      </p>
                      <span
                        className={`inline-flex items-center text-sm font-heading font-medium ${config.accentColor} group-hover:gap-2 transition-all duration-300`}
                      >
                        Ver Mais
                        <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

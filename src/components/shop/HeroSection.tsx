'use client'

import { motion } from 'framer-motion'
import { Wind, Sparkles, Glasses, Truck, CreditCard, Clock, QrCode } from 'lucide-react'
import Link from 'next/link'

const categoryPreviews = [
  {
    name: 'Vapes',
    icon: Wind,
    href: '/produtos?categoria=vapes',
    description: 'Descartáveis & Pods',
    color: 'from-purple-500/20 to-purple-900/10',
    borderColor: 'hover:border-purple-500/40',
    iconColor: 'text-purple-400',
  },
  {
    name: 'Cosméticos',
    icon: Sparkles,
    href: '/produtos?categoria=cosmeticos',
    description: 'Skincare & Maquiagem',
    color: 'from-pink-500/20 to-pink-900/10',
    borderColor: 'hover:border-pink-500/40',
    iconColor: 'text-pink-400',
  },
  {
    name: 'Óculos',
    icon: Glasses,
    href: '/produtos?categoria=oculos-lupas',
    description: 'Sol, Grau & Lupas',
    color: 'from-amber-500/20 to-amber-900/10',
    borderColor: 'hover:border-amber-500/40',
    iconColor: 'text-brand-gold',
  },
]

const trustItems = [
  { icon: Truck, label: 'Frete Grátis +R$200' },
  { icon: QrCode, label: 'PIX 10% OFF' },
  { icon: CreditCard, label: '12x Sem Juros' },
  { icon: Clock, label: 'Entrega Rápida' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(126,34,206,0.1) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[30%] right-[20%] w-[35%] h-[35%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Brand heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          >
            <span
              className="inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #D4AF37 0%, #F5E6B8 25%, #D4AF37 50%, #F5E6B8 75%, #D4AF37 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite',
              }}
            >
              DECRIA OUTLET
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-neutral-400 tracking-[0.25em] uppercase font-heading font-light"
          >
            Vapes
            <span className="inline-block mx-4 w-px h-4 bg-neutral-600 align-middle" />
            Cosméticos
            <span className="inline-block mx-4 w-px h-4 bg-neutral-600 align-middle" />
            Óculos
          </motion.p>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-2xl sm:text-3xl md:text-4xl font-heading font-semibold text-white"
          >
            Até{' '}
            <span className="bg-gradient-to-r from-purple-400 to-accent-500 bg-clip-text text-transparent">
              70% OFF
            </span>{' '}
            nos melhores produtos
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/produtos">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-heading font-semibold text-sm tracking-wider shadow-glow-purple transition-shadow hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                EXPLORAR OFERTAS
              </motion.button>
            </Link>
            <Link href="/produtos?sort=newest">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl border border-neutral-600 text-neutral-300 font-heading font-semibold text-sm tracking-wider hover:border-neutral-400 hover:text-white transition-colors"
              >
                NOVIDADES
              </motion.button>
            </Link>
          </motion.div>

          {/* Category preview cards */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {categoryPreviews.map((cat) => (
              <Link key={cat.name} href={cat.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`group relative p-6 rounded-2xl bg-gradient-to-br ${cat.color} border border-[#262626] ${cat.borderColor} transition-all duration-300 cursor-pointer`}
                >
                  <cat.icon className={`w-8 h-8 ${cat.iconColor} mb-3 mx-auto`} />
                  <h3 className="font-heading font-semibold text-white text-lg">{cat.name}</h3>
                  <p className="text-sm text-neutral-500 mt-1">{cat.description}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Trust bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10 border-t border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-2 text-neutral-400">
                <item.icon className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span className="text-xs sm:text-sm font-heading font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

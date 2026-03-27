'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, Truck, CreditCard, QrCode, ShieldCheck, Star, Users, Package } from 'lucide-react'

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  return (
    <span>{target}{suffix}</span>
  )
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const trustBadges = [
    { icon: Truck, label: 'Envio Rapido' },
    { icon: CreditCard, label: '12x Sem Juros' },
    { icon: QrCode, label: 'PIX 10% OFF' },
    { icon: ShieldCheck, label: 'Garantia' },
  ]

  const stats = [
    { icon: Users, value: '+10.000', label: 'Clientes' },
    { icon: Package, value: '+500', label: 'Produtos' },
    { icon: Star, value: '4.9', label: 'Avaliacao' },
  ]

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(14,165,233,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(217,70,239,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #d946ef, transparent)' }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0
                ? 'rgba(14,165,233,0.6)'
                : 'rgba(217,70,239,0.5)',
            }}
            animate={{
              y: [0, -(Math.random() * 200 + 100)],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Smoke / mist effect via CSS */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-0 right-0 h-64 opacity-30"
          style={{
            background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-40 opacity-10"
          style={{
            background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 800 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.02\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
            animation: 'smokeFlow 20s linear infinite',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes smokeFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 section-padding w-full py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-32">
          {/* Left column - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-block mb-6">
              <span className="glass px-4 py-2 rounded-full text-sm font-medium text-primary-400 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                Fornecedor Top 1 do Brasil
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            >
              <span className="gradient-text neon-text" style={{ filter: 'drop-shadow(0 0 30px rgba(14,165,233,0.4))' }}>
                Vapocria
              </span>
            </motion.h1>

            {/* Subheadline with typing effect */}
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-dark-200">
                <span className="text-primary-400">Fornecedor</span>{' '}
                <span className="text-accent-400">Top 1</span>{' '}
                <span className="text-dark-300">do Brasil</span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-dark-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Descubra o melhor em vaporizadores, pods e acessorios premium.
              Qualidade garantida, precos imbativeis e entrega rapida para todo o Brasil.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Link href="/produtos">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(14,165,233,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  Ver Produtos
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </Link>
              <Link href="/produtos?ofertas=true">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 25px rgba(217,70,239,0.3)',
                    borderColor: 'rgba(217,70,239,0.6)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline text-lg px-8 py-4 w-full sm:w-auto border-accent-500/50 text-accent-400 hover:bg-accent-500/10"
                >
                  Ofertas Especiais
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="glass-light rounded-xl px-3 py-2 flex items-center gap-2 text-sm"
                >
                  <badge.icon className="w-4 h-4 text-primary-400" />
                  <span className="text-dark-300 font-medium">{badge.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column - Featured product + stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Glow ring behind product */}
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, rgba(14,165,233,0.2), rgba(217,70,239,0.2), rgba(14,165,233,0.2))',
                filter: 'blur(60px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Product image container */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="relative z-10"
            >
              <div className="relative w-[350px] h-[350px] flex items-center justify-center">
                {/* Glass card behind product */}
                <div
                  className="absolute inset-0 glass rounded-3xl neon-border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(14,165,233,0.05), rgba(217,70,239,0.05))',
                  }}
                />
                {/* Product image placeholder */}
                <div className="relative z-10 flex flex-col items-center justify-center p-8">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4">
                    <svg className="w-24 h-24 text-primary-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-dark-400 text-sm font-medium">Produto Destaque</span>
                </div>
              </div>

              {/* Floating badges around product */}
              <motion.div
                className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 neon-border"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-primary-400 font-bold text-sm">-30%</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-2 -left-6 glass rounded-xl px-3 py-2 neon-border-purple"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-accent-400 font-bold text-sm">4.9</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-12 glass rounded-xl px-3 py-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <span className="text-green-400 text-xs font-medium">Frete Gratis</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-24 left-0 right-0 section-padding"
        >
          <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.15 }}
                className="flex items-center gap-3 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold gradient-text">
                    <AnimatedCounter target={stat.value} />
                  </div>
                  <div className="text-dark-400 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <span className="text-dark-500 text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 text-primary-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

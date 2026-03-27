'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Clock, ChevronRight } from 'lucide-react'

interface Promo {
  id: number
  title: string
  subtitle: string
  cta: string
  link: string
  gradient: string
}

const promos: Promo[] = [
  {
    id: 1,
    title: 'MEGA OFERTA',
    subtitle: 'Ate 40% OFF em Descartaveis',
    cta: 'Aproveitar Agora',
    link: '/produtos?categoria=descartaveis&ofertas=true',
    gradient: 'from-red-600/80 via-orange-600/80 to-yellow-600/80',
  },
  {
    id: 2,
    title: 'COMBO ESPECIAL',
    subtitle: 'Compre 3 e Leve 4 em Juices',
    cta: 'Ver Juices',
    link: '/produtos?categoria=juices',
    gradient: 'from-primary-600/80 via-blue-600/80 to-cyan-600/80',
  },
  {
    id: 3,
    title: 'PIX 10% OFF',
    subtitle: 'Desconto extra no pagamento via PIX',
    cta: 'Comprar com PIX',
    link: '/produtos',
    gradient: 'from-accent-600/80 via-purple-600/80 to-indigo-600/80',
  },
]

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 })

  useEffect(() => {
    const target = new Date()
    target.setDate(target.getDate() + 1)
    target.setHours(0, 0, 0, 0)

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = target.getTime() - now

      if (distance <= 0) {
        target.setDate(target.getDate() + 1)
        return
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Clock className="w-4 h-4 text-yellow-400 mr-1" />
      {[
        { value: timeLeft.hours, label: 'h' },
        { value: timeLeft.minutes, label: 'm' },
        { value: timeLeft.seconds, label: 's' },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-1">
          <span className="bg-black/40 rounded-lg px-2 py-1 font-mono font-bold text-white text-sm sm:text-base">
            {pad(unit.value)}
          </span>
          <span className="text-white/60 text-xs">{unit.label}</span>
          {i < 2 && <span className="text-white/40 font-bold mx-0.5">:</span>}
        </div>
      ))}
    </div>
  )
}

export default function PromoBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${promos[current].gradient} transition-all duration-1000`}
            />
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: Math.random() * 6 + 3,
                    height: Math.random() * 6 + 3,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -(Math.random() * 100 + 50)],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 py-10 sm:py-14 px-6 sm:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <Flame className="w-6 h-6 text-yellow-400" />
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-wide"
                      style={{
                        textShadow: '0 0 20px rgba(255,255,255,0.3)',
                      }}
                    >
                      {promos[current].title}
                    </h3>
                    <Flame className="w-6 h-6 text-yellow-400" />
                  </div>
                  <p className="text-white/90 text-lg sm:text-xl font-medium mb-4">
                    {promos[current].subtitle}
                  </p>
                  <CountdownTimer />
                </div>

                <Link href={promos[current].link}>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-dark-900 font-bold px-8 py-4 rounded-xl text-base sm:text-lg flex items-center gap-2 whitespace-nowrap hover:bg-white/90 transition-colors"
                  >
                    {promos[current].cta}
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Promo indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {promos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'w-8 bg-white'
                      : 'w-4 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

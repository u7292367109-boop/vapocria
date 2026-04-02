'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function getEndOfMonth() {
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    }

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const target = getEndOfMonth().getTime()
      const distance = target - now

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return timeLeft
}

export default function PromoBanner() {
  const timeLeft = useCountdown()
  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <section className="py-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#171717] via-[#1a1025] to-[#171717]" />

          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Floating shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-10 left-[10%] w-20 h-20 rounded-full border border-purple-500/10"
              animate={{ y: [0, -15, 0], rotate: [0, 90, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-10 right-[15%] w-14 h-14 rounded-lg border border-accent-500/10"
              animate={{ y: [0, 12, 0], rotate: [0, -45, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-1/2 right-[30%] w-8 h-8 rounded-full bg-purple-500/5"
              animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 py-14 sm:py-20 px-6 sm:px-12 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm font-heading font-semibold tracking-[0.3em] text-brand-gold uppercase mb-4"
            >
              OUTLET ESPECIAL
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            >
              ATÉ{' '}
              <span className="bg-gradient-to-r from-accent-500 to-accent-400 bg-clip-text text-transparent">
                70% OFF
              </span>
            </motion.h2>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-3 sm:gap-4 mb-8"
            >
              {[
                { value: timeLeft.days, label: 'Dias' },
                { value: timeLeft.hours, label: 'Horas' },
                { value: timeLeft.minutes, label: 'Min' },
                { value: timeLeft.seconds, label: 'Seg' },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#0a0a0a] border border-[#262626] flex items-center justify-center mb-1">
                    <span className="text-2xl sm:text-3xl font-heading font-bold text-white font-mono">
                      {pad(unit.value)}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider font-heading">
                    {unit.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/produtos">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-heading font-bold text-sm tracking-wider shadow-glow-orange hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-shadow"
                >
                  APROVEITAR AGORA
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark gradient bg with animated gradient mesh */}
      <div className="fixed inset-0 bg-dark-950">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(168, 85, 247, 0.12) 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 80% 70%, rgba(249, 115, 22, 0.08) 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212, 175, 55, 0.04) 0%, transparent 60%)
            `,
          }}
        />
        {mounted && (
          <>
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent)' }}
              animate={{
                x: ['-10%', '10%', '-5%'],
                y: ['-5%', '15%', '-10%'],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
              style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.3), transparent)' }}
              animate={{
                x: ['10%', '-10%', '5%'],
                y: ['5%', '-15%', '10%'],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
              style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3), transparent)' }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

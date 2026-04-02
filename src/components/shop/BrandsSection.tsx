'use client'

import { motion } from 'framer-motion'

const brands = [
  'Ignite',
  'Elf Bar',
  'SMOK',
  'Vaporesso',
  'Decria Beauty',
  'Glow Lab',
  'Essenza',
  'OptiMax',
  'Decria Eyewear',
]

function BrandCard({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 px-6 py-4 rounded-full bg-[#141414] border border-[#262626] hover:border-[#404040] transition-colors cursor-default">
      <span className="text-neutral-400 font-heading text-sm font-medium tracking-wider whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

export default function BrandsSection() {
  const doubled = [...brands, ...brands]

  return (
    <section className="py-20 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Marcas Parceiras
          </h2>
          <div className="mt-3 mx-auto w-16 h-px bg-brand-gold" />
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-marquee-scroll">
          {doubled.map((brand, i) => (
            <BrandCard key={`${brand}-${i}`} name={brand} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-scroll {
          animation: marqueeScroll 30s linear infinite;
          width: max-content;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

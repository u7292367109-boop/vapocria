'use client'

import { motion } from 'framer-motion'

const brands = [
  'Ignite',
  'Elf Bar',
  'Lost Mary',
  'Oxbar',
  'SMOK',
  'Vaporesso',
  'RAZ',
  'Zomo',
]

function BrandCard({ name }: { name: string }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.08,
        borderColor: 'rgba(14,165,233,0.4)',
        boxShadow: '0 0 20px rgba(14,165,233,0.15)',
      }}
      className="flex-shrink-0 w-[140px] sm:w-[170px] h-20 glass rounded-xl flex items-center justify-center cursor-pointer group transition-colors"
      style={{ border: '1px solid rgba(148,163,184,0.08)' }}
    >
      <span className="text-dark-400 font-display text-sm sm:text-base font-semibold tracking-wider group-hover:text-primary-400 transition-colors uppercase">
        {name}
      </span>
    </motion.div>
  )
}

export default function BrandsSection() {
  // Double the brands array for seamless infinite scroll
  const scrollBrands = [...brands, ...brands]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="section-padding mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Marcas que{' '}
            <span className="gradient-text">Trabalhamos</span>
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mb-4" />
          <p className="text-dark-400 max-w-lg mx-auto">
            Trabalhamos apenas com as melhores marcas do mercado
          </p>
        </motion.div>
      </div>

      {/* Infinite scroll marquee */}
      <div className="relative">
        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-dark-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-dark-950 to-transparent z-10 pointer-events-none" />

        {/* Scrolling row */}
        <div className="flex gap-4 sm:gap-6 animate-marquee">
          {scrollBrands.map((brand, index) => (
            <BrandCard key={`${brand}-${index}`} name={brand} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

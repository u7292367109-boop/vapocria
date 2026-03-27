'use client'

import { motion } from 'framer-motion'
import { Star, CheckCircle, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  comment: string
  verified: boolean
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Lucas M.',
    location: 'Sao Paulo, SP',
    rating: 5,
    comment:
      'Entrega super rapida e produto original! Melhor loja de vape que ja comprei. Recomendo demais!',
    verified: true,
  },
  {
    id: 2,
    name: 'Ana C.',
    location: 'Rio de Janeiro, RJ',
    rating: 5,
    comment:
      'Precos incriveis e atendimento excelente. O suporte me ajudou a escolher o melhor produto. Voltarei a comprar com certeza.',
    verified: true,
  },
  {
    id: 3,
    name: 'Pedro H.',
    location: 'Belo Horizonte, MG',
    rating: 5,
    comment:
      'Produto chegou em 2 dias, muito bem embalado. Qualidade impecavel. Ja fiz 5 pedidos e todos perfeitos!',
    verified: true,
  },
  {
    id: 4,
    name: 'Mariana S.',
    location: 'Curitiba, PR',
    rating: 4,
    comment:
      'Adorei a variedade de sabores! O Ignite V80 e incrivel. So falta mais opcoes de pagamento mas no geral excelente.',
    verified: true,
  },
  {
    id: 5,
    name: 'Rafael O.',
    location: 'Salvador, BA',
    rating: 5,
    comment:
      'Comprei o kit SMOK e veio com tudo certinho. Frete gratis e desconto no PIX, sensacional!',
    verified: true,
  },
  {
    id: 6,
    name: 'Julia F.',
    location: 'Florianopolis, SC',
    rating: 5,
    comment:
      'Melhor custo-beneficio que encontrei. Produtos originais e o suporte pelo WhatsApp responde muito rapido.',
    verified: true,
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        whileHover={{ y: -5, borderColor: 'rgba(14,165,233,0.3)' }}
        className="glass rounded-2xl p-6 h-full flex flex-col relative"
        style={{ border: '1px solid rgba(148,163,184,0.08)' }}
      >
        {/* Quote icon */}
        <Quote className="w-8 h-8 text-primary-500/20 mb-4" />

        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-dark-600'
              }`}
            />
          ))}
        </div>

        {/* Comment */}
        <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-6">
          &ldquo;{testimonial.comment}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{testimonial.name}</p>
                <p className="text-dark-500 text-xs">{testimonial.location}</p>
              </div>
            </div>
          </div>
          {testimonial.verified && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Verificado</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 relative">
      {/* Background accent */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-5 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #d946ef, transparent)' }}
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
            O que nossos clientes{' '}
            <span className="gradient-text">dizem</span>
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mb-4" />
          <p className="text-dark-400 max-w-lg mx-auto">
            Mais de 10.000 clientes satisfeitos em todo o Brasil
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

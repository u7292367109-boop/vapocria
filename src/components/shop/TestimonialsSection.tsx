'use client'

import { motion } from 'framer-motion'
import { Star, CheckCircle } from 'lucide-react'

interface Review {
  id: number
  name: string
  rating: number
  text: string
  category: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Lucas M.',
    rating: 5,
    text: 'Comprei o Ignite V80 e chegou em 2 dias. Produto 100% original, sabor incrível. Melhor loja de vape que já comprei!',
    category: 'Vapes',
  },
  {
    id: 2,
    name: 'Ana C.',
    rating: 5,
    text: 'O Kit Skincare Glow é maravilhoso! Minha pele nunca esteve tão bonita. Preço muito abaixo do mercado.',
    category: 'Cosméticos',
  },
  {
    id: 3,
    name: 'Pedro H.',
    rating: 5,
    text: 'Óculos aviador chegou perfeito, polarizado de verdade. Qualidade surpreendente pelo preço. Super recomendo!',
    category: 'Óculos',
  },
  {
    id: 4,
    name: 'Mariana S.',
    rating: 5,
    text: 'A paleta de sombras é incrível, pigmentação altíssima. Já é minha terceira compra na Decria, sempre entregam rápido.',
    category: 'Cosméticos',
  },
  {
    id: 5,
    name: 'Rafael O.',
    rating: 4,
    text: 'Lupa profissional com LED excelente para meu trabalho. Braço articulado firme e boa qualidade. Frete grátis foi o diferencial.',
    category: 'Óculos',
  },
  {
    id: 6,
    name: 'Julia F.',
    rating: 5,
    text: 'Elfbar BC5000 original com preço justo e desconto no PIX. Suporte pelo WhatsApp muito atencioso. Voltarei a comprar!',
    category: 'Vapes',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Avaliações dos Clientes
          </h2>
          <div className="mt-3 mx-auto w-16 h-px bg-brand-gold mb-4" />
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-white font-heading font-semibold">4.9</span>
            <span className="text-neutral-500 text-sm font-heading">
              &middot; 1.200+ avaliações
            </span>
          </div>
        </motion.div>

        {/* Review grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6 h-full flex flex-col hover:border-[#404040] transition-colors">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-neutral-300 text-sm leading-relaxed flex-1 mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-heading font-medium">{review.name}</p>
                      <p className="text-neutral-600 text-xs">{review.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-heading font-medium">Compra Verificada</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import {
  Truck,
  ShieldCheck,
  Percent,
  MessageCircle,
  CreditCard,
  RefreshCcw,
} from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Frete Grátis +R$200',
    description: 'Envio gratuito para todo o Brasil em compras acima de R$200.',
    gradient: 'from-blue-500/10 to-blue-600/5',
    iconColor: 'text-blue-400',
  },
  {
    icon: ShieldCheck,
    title: 'Produtos 100% Originais',
    description: 'Garantia de autenticidade em todos os produtos. Fornecedores oficiais.',
    gradient: 'from-green-500/10 to-green-600/5',
    iconColor: 'text-green-400',
  },
  {
    icon: Percent,
    title: 'Até 70% OFF',
    description: 'Preços de outlet com descontos reais nas melhores marcas.',
    gradient: 'from-purple-500/10 to-purple-600/5',
    iconColor: 'text-purple-400',
  },
  {
    icon: MessageCircle,
    title: 'Suporte via WhatsApp',
    description: 'Atendimento humanizado e rápido pelo WhatsApp. Sempre prontos.',
    gradient: 'from-emerald-500/10 to-emerald-600/5',
    iconColor: 'text-emerald-400',
  },
  {
    icon: CreditCard,
    title: '12x Sem Juros',
    description: 'Parcele no cartão em até 12x sem juros. PIX com 10% de desconto.',
    gradient: 'from-amber-500/10 to-amber-600/5',
    iconColor: 'text-amber-400',
  },
  {
    icon: RefreshCcw,
    title: 'Troca e Devolução',
    description: 'Política de troca e devolução simples e sem burocracia.',
    gradient: 'from-rose-500/10 to-rose-600/5',
    iconColor: 'text-rose-400',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function WhyChooseUs() {
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
            Por que a Decria?
          </h2>
          <div className="mt-3 mx-auto w-16 h-px bg-brand-gold" />
        </motion.div>

        {/* Benefits grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {benefits.map((benefit) => (
            <motion.div key={benefit.title} variants={cardVariants}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-[#262626] bg-[#141414] p-6 h-full hover:border-[#404040] transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4`}
                >
                  <benefit.icon className={`w-6 h-6 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-white font-heading font-semibold text-base mb-2">
                  {benefit.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

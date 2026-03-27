'use client'

import { motion } from 'framer-motion'
import { Truck, Shield, DollarSign, Headphones, CreditCard, Award } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Envio Rapido',
    description: 'Entregamos para todo o Brasil com rastreio. Envio em ate 24h uteis apos confirmacao.',
    color: 'text-blue-400',
    bg: 'from-blue-500/10 to-blue-600/5',
    border: 'group-hover:border-blue-500/30',
  },
  {
    icon: Shield,
    title: 'Produtos Originais',
    description: 'Garantia de autenticidade em todos os produtos. Trabalhamos apenas com fornecedores oficiais.',
    color: 'text-green-400',
    bg: 'from-green-500/10 to-green-600/5',
    border: 'group-hover:border-green-500/30',
  },
  {
    icon: DollarSign,
    title: 'Preco Justo',
    description: 'Os melhores precos do mercado com desconto extra no PIX. Garantia de menor preco.',
    color: 'text-yellow-400',
    bg: 'from-yellow-500/10 to-yellow-600/5',
    border: 'group-hover:border-yellow-500/30',
  },
  {
    icon: Headphones,
    title: 'Suporte 24h',
    description: 'Atendimento humanizado via WhatsApp e chat. Estamos sempre prontos para ajudar.',
    color: 'text-purple-400',
    bg: 'from-purple-500/10 to-purple-600/5',
    border: 'group-hover:border-purple-500/30',
  },
  {
    icon: CreditCard,
    title: '12x Sem Juros',
    description: 'Parcele suas compras em ate 12x sem juros no cartao de credito. PIX com 10% de desconto.',
    color: 'text-primary-400',
    bg: 'from-primary-500/10 to-primary-600/5',
    border: 'group-hover:border-primary-500/30',
  },
  {
    icon: Award,
    title: 'Garantia de Qualidade',
    description: 'Todos os produtos passam por controle de qualidade. Troca garantida em caso de defeito.',
    color: 'text-accent-400',
    bg: 'from-accent-500/10 to-accent-600/5',
    border: 'group-hover:border-accent-500/30',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 relative">
      {/* Background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }}
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
            Por que escolher a{' '}
            <span className="gradient-text">Vapocria?</span>
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mb-4" />
          <p className="text-dark-400 max-w-lg mx-auto">
            Compromisso com qualidade, transparencia e satisfacao do cliente
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -5, borderColor: 'rgba(14,165,233,0.2)' }}
                className={`group glass rounded-2xl p-6 h-full cursor-default ${benefit.border}`}
                style={{ border: '1px solid rgba(148,163,184,0.08)' }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.bg} flex items-center justify-center mb-5`}>
                  <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                </div>

                {/* Text */}
                <h3 className="text-white font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

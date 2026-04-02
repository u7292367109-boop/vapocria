'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  CreditCard,
  Lock,
  Zap,
} from 'lucide-react'

const institucional = [
  { label: 'Sobre Nos', href: '/sobre' },
  { label: 'Perguntas Frequentes', href: '/faq' },
  { label: 'Politica de Privacidade', href: '/politica-privacidade' },
  { label: 'Termos de Uso', href: '/termos' },
  { label: 'Trocas e Devoluções', href: '/trocas-devolucoes' },
  { label: 'Contato', href: '/contato' },
]

const categorias = [
  { label: 'Vapes', href: '/produtos?categoria=vapes' },
  { label: 'Cosmeticos', href: '/produtos?categoria=cosmeticos' },
  { label: 'Oculos', href: '/produtos?categoria=oculos' },
  { label: 'Lupas', href: '/produtos?categoria=lupas' },
  { label: 'Ofertas', href: '/produtos?ofertas=true' },
]

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.78a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.19z" />
  </svg>
)

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <>
      <footer className="relative border-t border-dark-800 bg-gradient-to-b from-dark-950 to-[#111]">
        {/* Newsletter Section */}
        <div className="border-b border-dark-800">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
              <div className="text-center lg:text-left">
                <h3 className="font-display text-xl font-bold text-white">
                  Receba ofertas exclusivas
                </h3>
                <p className="mt-1 text-sm text-dark-400">
                  Cadastre-se e ganhe 10% OFF na primeira compra
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                  className="h-11 flex-1 rounded-lg border border-dark-700 bg-dark-900 px-4 text-sm text-white placeholder-dark-500 outline-none transition-colors focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="h-11 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-6 text-sm font-semibold text-white transition-all hover:from-primary-500 hover:to-primary-400 hover:shadow-glow-purple"
                >
                  {subscribed ? 'INSCRITO!' : 'INSCREVER'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-white">DECRIA</span>
                <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  Outlet
                </span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-dark-500">
                Sua outlet favorita online. Produtos premium com os melhores precos do Brasil.
              </p>

              {/* Social Icons */}
              <div className="mt-5 flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-800 text-dark-400 transition-all hover:border-primary-500/50 hover:text-primary-400"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-800 text-dark-400 transition-all hover:border-primary-500/50 hover:text-primary-400"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </a>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-dark-800 text-dark-400 transition-all hover:border-green-500/50 hover:text-green-400"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Institucional */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
                Institucional
              </h4>
              <ul className="space-y-2.5">
                {institucional.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-500 transition-colors hover:text-dark-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categorias */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
                Categorias
              </h4>
              <ul className="space-y-2.5">
                {categorias.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-500 transition-colors hover:text-dark-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Atendimento */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
                Atendimento
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                  <div>
                    <span className="block text-sm text-dark-400">WhatsApp</span>
                    <a
                      href="https://wa.me/5511999999999"
                      className="text-sm text-dark-500 transition-colors hover:text-white"
                    >
                      (11) 99999-9999
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                  <div>
                    <span className="block text-sm text-dark-400">E-mail</span>
                    <a
                      href="mailto:contato@decriaoutlet.com.br"
                      className="text-sm text-dark-500 transition-colors hover:text-white"
                    >
                      contato@decriaoutlet.com.br
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                  <div>
                    <span className="block text-sm text-dark-400">Horario</span>
                    <span className="text-sm text-dark-500">Seg-Sex: 9h as 18h</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Pagamento & Seguranca */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
                Pagamento
              </h4>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-dark-800 bg-dark-900 px-2.5 py-1.5 text-xs text-dark-400">
                    <Zap className="h-3 w-3 text-green-400" />
                    PIX
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-dark-800 bg-dark-900 px-2.5 py-1.5 text-xs text-dark-400">
                    <CreditCard className="h-3 w-3 text-primary-400" />
                    Cartao
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-dark-800 bg-dark-900 px-2.5 py-1.5 text-xs text-dark-400">
                    Boleto
                  </span>
                </div>

                <div className="pt-2">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
                    Seguranca
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-dark-800 bg-dark-900 px-2.5 py-1.5 text-xs text-dark-400">
                      <Lock className="h-3 w-3 text-green-400" />
                      SSL
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-dark-800 bg-dark-900 px-2.5 py-1.5 text-xs text-dark-400">
                      <ShieldCheck className="h-3 w-3 text-primary-400" />
                      Compra Segura
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-dark-600 sm:flex-row lg:px-6">
            <span>&copy; 2024 Decria Outlet. Todos os direitos reservados.</span>
            <div className="flex gap-4">
              <Link href="/politica-privacidade" className="transition-colors hover:text-dark-400">
                Privacidade
              </Link>
              <Link href="/termos" className="transition-colors hover:text-dark-400">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-transform hover:scale-110"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>
    </>
  )
}

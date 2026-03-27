'use client'

import Link from 'next/link'
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Barcode,
  Send,
  MessageCircle,
} from 'lucide-react'
import { useState } from 'react'

const INSTITUTIONAL = [
  { label: 'Sobre Nos', href: '/sobre' },
  { label: 'Politica de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso', href: '/termos' },
  { label: 'Politica de Troca', href: '/trocas' },
  { label: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
]

const CATEGORIES = [
  { label: 'Descartaveis', href: '/categorias/descartaveis' },
  { label: 'Pods', href: '/categorias/pods' },
  { label: 'Juices', href: '/categorias/juices' },
  { label: 'Acessorios', href: '/categorias/acessorios' },
  { label: 'Kits', href: '/categorias/kits' },
]

const SUPPORT = [
  { label: 'Central de Ajuda', href: '/ajuda' },
  { label: 'Rastrear Pedido', href: '/rastreamento' },
  { label: 'WhatsApp', href: 'https://wa.me/5511999999999' },
  { label: 'Contato', href: '/contato' },
  { label: 'FAQ', href: '/faq' },
]

const SOCIALS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'Youtube' },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: integrate newsletter signup
    setEmail('')
  }

  return (
    <footer className="relative mt-20">
      {/* Top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="bg-gradient-to-b from-dark-900 to-dark-950">
        {/* Newsletter section */}
        <div className="section-padding py-10 border-b border-dark-700/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Receba ofertas exclusivas
              </h3>
              <p className="text-sm text-dark-400">
                Cadastre-se e ganhe 10% OFF na primeira compra
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full md:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                className="flex-1 md:w-72 bg-dark-800 border border-dark-600 rounded-l-xl px-4 py-3 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500"
              />
              <button
                type="submit"
                className="btn-primary rounded-l-none rounded-r-xl px-5 flex items-center gap-2 whitespace-nowrap"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Inscrever</span>
              </button>
            </form>
          </div>
        </div>

        {/* Main footer columns */}
        <div className="section-padding py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
              <Link href="/" className="inline-block mb-4">
                <span className="font-display text-2xl font-bold gradient-text tracking-wider">
                  VAPOCRIA
                </span>
              </Link>
              <p className="text-sm text-dark-400 mb-4 leading-relaxed">
                Fornecedor Top 1 do Brasil. Os melhores vapes, pods e juices com
                entrega rapida para todo o pais.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:text-primary-400 hover:bg-dark-700 transition-all border border-dark-700/50 hover:border-primary-500/30"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Institucional */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Institucional
              </h4>
              <ul className="space-y-2.5">
                {INSTITUTIONAL.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categorias */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Categorias
              </h4>
              <ul className="space-y-2.5">
                {CATEGORIES.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Atendimento */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Atendimento
              </h4>
              <ul className="space-y-2.5">
                {SUPPORT.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pagamento & Seguranca */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Pagamento
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700/50 text-dark-300 text-xs">
                  <QrCode className="h-4 w-4 text-primary-400" />
                  PIX
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700/50 text-dark-300 text-xs">
                  <CreditCard className="h-4 w-4 text-primary-400" />
                  Credito
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700/50 text-dark-300 text-xs">
                  <Barcode className="h-4 w-4 text-primary-400" />
                  Boleto
                </div>
              </div>

              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                Seguranca
              </h4>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700/50 text-dark-300 text-xs">
                  <Lock className="h-3.5 w-3.5 text-green-400" />
                  SSL
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700/50 text-dark-300 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                  Compra Segura
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-700/30">
          <div className="section-padding py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dark-500">
            <p>&copy; {new Date().getFullYear()} Vapocria. Todos os direitos reservados.</p>
            <p>
              Feito com{' '}
              <span className="text-accent-500">&#9829;</span> no Brasil
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-400 hover:scale-110 transition-all"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </footer>
  )
}

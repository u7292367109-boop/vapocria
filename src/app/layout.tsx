import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vapocria - Fornecedor Top 1 do Brasil | Vapes, Pods & Juices',
  description: 'Vapocria é o fornecedor número 1 de vapes do Brasil. Descartáveis, pods, juices e acessórios com os melhores preços e entrega rápida para todo o país.',
  keywords: 'vape, vaporizador, pod, juice, descartável, elfbar, ignite, lost mary, oxbar, smok, vaporesso',
  openGraph: {
    title: 'Vapocria - Fornecedor Top 1 do Brasil',
    description: 'Os melhores vapes, pods e juices com entrega rápida para todo o Brasil.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}

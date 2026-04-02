import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Decria Outlet | Vapes, Cosméticos & Óculos - Os Melhores Preços',
  description: 'Decria Outlet - Sua loja online de vapes, cosméticos e óculos com preços de outlet. Frete grátis, PIX com desconto e parcelamento em até 12x. Entrega rápida para todo o Brasil.',
  keywords: 'vape, cosméticos, óculos, lupas, outlet, desconto, pod, juice, maquiagem, skincare, óculos de sol',
  openGraph: {
    title: 'Decria Outlet | Vapes, Cosméticos & Óculos',
    description: 'Os melhores preços em vapes, cosméticos e óculos. Outlet online com entrega para todo o Brasil.',
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
              background: '#1a1a1a',
              color: '#fafafa',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
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

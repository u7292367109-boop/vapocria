# Vapocria - Fornecedor Top 1 do Brasil

Loja online completa de vapes, pods, juices e acessórios.

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Deploy:** Vercel

## Getting Started

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Rodar em desenvolvimento
npm run dev
```

## Estrutura

```
src/
├── app/
│   ├── (shop)/          # Loja (home, produtos, carrinho, checkout, conta)
│   ├── (auth)/          # Autenticação (login, cadastro)
│   ├── admin/           # Painel administrativo
│   └── api/             # API routes
├── components/
│   ├── ui/              # Componentes base reutilizáveis
│   ├── shop/            # Componentes da loja
│   ├── admin/           # Componentes do admin
│   └── layout/          # Header, Footer, CartDrawer
├── lib/                 # Utilitários, Supabase client, mock data
├── store/               # Zustand stores (cart, auth)
├── types/               # TypeScript types
└── hooks/               # Custom hooks
```

## Supabase Setup

Execute o schema SQL em `src/lib/supabase-schema.sql` no SQL Editor do Supabase.

## Deploy

Conecte o repositório ao Vercel e configure as variáveis de ambiente.

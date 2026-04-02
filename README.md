# Decria Outlet | Vapes, Cosméticos & Óculos

Loja online multi-categoria - outlet premium com os melhores preços.

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Deploy:** Vercel

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Categorias

- **Vapes** - Descartáveis, pods, juices e acessórios
- **Cosméticos** - Maquiagem, skincare, perfumes e cuidados
- **Óculos & Lupas** - Óculos de sol, grau e lupas profissionais

## Estrutura

```
src/
├── app/
│   ├── (shop)/          # Loja (home, produtos, carrinho, checkout, conta)
│   ├── (auth)/          # Autenticação (login, cadastro)
│   ├── admin/           # Painel administrativo
│   └── api/             # API routes
├── components/
│   ├── ui/              # Componentes base
│   ├── shop/            # Componentes da loja
│   ├── admin/           # Componentes do admin
│   └── layout/          # Header, Footer, CartDrawer
├── lib/                 # Utilitários, Supabase, mock data
├── store/               # Zustand stores
├── types/               # TypeScript types
└── hooks/               # Custom hooks
```

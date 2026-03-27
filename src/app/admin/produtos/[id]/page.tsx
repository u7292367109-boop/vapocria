'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { products } from '@/lib/mock-data'
import ProductForm from '@/components/admin/ProductForm'

export default function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return (
    <ProductForm
      isEditing
      defaultValues={{
        name: product.name,
        slug: product.slug,
        short_description: product.short_description,
        description: product.description,
        price: product.price,
        compare_at_price: product.compare_at_price ?? '',
        cost_price: product.cost_price ?? '',
        sku: product.sku,
        barcode: product.barcode ?? '',
        stock_quantity: product.stock_quantity,
        low_stock_threshold: product.low_stock_threshold,
        category_id: product.category_id ?? '',
        brand: product.brand,
        nicotine_strength: product.nicotine_strength ?? '',
        flavor: product.flavor ?? '',
        puff_count: product.puff_count ?? '',
        battery_capacity: product.battery_capacity ?? '',
        volume: product.volume ?? '',
        is_active: product.is_active,
        is_featured: product.is_featured,
      }}
      images={product.images}
      thumbnail={product.thumbnail}
    />
  )
}

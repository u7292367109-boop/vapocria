import { NextRequest, NextResponse } from 'next/server'
import { products, categories } from '@/lib/mock-data'
import type { Product, FilterOptions } from '@/types'

/**
 * GET /api/products
 * Returns a paginated, filterable list of products.
 *
 * Query params: category, brand, minPrice, maxPrice, nicotineStrength,
 *               flavor, sortBy, search, page, limit
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const filters: FilterOptions = {
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice')
        ? Number(searchParams.get('minPrice'))
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? Number(searchParams.get('maxPrice'))
        : undefined,
      nicotineStrength: searchParams.get('nicotineStrength') || undefined,
      flavor: searchParams.get('flavor') || undefined,
      sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    }

    // In production: replace with Supabase query
    // const { data, error, count } = await supabase
    //   .from('products')
    //   .select('*, category:categories(*)', { count: 'exact' })
    //   .eq('is_active', true)
    //   .ilike('name', `%${filters.search}%`)
    //   .gte('price', filters.minPrice)
    //   .lte('price', filters.maxPrice)
    //   .order(sortColumn, { ascending: sortAsc })
    //   .range(offset, offset + limit - 1)

    let filtered = [...products].filter((p) => p.is_active)

    // Apply filters
    if (filters.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (filters.category) {
      const cat = categories.find(
        (c) => c.slug === filters.category || c.id === filters.category
      )
      if (cat) {
        filtered = filtered.filter((p) => p.category_id === cat.id)
      }
    }

    if (filters.brand) {
      filtered = filtered.filter(
        (p) => p.brand.toLowerCase() === filters.brand!.toLowerCase()
      )
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!)
    }

    if (filters.nicotineStrength) {
      filtered = filtered.filter(
        (p) => p.nicotine_strength === filters.nicotineStrength
      )
    }

    if (filters.flavor) {
      filtered = filtered.filter(
        (p) =>
          p.flavor?.toLowerCase().includes(filters.flavor!.toLowerCase())
      )
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'popular':
      default:
        // featured first, then by id
        filtered.sort((a, b) =>
          a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1
        )
        break
    }

    // Paginate
    const page = filters.page || 1
    const limit = filters.limit || 12
    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginated = filtered.slice(offset, offset + limit)

    return NextResponse.json({
      data: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/products
 * Create a new product.
 * In production: requires admin auth middleware.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ['name', 'slug', 'price', 'sku', 'brand'] as const
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    if (typeof body.stock_quantity === 'number' && body.stock_quantity < 0) {
      return NextResponse.json(
        { error: 'Stock quantity cannot be negative' },
        { status: 400 }
      )
    }

    // In production: insert into Supabase
    // const { data, error } = await supabase
    //   .from('products')
    //   .insert({
    //     name: body.name,
    //     slug: body.slug,
    //     description: body.description || '',
    //     short_description: body.short_description || '',
    //     price: body.price,
    //     compare_at_price: body.compare_at_price || null,
    //     cost_price: body.cost_price || null,
    //     sku: body.sku,
    //     barcode: body.barcode || null,
    //     stock_quantity: body.stock_quantity || 0,
    //     low_stock_threshold: body.low_stock_threshold || 10,
    //     category_id: body.category_id || null,
    //     brand: body.brand,
    //     images: body.images || [],
    //     thumbnail: body.thumbnail || '',
    //     is_active: body.is_active ?? true,
    //     is_featured: body.is_featured ?? false,
    //     tags: body.tags || [],
    //     nicotine_strength: body.nicotine_strength || null,
    //     flavor: body.flavor || null,
    //     puff_count: body.puff_count || null,
    //     battery_capacity: body.battery_capacity || null,
    //     volume: body.volume || null,
    //     weight: body.weight || null,
    //     dimensions: body.dimensions || null,
    //   })
    //   .select()
    //   .single()

    const newProduct: Product = {
      id: String(products.length + 1),
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      short_description: body.short_description || '',
      price: body.price,
      compare_at_price: body.compare_at_price || null,
      cost_price: body.cost_price || null,
      sku: body.sku,
      barcode: body.barcode || null,
      stock_quantity: body.stock_quantity || 0,
      low_stock_threshold: body.low_stock_threshold || 10,
      category_id: body.category_id || null,
      brand: body.brand,
      images: body.images || [],
      thumbnail: body.thumbnail || '',
      is_active: body.is_active ?? true,
      is_featured: body.is_featured ?? false,
      tags: body.tags || [],
      nicotine_strength: body.nicotine_strength || null,
      flavor: body.flavor || null,
      puff_count: body.puff_count || null,
      battery_capacity: body.battery_capacity || null,
      volume: body.volume || null,
      weight: body.weight || null,
      dimensions: body.dimensions || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({ data: newProduct }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

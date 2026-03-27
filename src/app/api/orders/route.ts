import { NextRequest, NextResponse } from 'next/server'
import { sampleOrders, products } from '@/lib/mock-data'
import type { Order, OrderItem } from '@/types'

/**
 * GET /api/orders
 * Returns a list of orders. In production, scoped to the authenticated user
 * (or all orders for admin).
 *
 * Query params: status, page, limit
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const status = searchParams.get('status') || undefined
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '10')

    // In production: replace with Supabase query scoped to user
    // const { data: { user } } = await supabase.auth.getUser()
    // const query = supabase
    //   .from('orders')
    //   .select('*, items:order_items(*)', { count: 'exact' })
    //   .eq('user_id', user.id)
    //   .order('created_at', { ascending: false })
    // if (status) query.eq('status', status)
    // const { data, error, count } = await query.range(offset, offset + limit - 1)

    let filtered = [...sampleOrders]

    if (status) {
      filtered = filtered.filter((o) => o.status === status)
    }

    // Sort by newest first
    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

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
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/orders
 * Create a new order from the cart.
 * Validates items, calculates totals, and returns the created order.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'customer_name',
      'customer_email',
      'customer_phone',
      'customer_cpf',
      'shipping_address',
      'items',
    ] as const

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must have at least one item' },
        { status: 400 }
      )
    }

    // Validate shipping address
    const addrFields = ['street', 'number', 'neighborhood', 'city', 'state', 'zip_code']
    for (const field of addrFields) {
      if (!body.shipping_address[field]) {
        return NextResponse.json(
          { error: `Missing address field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Build order items and calculate totals
    // In production: validate stock and fetch real prices from DB
    // const productIds = body.items.map((i: any) => i.product_id)
    // const { data: dbProducts } = await supabase
    //   .from('products')
    //   .select('*')
    //   .in('id', productIds)
    //   .eq('is_active', true)

    const orderItems: OrderItem[] = []
    let subtotal = 0

    for (const item of body.items) {
      if (!item.product_id || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Each item needs product_id and quantity >= 1' },
          { status: 400 }
        )
      }

      const product = products.find((p) => p.id === item.product_id)
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.product_id}` },
          { status: 404 }
        )
      }

      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Available: ${product.stock_quantity}`,
          },
          { status: 400 }
        )
      }

      const totalPrice = product.price * item.quantity
      subtotal += totalPrice

      orderItems.push({
        id: `item-${Date.now()}-${item.product_id}`,
        order_id: '', // will be set below
        product_id: item.product_id,
        product_name: product.name,
        product_image: product.thumbnail,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: totalPrice,
      })
    }

    // Calculate shipping (free above R$200, otherwise R$15.90)
    const shippingCost = subtotal >= 200 ? 0 : 15.9

    // Apply coupon discount if provided
    let discount = 0
    if (body.coupon_code) {
      // In production: validate coupon from DB
      // const { data: coupon } = await supabase
      //   .from('coupons')
      //   .select('*')
      //   .eq('code', body.coupon_code)
      //   .eq('is_active', true)
      //   .single()
      discount = 0 // placeholder
    }

    const total = subtotal + shippingCost - discount

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`

    // Update order_id in items
    orderItems.forEach((item) => {
      item.order_id = orderId
    })

    const newOrder: Order = {
      id: orderId,
      user_id: body.user_id || null,
      status: 'pending',
      subtotal,
      shipping_cost: shippingCost,
      discount,
      total,
      payment_method: body.payment_method || null,
      payment_status: 'pending',
      payment_id: null,
      shipping_method: body.shipping_method || 'pac',
      tracking_code: null,
      notes: body.notes || null,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      customer_cpf: body.customer_cpf,
      shipping_address: {
        street: body.shipping_address.street,
        number: body.shipping_address.number,
        complement: body.shipping_address.complement || null,
        neighborhood: body.shipping_address.neighborhood,
        city: body.shipping_address.city,
        state: body.shipping_address.state,
        zip_code: body.shipping_address.zip_code,
        country: body.shipping_address.country || 'BR',
      },
      billing_address: body.billing_address || null,
      items: orderItems,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // In production: insert order + items in a transaction
    // const { data: order, error } = await supabase.rpc('create_order', {
    //   order_data: newOrder,
    //   items_data: orderItems,
    // })
    //
    // Also: decrement product stock
    // for (const item of orderItems) {
    //   await supabase.rpc('decrement_stock', {
    //     p_product_id: item.product_id,
    //     p_quantity: item.quantity,
    //   })
    // }

    return NextResponse.json({ data: newOrder }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

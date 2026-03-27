export interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  compare_at_price: number | null
  cost_price: number | null
  sku: string
  barcode: string | null
  stock_quantity: number
  low_stock_threshold: number
  category_id: string | null
  brand: string
  images: string[]
  thumbnail: string
  is_active: boolean
  is_featured: boolean
  tags: string[]
  nicotine_strength: string | null
  flavor: string | null
  puff_count: number | null
  battery_capacity: string | null
  volume: string | null
  weight: number | null
  dimensions: string | null
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parent_id: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  children?: Category[]
  product_count?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  user_id: string | null
  status: OrderStatus
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  payment_method: string | null
  payment_status: PaymentStatus
  payment_id: string | null
  shipping_method: string | null
  tracking_code: string | null
  notes: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_cpf: string
  shipping_address: Address
  billing_address: Address | null
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Address {
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  zip_code: string
  country: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone: string | null
  cpf: string | null
  avatar_url: string | null
  role: 'customer' | 'admin'
  addresses: Address[]
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  user_name: string
  rating: number
  comment: string
  is_approved: boolean
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_value: number | null
  max_uses: number | null
  used_count: number
  is_active: boolean
  expires_at: string | null
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'cancelled'

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Order[]
  topProducts: { product: Product; total_sold: number }[]
  revenueByDay: { date: string; revenue: number }[]
}

export interface FilterOptions {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  nicotineStrength?: string
  flavor?: string
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'name'
  search?: string
  page?: number
  limit?: number
}

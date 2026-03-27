-- ============================================================
-- Vapocria - Complete Supabase Database Schema
-- Premium Vape E-commerce
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- FUNCTION: auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: profiles (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  cpf TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_cpf ON profiles(cpf) WHERE cpf IS NOT NULL;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TABLE: addresses
-- ============================================================
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Casa',
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'BR',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- ============================================================
-- TABLE: categories (self-referencing for subcategories)
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  cost_price NUMERIC(10,2) CHECK (cost_price IS NULL OR cost_price >= 0),
  sku TEXT NOT NULL UNIQUE,
  barcode TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  thumbnail TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT[] NOT NULL DEFAULT '{}',
  nicotine_strength TEXT,
  flavor TEXT,
  puff_count INTEGER,
  battery_capacity TEXT,
  volume TEXT,
  weight NUMERIC(8,2),
  dimensions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE DEFAULT ('ORD-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8))),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  discount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled')),
  payment_id TEXT,
  shipping_method TEXT,
  tracking_code TEXT,
  notes TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_cpf TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  coupon_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved) WHERE is_approved = TRUE;
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================
-- TABLE: coupons
-- ============================================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_value NUMERIC(10,2),
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active) WHERE is_active = TRUE;

-- Add FK from orders to coupons
ALTER TABLE orders ADD CONSTRAINT fk_orders_coupon
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Profiles ──
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR ALL USING (is_admin());

-- ── Addresses ──
CREATE POLICY "Users can manage their own addresses"
  ON addresses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses"
  ON addresses FOR SELECT USING (is_admin());

-- ── Categories ──
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL USING (is_admin());

-- ── Products ──
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL USING (is_admin());

-- ── Orders ──
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL USING (is_admin());

-- ── Order Items ──
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items FOR ALL USING (is_admin());

-- ── Reviews ──
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL USING (is_admin());

-- ── Coupons ──
CREATE POLICY "Anyone can view active coupons by code"
  ON coupons FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL USING (is_admin());

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Decrement product stock (used when order is placed)
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - p_quantity
  WHERE id = p_product_id AND stock_quantity >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment product stock (used on order cancellation/refund)
CREATE OR REPLACE FUNCTION increment_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity + p_quantity
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, image, parent_id, is_active, sort_order) VALUES
  (uuid_generate_v4(), 'Descartaveis', 'descartaveis', 'Vapes descartaveis prontos para uso', '/categories/descartaveis.jpg', NULL, TRUE, 1),
  (uuid_generate_v4(), 'Pods', 'pods', 'Sistemas de pod recarregaveis', '/categories/pods.jpg', NULL, TRUE, 2),
  (uuid_generate_v4(), 'Juice / Liquidos', 'juices', 'Liquidos e essencias para vape', '/categories/juices.jpg', NULL, TRUE, 3),
  (uuid_generate_v4(), 'Kits', 'kits', 'Kits completos para iniciantes e avancados', '/categories/kits.jpg', NULL, TRUE, 4),
  (uuid_generate_v4(), 'Acessorios', 'acessorios', 'Acessorios e pecas de reposicao', '/categories/acessorios.jpg', NULL, TRUE, 5),
  (uuid_generate_v4(), 'Coils / Resistencias', 'coils', 'Resistencias e coils para manutencao', '/categories/coils.jpg', NULL, TRUE, 6);

-- Insert sample products (using the descartaveis category)
DO $$
DECLARE
  cat_descartaveis UUID;
  cat_pods UUID;
  cat_juices UUID;
BEGIN
  SELECT id INTO cat_descartaveis FROM categories WHERE slug = 'descartaveis';
  SELECT id INTO cat_pods FROM categories WHERE slug = 'pods';
  SELECT id INTO cat_juices FROM categories WHERE slug = 'juices';

  INSERT INTO products (name, slug, description, short_description, price, compare_at_price, cost_price, sku, stock_quantity, low_stock_threshold, category_id, brand, images, thumbnail, is_active, is_featured, tags, nicotine_strength, flavor, puff_count, battery_capacity, volume, weight, dimensions) VALUES
  (
    'Ignite V80 - Blueberry Ice',
    'ignite-v80-blueberry-ice',
    'O Ignite V80 e o descartavel premium que combina design elegante com sabor intenso.',
    'Descartavel premium com 8000 puffs e sabor blueberry ice',
    89.90, 129.90, 35.00,
    'IGN-V80-BBI',
    150, 20,
    cat_descartaveis,
    'Ignite',
    ARRAY['https://images.unsplash.com/photo-1560913210-de0287645665?w=600'],
    'https://images.unsplash.com/photo-1560913210-de0287645665?w=400',
    TRUE, TRUE,
    ARRAY['descartavel', 'ignite', 'blueberry', 'gelo'],
    '50mg', 'Blueberry Ice', 8000, '550mAh', '16ml', 60, '10x3x2cm'
  ),
  (
    'Elfbar BC5000 - Watermelon Ice',
    'elfbar-bc5000-watermelon-ice',
    'O Elf Bar BC5000 e um dos descartaveis mais populares do mercado.',
    'Descartavel compacto com 5000 puffs sabor melancia gelada',
    69.90, 99.90, 28.00,
    'ELF-BC5K-WMI',
    200, 30,
    cat_descartaveis,
    'Elf Bar',
    ARRAY['https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=600'],
    'https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400',
    TRUE, TRUE,
    ARRAY['descartavel', 'elfbar', 'melancia', 'gelo'],
    '50mg', 'Watermelon Ice', 5000, '650mAh', '13ml', 45, '8x3x2cm'
  ),
  (
    'SMOK Nord 5 Kit',
    'smok-nord-5-kit',
    'O SMOK Nord 5 e o sistema de pod mais versatil do mercado.',
    'Pod system versatil com 2000mAh e potencia ajustavel',
    189.90, 249.90, 85.00,
    'SMK-NRD5-KIT',
    80, 10,
    cat_pods,
    'SMOK',
    ARRAY['https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=600'],
    'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400',
    TRUE, TRUE,
    ARRAY['pod', 'smok', 'nord', 'kit', 'recarregavel'],
    NULL, NULL, NULL, '2000mAh', '5ml', 120, '12x4x2cm'
  ),
  (
    'Juice Zomo Mango Ice 30ml',
    'juice-zomo-mango-ice-30ml',
    'O Juice Zomo Mango Ice traz o sabor tropical da manga com toque gelado.',
    'Juice premium sabor manga gelada 30ml',
    44.90, 59.90, 15.00,
    'ZMO-MGI-30',
    300, 50,
    cat_juices,
    'Zomo',
    ARRAY['https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600'],
    'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400',
    TRUE, FALSE,
    ARRAY['juice', 'zomo', 'manga', 'gelo', '30ml'],
    '35mg', 'Mango Ice', NULL, NULL, '30ml', 50, '8x3x3cm'
  );
END $$;

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_uses, is_active, expires_at) VALUES
  ('BEMVINDO10', 'percentage', 10.00, 100.00, 1000, TRUE, '2025-12-31 23:59:59+00'),
  ('FRETE0', 'fixed', 15.90, 150.00, 500, TRUE, '2025-06-30 23:59:59+00'),
  ('VAPORIZA20', 'percentage', 20.00, 200.00, 200, TRUE, '2025-03-31 23:59:59+00');

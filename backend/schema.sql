-- Street Ritual Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('shirts', 'tshirts', 'hoodies', 'jeans')),
  sizes TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_session_id TEXT UNIQUE,
  customer_email TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);

-- RLS (Row Level Security) - disable for service role access
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Sample Products (optional - run to seed data)
INSERT INTO products (name, description, price, category, sizes, images, stock) VALUES
  ('RITUAL OVERSIZED TEE', 'Heavy cotton oversized tee with Street Ritual emblem. Garment washed for lived-in feel.', 1499, 'tshirts', ARRAY['XS','S','M','L','XL','XXL'], ARRAY['https://placehold.co/600x800/0a0a0a/d4af37?text=RITUAL+TEE'], 50),
  ('BLACKOUT HOODIE', 'Premium 400gsm fleece hoodie. Heavyweight. Embroidered logo. Drop shoulder fit.', 3499, 'hoodies', ARRAY['S','M','L','XL','XXL'], ARRAY['https://placehold.co/600x800/0a0a0a/d4af37?text=BLACKOUT+HOODIE'], 30),
  ('STREET RITUAL SHIRT', 'Premium woven shirt with tonal Street Ritual monogram. Relaxed fit.', 2299, 'shirts', ARRAY['S','M','L','XL'], ARRAY['https://placehold.co/600x800/0a0a0a/d4af37?text=SR+SHIRT'], 25),
  ('DISTRESSED JEANS', 'Selvedge denim. Heavy wash. Street-ready silhouette. Ritual branded hardware.', 4999, 'jeans', ARRAY['28','30','32','34','36'], ARRAY['https://placehold.co/600x800/0a0a0a/d4af37?text=SR+JEANS'], 20);

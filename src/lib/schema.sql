-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to all users" ON products;
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON products;

-- Drop and recreate the products table
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
(
  'Premium Coffee Maker',
  'Professional-grade coffee maker with built-in grinder and timer. Perfect for coffee enthusiasts.',
  199.99,
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&h=600&q=80',
  'Appliances',
  50
),
(
  'Wireless Noise-Canceling Headphones',
  'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
  299.99,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&h=600&q=80',
  'Electronics',
  100
),
(
  'Ergonomic Office Chair',
  'Comfortable office chair with lumbar support and adjustable height. Perfect for long work sessions.',
  249.99,
  'https://images.unsplash.com/photo-1505843490578-d3186c8e4560?auto=format&fit=crop&w=500&h=600&q=80',
  'Furniture',
  30
),
(
  'Smart Fitness Watch',
  'Track your workouts, heart rate, and sleep patterns with this advanced fitness tracker.',
  179.99,
  'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=500&h=600&q=80',
  'Electronics',
  75
),
(
  'Organic Cotton T-Shirt',
  'Comfortable, sustainable, and stylish t-shirt made from 100% organic cotton.',
  29.99,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&h=600&q=80',
  'Clothing',
  200
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all users"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow full access to authenticated users"
  ON products
  FOR ALL
  USING (auth.role() = 'authenticated'); 
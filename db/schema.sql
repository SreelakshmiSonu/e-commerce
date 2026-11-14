CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  color TEXT NOT NULL,
  image TEXT NOT NULL,
  badge TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  total INTEGER NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'DEMO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0)
);

INSERT INTO products (id, name, category, price, color, image, badge)
VALUES
  (1, 'The Everyday Trench', 'Outerwear', 248, 'Stone',
   'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=900&q=85', 'BESTSELLER'),
  (2, 'Soft Structure Blazer', 'Clothing', 198, 'Oatmeal',
   'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85', NULL),
  (3, 'Weekend Knit', 'Knitwear', 128, 'Cream',
   'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85', 'NEW COLOR'),
  (4, 'Relaxed Linen Shirt', 'Clothing', 112, 'Pale blue',
   'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('products', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM products), 1)
);

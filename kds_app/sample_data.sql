-- Kitchen Display System Sample Data
-- Run these SQL commands in your Supabase SQL editor to create the orders_demo table and insert sample data

-- Create the orders_demo table
CREATE TABLE IF NOT EXISTS orders_demo (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  table_no TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  note TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'incoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_orders_demo_status ON orders_demo(status);
CREATE INDEX IF NOT EXISTS idx_orders_demo_created_at ON orders_demo(created_at);

-- Insert sample orders for testing
INSERT INTO orders_demo (name, table_no, price, note, status) VALUES
('1 jollof rice, 1 grilled chicken', 'Table 1', 25.00, 'Extra spicy', 'incoming'),
('2 fried plantain, 1 fish stew', 'Table 2', 18.50, 'No pepper', 'incoming'),
('1 pounded yam, 1 egusi soup', 'Table 3', 22.00, '', 'processing'),
('3 meat pies, 2 soft drinks', 'Takeaway', 12.00, 'To go', 'processing'),
('1 jollof rice, 1 chicken', 'Table 4', 25.00, 'No onions', 'complete'),
('2 rice and beans, 1 turkey', 'Table 5', 30.00, 'Well done', 'complete'),
('1 ofada rice, 1 beef stew', 'Table 6', 20.00, 'Medium spice', 'incoming'),
('1 suya, 1 chapman', 'Table 7', 15.00, 'Extra suya sauce', 'incoming'),
('1 amala, 1 ewedu soup', 'Table 8', 23.00, 'With assorted meat', 'processing'),
('2 moi moi, 1 akara', 'Table 9', 14.00, 'Extra pepper sauce', 'incoming');

-- Sample query to verify data
SELECT id, name, table_no, price, note, status, created_at 
FROM orders_demo 
ORDER BY created_at DESC;

-- Example status update queries (for testing real-time updates)
-- UPDATE orders_demo SET status = 'processing', updated_at = NOW() WHERE id = 1;
-- UPDATE orders_demo SET status = 'complete', updated_at = NOW() WHERE id = 2;

-- Enable Row Level Security (optional, for production)
-- ALTER TABLE orders_demo ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for development)
-- CREATE POLICY "Allow all operations on orders_demo" ON orders_demo FOR ALL USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_orders_demo_updated_at ON orders_demo;
CREATE TRIGGER update_orders_demo_updated_at
    BEFORE UPDATE ON orders_demo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

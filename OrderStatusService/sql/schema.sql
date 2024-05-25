DROP TABLE IF EXISTS orderDetails;
DROP TABLE IF EXISTS orders;
CREATE TABLE orders(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), account_id UUID, order_date TIMESTAMP NOT NULL, order_status TEXT DEFAULT 'pending', cart jsonb DEFAULT '[]'::jsonb);
CREATE TABLE orderDetails(order_id UUID REFERENCES orders(id), product_id UUID, quantity integer);
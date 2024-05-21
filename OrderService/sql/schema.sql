DROP TABLE IF EXISTS orders;
CREATE TABLE orders(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), account_id UUID, product_id UUID, data jsonb);
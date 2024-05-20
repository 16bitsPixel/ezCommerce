DROP TABLE IF EXISTS order;
CREATE TABLE order(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), account_id UUID REFERENCES account(id), product_id REFERENCES product(id), data jsonb);
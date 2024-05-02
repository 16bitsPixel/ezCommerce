DROP TABLE IF EXISTS product;
CREATE TABLE product(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), product jsonb);
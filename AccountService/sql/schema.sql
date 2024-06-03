DROP TABLE IF EXISTS vendor;
DROP TABLE IF EXISTS wishlist;
DROP TABLE IF EXISTS account;
CREATE TABLE account(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb, cart jsonb DEFAULT '[]'::jsonb);
CREATE TABLE vendor(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), vendor_id UUID REFERENCES account(id), verified boolean DEFAULT false);
CREATE TABLE wishlist(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), account_id UUID REFERENCES account(id), info jsonb);
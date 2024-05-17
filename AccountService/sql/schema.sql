DROP TABLE IF EXISTS vendor;
DROP TABLE IF EXISTS account;
CREATE TABLE account(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);
CREATE TABLE vendor(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), vendor_id UUID REFERENCES account(id), verified boolean DEFAULT false);
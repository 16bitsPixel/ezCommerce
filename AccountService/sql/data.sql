DELETE FROM vendor;
DELETE FROM account;
INSERT INTO account(id, data) VALUES ('4669b4d8-6116-492c-9b0c-22728eb75186', jsonb_build_object('email','molly@books.com','name','Molly Member','pwhash',crypt('mollymember','87'),'role','member'));
INSERT INTO account(id, data) VALUES ('73b713bc-8e93-46ad-8643-da845fd4ab29', jsonb_build_object('email','anna@books.com','name','Anna Admin','pwhash',crypt('annaadmin','87'),'role','admin'));
INSERT INTO account(id, data) VALUES ('fa14fb7e-2a1d-41d5-8985-30568dc8a7a9', jsonb_build_object('email','vin@vendor.com','name','Vin Vendor','pwhash',crypt('vinvendor','87'),'role','vendor'));
INSERT INTO vendor(vendor_id,verified ) VALUES ('fa14fb7e-2a1d-41d5-8985-30568dc8a7a9','true');
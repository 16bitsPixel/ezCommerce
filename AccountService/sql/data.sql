DELETE FROM account;
DELETE FROM vendor;
DELETE FROM APIKEYS;
INSERT INTO account(data) VALUES (jsonb_build_object('email','molly@books.com','name','Molly Member','pwhash',crypt('mollymember','87'),'role','member'));
INSERT INTO account(data) VALUES (jsonb_build_object('email','anna@books.com','name','Anna Admin','pwhash',crypt('annaadmin','87'),'role','admin'));
INSERT INTO account(id, data) VALUES ('fa14fb7e-2a1d-41d5-8985-30568dc8a7a9', jsonb_build_object('email','vin@vendor.com','name','Vin Vendor','pwhash',crypt('vinvendor','87'),'role','vendor'));
INSERT INTO vendor(vendor_id) VALUES ('fa14fb7e-2a1d-41d5-8985-30568dc8a7a9');
INSERT INTO APIKEYS(vendor, apikey) VALUES ('fa14fb7e-2a1d-41d5-8985-30568dc8a7a9', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImI2ZmEyMjc4ZmU2YWJlMTRkMGU2M2U3NjM3YmFkOWUyIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzE1NTc0MzIwfQ.XHRHtqs43KstOuMrdy5B6x6N1eYS0NnLefvXsRfnEjv4xCcieLBzi_iUFK5efsolPDBgPsNP2wI6LKnQwJMEwg');
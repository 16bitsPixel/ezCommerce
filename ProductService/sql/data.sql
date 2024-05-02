DELETE FROM product;
INSERT INTO product(id, product) VALUES ('eca286ff-43a8-457d-ab07-b2f3d003d903', jsonb_build_object('name','Test Item','description','This is a test item','quantity', 2, 'price', 99.99));

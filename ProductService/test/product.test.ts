import supertest from 'supertest';
import * as http from 'http';


import * as db from './db';
import app from '../src/app';

import dotenv from 'dotenv'
dotenv.config()
let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  return db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

const product1 = {
  name: 'Product 1',
  description: 'Description 1',
  price: 100,
  image: 'https://test.com'
};
let product1_id: string;

test('User Adds a Product', async () => {
  await supertest(server)
    .post('/api/v0/product/addProduct')
    .send(product1)
    .expect(201)
    .then((res) => {
      product1_id = res.body.id;
      expect(res.body.name).toBe('Product 1');
      expect(res.body.description).toBe('Description 1');
      expect(res.body.price).toBe(100);
      expect(res.body.image).toBe('https://test.com');
    })
});

test('User Fetches a Product', async () => {
  await supertest(server)
  .get(`/api/v0/product?productId=${product1_id}`)
    .expect(200)
});

// We're adding an extra product on top of the 
// existing 4 products in the database
test('User Fetches All Products', async () => {
  await supertest(server)
    .get('/api/v0/product')
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(5);
    })
});

test('User Fetches a Non-Existent Product', async () => {
  await supertest(server)
    .get('/api/v0/product?productId=123e4567-e89b-12d3-a456-426655440011')
    .expect(404)
});

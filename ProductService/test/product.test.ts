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

// test product
const input_product = {
  name: 'test name',
  description: 'test description',
  price: 13,
  image: 'test image'
};

let product_id: string;
const dneId: string = '44e380ad-ce32-4144-959d-14da33d739c3';

test('Get all products', async () => {
  await supertest(server)
    .get('/api/v0/product')
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(4);
    })
});

test('Create Product', async () => {
  await supertest(server)
    .post('/api/v0/product/addProduct')
    .send(input_product)
    .expect(201)
    .then((res) => {
      product_id = res.body.id;
      expect(res.body.name).toBe('test name');
      expect(res.body.description).toBe('test description');
      expect(res.body.price).toBe(13);
      expect(res.body.image).toBe('test image');
    });
});

test('Get a single product', async () => {
  await supertest(server)
    .get(`/api/v0/product/product/?productId=${product_id}`)
    .expect(200)
    .then((res) => {
      expect(res.body.name).toBe('test name');
      expect(res.body.description).toBe('test description');
      expect(res.body.price).toBe(13);
      expect(res.body.image).toBe('test image');
    })
});

test('Get nonexistent product', async () => {
  await supertest(server)
    .get(`/api/v0/product/product/?productId=${dneId}`)
    .expect(404);
});

test('GET API Docs', async () => {
  await supertest(server).get('/api/v0/docs/')
    .expect(200)
});

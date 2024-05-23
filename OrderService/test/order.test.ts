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

const input_order = {
  account_id: '123e4567-e89b-12d3-a456-426614174000',
  product_id: '987e6543-e21b-23d4-b654-321874650000',
  date: new Date(),
  status: 'pending',
};

const invalid_order = {
  account_id: '123e4567-e89b-12d3-a456-426614174000',
  product_id: '987e6543-e21b-23d4-b654-321874650000',
  date: new Date(),
  status: 'invalid',
  extra: 'extra',
};

let order_id: string;

test('User Creates an Order', async () => {
  await supertest(server)
    .post('/api/v0/order/')
    .send(input_order)
    .expect(201)
    .then((res) => {
      order_id = res.body.order_id;
      expect(res.body.account_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(res.body.product_id).toBe('987e6543-e21b-23d4-b654-321874650000');
    })
});

test('User Fetches an Order', async () => {
  await supertest(server)
    .get(`/api/v0/order/${order_id}`)
    .expect(200)
    .then((res) => {
      expect(res.body.account_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(res.body.product_id).toBe('987e6543-e21b-23d4-b654-321874650000');
    })
});

test('User Fetches All Orders', async () => {
  await supertest(server)
    .get('/api/v0/order/')
    .expect(200)
    .then((res) => {
      expect(res.body[0].account_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(res.body[0].product_id).toBe('987e6543-e21b-23d4-b654-321874650000');
    })
});

test('User Fetches Invalid Order', async () => {
  await supertest(server)
    .get('/api/v0/order/123e4567-e89b-12d3-a456-426614174001')
    .expect(404)
});

test('User Creates Order With Invalid Order', async () => {
  await supertest(server)
    .post('/api/v0/order/')
    .send(invalid_order)
    .expect(400)
});

test('GET API Docs', async () => {
  await supertest(server).get('/api/v0/docs/')
    .expect(200)
});


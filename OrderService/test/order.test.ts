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

const input_order1 = {
  account_id: '123e4567-e89b-12d3-a456-426614174000',
  product_id: ['987e6543-e21b-23d4-b654-321874650000', 'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6'],
  quantities: [1, 2],
};

const input_order2 = {
  account_id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  product_id: ['8f9a0b1c-1c2d-3e4f-5a6b-7c8d9e0a1b2c'],
  quantities: [43],
};

const invalid_order = {
  account_id: '123e4567-e89b-12d3-a456-426614174000',
  product_id: '987e6543-e21b-23d4-b654-321874650000',
  status: 'invalid',
  extra: 'extra',
};

const invalid_orderId = '123e4567-e89b-12d3-a456-426614174001';

let order_id: string;

test('User Creates an Order', async () => {
  await supertest(server)
    .post('/api/v0/order/')
    .send(input_order1)
    .expect(201)
    .then((res) => {
      order_id = res.body.order_id;
      expect(res.body.account_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(res.body.product_id).toStrictEqual(['987e6543-e21b-23d4-b654-321874650000',
        'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6']);
    })
});

test('User Fetches an Order', async () => {
  await supertest(server)
    .get(`/api/v0/order/${order_id}`)
    .expect(200)
    .then((res) => {
      expect(res.body.account_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(res.body.product_id).toStrictEqual(['987e6543-e21b-23d4-b654-321874650000',
        'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6']);
      expect(res.body.quantities).toStrictEqual([1, 2]);
    })
});

test('User Fetches an Invalid Order', async () => {
  await supertest(server)
    .get(`/api/v0/order/${invalid_orderId}`)
    .expect(404)
});

test('User Fetches All Orders', async () => {
  await supertest(server)
    .post('/api/v0/order/')
    .send(input_order2)
    .expect(201)
  await supertest(server)
    .get('/api/v0/order/')
    .expect(200)
    .then((res) => {
      expect(res.body[0].account_id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(res.body[0].product_id).toStrictEqual(['987e6543-e21b-23d4-b654-321874650000',
        'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6']);
      expect(res.body[0].quantities).toStrictEqual([1, 2]);
      expect(res.body[1].account_id).toBe('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d');
      expect(res.body[1].product_id).toStrictEqual(['8f9a0b1c-1c2d-3e4f-5a6b-7c8d9e0a1b2c']);
      expect(res.body[1].quantities).toStrictEqual([43]);

    })
});

test('User Updates Order Status', async () => {
  await supertest(server)
    .put(`/api/v0/order/${order_id}/status`)
    .send({ status: 'shipped' })
    .expect(200)
});

test('User Updates Order Status with Invalid Status', async () => {
  await supertest(server)
    .put(`/api/v0/order/${order_id}/status`)
    .send({ status: 'invalid' })
    .expect(400)
});

test('User Updates Order Status with Invalid Order', async () => {
  await supertest(server)
    .put(`/api/v0/order/${invalid_orderId}/status`)
    .send({ status: 'shipped' })
    .expect(404)
});

test('User Checks Order Status', async () => {
  await supertest(server)
    .get(`/api/v0/order/${order_id}/status`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe('shipped');
    })
});

test('User Checks Invalid Order Status', async () => {
  await supertest(server)
    .get(`/api/v0/order/${invalid_orderId}/status`)
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


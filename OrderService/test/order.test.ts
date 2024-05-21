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

test('User Creates an Order', async () => {
  await supertest(server)
    .post('/api/v0/order/')
    .send('eca286ff-43a8-457d-ab07-b2f3d003d903')
    .expect(201);
});

test('User Fetches an Order', async () => {
  await supertest(server)
    .get('/api/v0/order/eca286ff-43a8-457d-ab07-b2f3d003d903')
    .expect(200);
});

test('User Fetches All Orders', async () => {
  await supertest(server)
    .get('/api/v0/order/')
    .expect(200);
});


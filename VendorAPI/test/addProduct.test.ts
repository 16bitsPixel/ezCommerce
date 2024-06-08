import http from 'http';
import supertest from 'supertest';
import { http as mswHttp, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../src/app'; 

dotenv.config();

const testProduct = {
  name: "watch",
  description: ["tells time"],
  price: 300,
  image: ["https://m.media-amazon.com/images/I/81oMxPD2JML._AC_SY535_.jpg"]
};

interface VerifyRequestBody {
  apikey: string;
}

let server: http.Server;

const MASTER_SECRET = process.env.MASTER_SECRET || 'your-master-secret';
const validToken = jwt.sign(
  {
    id: 'fa14fb7e-2a1d-41d5-8985-30568dc8a7a9',
    name: 'Vin Vendor',
    email: 'vin@vendor.com',
  },
  MASTER_SECRET,
  { expiresIn: '1h' }
);

const invalidToken = jwt.sign(
  {
    id: 'fa14fb7e-2a1d-41d5-8985-30568dc8a7a9',
    name: 'Vin Vendor',
    email: 'vin@vendor.com',
  },
  'invalid-secret', 
  { expiresIn: '1h' }
);

const handlers = [
  mswHttp.post('http://localhost:3013/api/v0/vendor/verify', async ({ request }) => {
    const { apikey } = await request.json() as VerifyRequestBody;
    if (apikey === validToken) {
      return HttpResponse.json({
        email: 'vendor@example.com',
        name: 'Vendor Name',
        id: 'vendor-123',
      }, { status: 200 });
    } else {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }),

  mswHttp.post('http://localhost:3012/api/v0/product/addProduct', async ({ request }) => {
    const product = await request.json();
    return HttpResponse.json(product, { status: 200 });
  }),
];

const mswServer = setupServer(...handlers);

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(app);
  server.listen();
});

afterAll((done) => {
  mswServer.close();
  server.close(done);
});

afterEach(() => {
  mswServer.resetHandlers();
});

test('Vendor Adds a Product with being authorized', async () => {
  await supertest(server)
    .post('/api/v0/products')
    .set('Authorization', `Bearer ${validToken}`)
    .send(testProduct)
    .expect(200)
    .then((res) => {
      expect(res.body.name).toBe(testProduct.name);
    });

});

test('Vendor Adds a Product without being authorized', async () => {
  await supertest(server)
    .post('/api/v0/products')
    .set('Authorization', `Bearer 123`)
    .send(testProduct)
    .expect(401)
});

test('Vendor Adds a Product without auth header', async () => {
  await supertest(server)
    .post('/api/v0/products')
    .send(testProduct)
    .expect(401)
});
  
test('Vendor fails to add a product with invalid token', async () => {
  await supertest(server)
    .post('/api/v0/products')
    .set('Authorization', `Bearer ${invalidToken}`)
    .send(testProduct)
    .expect(401)
});
  
import http from 'http';
import supertest from 'supertest';
import { http as mswHttp, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../src/app';

dotenv.config();

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

const testOrders = [
  {
    id: 'order1',
    shopperId: 'shopper1',
    orderDate: '2023-06-01',
    orderStatus: 'Pending',
    cart: ['item1', 'item2'],
  },
];

interface VerifyRequestBody {
  apikey: string;
}

interface UpdateOrderStatusBody {
  status: string;
}

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

  mswHttp.get('http://localhost:3015/api/v0/order', async () => {
    return HttpResponse.json(testOrders, { status: 200 });
  }),

  mswHttp.put('http://localhost:3015/api/v0/order/order1/status', async ({ request }) => {
    const { status } = await request.json() as UpdateOrderStatusBody;
    if (status === 'Shipped') {
      return HttpResponse.json(true, { status: 200 });
    } else {
      return HttpResponse.json(false, { status: 400 });
    }
  }),

  mswHttp.put('http://localhost:3015/api/v0/order/order2/status', async () => {
    return HttpResponse.json(false, { status: 500 });
  }),
];

const mswServer = setupServer(...handlers);

let server: http.Server;

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

test('Get orders with valid token', async () => {
  await supertest(server)
    .get('/api/v0/orders')
    .set('Authorization', `Bearer ${validToken}`)
    .expect(200)
    .then((res) => {
      console.log("Response body: ", res.body);
      expect(res.body).toEqual(testOrders);
    });
});

test('Get orders with invalid token', async () => {
  await supertest(server)
    .get('/api/v0/orders')
    .set('Authorization', `Bearer ${invalidToken}`)
    .expect(401)
    .then((res) => {
      console.log("Response body: ", res.body);
      expect(res.body.message).toBe('Unauthorized');
    });
});

test('Update order status with valid token', async () => {
  await supertest(server)
    .put('/api/v0/orders/order1/status')
    .set('Authorization', `Bearer ${validToken}`)
    .send({ status: 'Shipped' })
    .expect(200)
    .then((res) => {
      console.log("Response body: ", res.body);
      expect(res.body).toBe(true);
    });
});

test('Update order status to shipped with invalid token', async () => {
  await supertest(server)
    .put('/api/v0/orders/order1/status')
    .set('Authorization', `Bearer ${invalidToken}`)
    .send({ status: 'Shipped' })
    .expect(401)
    .then((res) => {
      console.log("Response body: ", res.body);
      expect(res.body.message).toBe('Unauthorized');
    });
});

test('Update order status to cancelled with valid token', async () => {
  await supertest(server)
    .put('/api/v0/orders/order2/status')
    .set('Authorization', `Bearer ${validToken}`)
    .send({ status: 'Cancelled' })
    .expect(200)
});

test('GET API Docs', async () => {
    await supertest(server).get('/api/v0/docs/')
      .expect(200);
  });
  
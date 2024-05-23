import * as http from 'http';
import app from '../src/app';
import supertest from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

let server: http.Server;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(resolve));
});

afterAll((done) => {
  server.close(done);
});

const testProduct = {
  name: "apple watch",
  description: "tells time",
  price: 300,
  image: "https://m.media-amazon.com/images/G/01/apparel/rcxgs/tile._CB483369110_.gif"
};

export interface Vendor {
    email: string;
    password: string;
    name: string;
  }
  

async function getAPIKey(vendor: string): Promise<string | undefined>{
  let APIKey;
  await supertest('http://localhost:3013')
    .get('/api/v0/vendor/api/vendor-keys')
    .query({ vendorid: vendor })
    .expect(200)
    .then((res) => {
      APIKey = res.body[0].key
    })
  return APIKey
}

test('Vendor Adds a Product Without being authorized', async () => {
  await supertest(server)
    .post('/api/v0/products')
    .send(testProduct)
    .expect(401)
});

test('Vendor Adds a Product with being authorized', async () => {
  const APIKey = await getAPIKey('fa14fb7e-2a1d-41d5-8985-30568dc8a7a9')
  await supertest(server)
    .post('/api/v0/products')
    .set('Authorization', 'Bearer ' + APIKey)
    .send(testProduct)
    .expect(200)
    .then((res) => {
      expect(res.body.name).toBe(testProduct.name)
      expect(res.body.description).toBe(testProduct.description)
      expect(res.body.price).toBe(testProduct.price)
      expect(res.body.image).toBe(testProduct.image)
    })
});
  
import supertest from 'supertest';
import * as http from 'http';

import * as db from './db';
import app from '../src/app';
import jwt from 'jsonwebtoken';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(resolve));
  return  await db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhMTRmYjdlLTJhMWQtNDFkNS04OTg1LTMwNTY4ZGM4YTdhOSIsInJvbGUiOiJ2ZW5kb3IiLCJlbWFpbCI6InZpbkB2ZW5kb3IuY29tIiwibmFtZSI6IlZpbiBWZW5kb3IiLCJwYXNzd29yZCI6InZpbnZlbmRvciIsImlhdCI6MTcxNzM2OTgwNCwiZXhwIjoxNzQ4OTI3NDA0fQ.cuo6eT53bgep9Y-1ANB_D1rnUaVC9NqKA3zSy5-gDmQ'
test("Get all api keys for a vendor", async()=>{
  await supertest(server)
    .get('/api/v0/vendor/api/all-keys')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200);
})
let apikey:string
test("Post a new api key", async()=>{
  await supertest(server)
    .post('/api/v0/vendor/api/genrate-key')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201)
    .then((res)=>{
      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();
      expect(res.body.key).toBeDefined();
      apikey = res.body
    })
})

test("Post a new api key without valid access Token", async()=>{
    await supertest(server)
      .post('/api/v0/vendor/api/genrate-key')
      .set('Authorization', 'Bearer 123')
      .expect(401)
  })
  test("Post a new api key without auth header", async()=>{
    await supertest(server)
      .post('/api/v0/vendor/api/genrate-key')
      .expect(401)
  })
test("Now check that new api keys is available for vendor", async()=>{
  await supertest(server)
    .get('/api/v0/vendor/api/all-keys')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toBeDefined();
      expect(res.body).toContainEqual(apikey);
    })
})

const MASTER_SECRET = process.env.MASTER_SECRET || 'your-master-secret';

const invalidRoleToken = jwt.sign(
    {
        id: 'fa14fb7e-2a1d-41d5-8985-30568dc8a7a9',
        name: 'Vin Vendor',
        email: 'vin@vendor.com',
        role: ['user'] 
    },
    MASTER_SECRET,
    { expiresIn: '1h' }
);

test("Reject with 'Unauthorised' error if user does not have required scopes", async () => {
    await supertest(server)
    .get('/api/v0/vendor/api/all-keys')
    .set('Authorization', 'Bearer ' + invalidRoleToken)
    .expect(401)
});


test('GET API Docs', async () => {
    await supertest(server).get('/api/v0/docs/')
      .expect(200);
  });
  
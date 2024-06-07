import supertest from 'supertest';
import * as http from 'http';

import * as db from './db';
import app from '../src/app';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(resolve));
  return await db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

const validAPIKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhMTRmYjdlLTJhMWQtNDFkNS04OTg1LTMwNTY4ZGM4YTdhOSIsIm5hbWUiOiJWaW4gVmVuZG9yIiwiZW1haWwiOiJ2aW5AdmVuZG9yLmNvbSIsImlhdCI6MTcxNjI4MDY0NywiZXhwIjoxNzQ3ODM4MjQ3fQ.pDYeDR_6mUxiU4-PsbzuMOxDn65iq2Iotu7G5Oh8Pjc';
const invalidAPIKey = 'your-invalid-api-key';

test("Verify a valid API key", async () => {
  await supertest(server)
    .post('/api/v0/vendor/verify')
    .send({ apikey: validAPIKey })
    .expect(200)
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.apikey).toBe(validAPIKey);
    });
});
  

test("Verify an invalid API key", async () => {
  await supertest(server)
    .post('/api/v0/vendor/verify')
    .send({ apikey: invalidAPIKey })
    .expect(401)
});

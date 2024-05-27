import supertest from 'supertest'
import * as http from 'http'
import * as db from './db';
import dotenv from 'dotenv'
dotenv.config()

import app from '../src/app'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export const molly = {
  email: 'molly@books.com',
  password: 'mollymember',
};

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(resolve));
  return  await db.reset();
});
  
afterAll((done) => {
  db.shutdown();
  server.close(done);
});
let mollycred:string;
test('Good Credentials Accepted', async () => {
  await supertest(server).post('/api/v0/authenticate')
    .send(molly)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.name).toBeDefined()
      expect(res.body.name).toEqual('Molly Member')
      expect(res.body.accessToken).toBeDefined()
      mollycred = res.body.accessToken;
    });
});
test('Post to cart',async()=>{
  await supertest(server)
    .post('/api/v0/Cart')
    .set('Authorization', 'Bearer ' + mollycred)
    .send({
      "productId": "string",
      "quantity": 0
    })
    .expect(201)
    .then((res)=>{
      console.log(res);
    });
});
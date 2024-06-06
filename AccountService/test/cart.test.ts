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
export const vin = {
  email: 'vin@vendor.com',
  password: 'vinvendor',
}

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(resolve));
  return  await db.reset();
});
  
afterAll((done) => {
  db.shutdown();
  server.close(done);
});
export interface Member {
  email: string;
  password: string;
}

async function loginAs(member: Member): Promise<string | undefined> {
  let accessToken;
  await supertest(server)
    .post('/api/v0/authenticate')
    .send({ email: member.email, password: member.password })
    .expect(200)
    .then((res) => {
      accessToken = res.body.accessToken;
    });
  return accessToken;
}
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
      expect(res.body).toBeDefined();
    });
});
test("Post to cart but not a member", async()=>{
  const accessToken = await loginAs(vin)
  await supertest(server)
    .post('/api/v0/Cart')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({
      "productId": "string",
      "quantity": 0
    })
    .expect(401);
})
test("Put to a cart, which is adding an item", async()=>{
  const accessToken = await loginAs(molly)
  await supertest(server)
    .put('/api/v0/Cart')
    .set('Authorization', 'Bearer ' + accessToken)
    .send([{
      id: "123456",
      quantity: 1
    }])
    .expect(201)
    .then((res)=>{
      expect(res.body).toBeDefined()
      expect(res.body).toContainEqual({id: "123456",quantity: 1})
    })
})
test("Put the same item in  cart, quanity should be 2", async()=>{
  const accessToken = await loginAs(molly)
  await supertest(server)
    .post('/api/v0/Cart')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({
      productId: "123456",
      quantity: 1
    })
    .expect(201)
    .then((res)=>{
      expect(res.body).toBeDefined()
      expect(res.body).toEqual({id: "123456",quantity: 2})
    })
})


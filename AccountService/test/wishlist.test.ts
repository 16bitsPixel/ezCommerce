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
let product: string
test("Post to wishlist", async()=>{
  const accessToken = await loginAs(molly)
  await supertest(server)
    .post('/api/v0/Wishlist')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({
      Productname: "Testing",
      Productid: "123456",
      description: ["Cool description"],
      price: 20,
      rating: 0, 
      images: ["Cool image url"]
    })
    .expect(201)
    .then((res)=>{
      expect(res.body).toBeDefined()
      product = res.body
      expect(res.body.id).toBeDefined()
      expect(res.body.Productname).toBe("Testing")
      expect(res.body.Productid).toBe("123456")
    })
});
test("Get new wishlist", async()=>{
  const accessToken = await loginAs(molly)
  await supertest(server)
    .get('/api/v0/Wishlist')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toBeDefined()
      expect(res.body).toContainEqual(product)
    })
    
})
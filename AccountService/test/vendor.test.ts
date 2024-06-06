import supertest from 'supertest'
import * as http from 'http'
import * as db from './db';
import dotenv from 'dotenv'
dotenv.config()

import app from '../src/app'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

// export const molly = {
//   email: 'molly@books.com',
//   password: 'mollymember',
// };
// export const vin = {
//   email: 'vin@vendor.com',
//   password: 'vinvendor',
// }

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

// async function loginAs(member: Member): Promise<string | undefined> {
//   let accessToken;
//   await supertest(server)
//     .post('/api/v0/authenticate')
//     .send({ email: member.email, password: member.password })
//     .expect(200)
//     .then((res) => {
//       accessToken = res.body.accessToken;
//     });
//   return accessToken;
// }
test("Get all vendors", async()=>{
  await supertest(server)
    .get('/api/v0/Vendor')
    .expect(200)
    .then((res)=>{
      expect(res.body).toBeDefined()
      expect(res.body).toContainEqual({name: 'Vin Vendor', vendorId: 'fa14fb7e-2a1d-41d5-8985-30568dc8a7a9', accepted: true});
    })
})
test("Create a vendor", async()=>{
  await supertest(server)
    .post('/api/v0/Signup')
    .send({"role": "vendor",
      "firstname": "Test",
      "lastname": "Deer",
      "email": "testing@gmail.com",
      "password": "test"})
    .expect(201);

})
test("Get all pending vednos", async()=>{
  await supertest(server)
    .get('/api/v0/Vendor/Pending')
    .expect(200);
})

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
test("Use restore endpoint", async()=>{
  const accessToken = await loginAs(molly)
  await supertest(server)
    .post(`/api/v0/restore?accessToken=${accessToken}`)
    .expect(200);
    
})
test("Use restore endpoin but bad jwt", async()=>{
  const accessToken = await loginAs(molly)
  await supertest(server)
    .post(`/api/v0/restore?accessToken=${accessToken}garbage`)
    .expect(204);
      
})

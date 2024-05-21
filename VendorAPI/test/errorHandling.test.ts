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
  return db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

export interface Member {
  email: string;
  password: string;
  name: string;
}
export const anna = {
  email: 'anna@books.com',
  password: 'annaadmin',
  name: "Anna Admin",
};
const tommy = {
  email: "tommy@books.com",
  password: "tommytimekeeper",
  name: "Tommy Timekeeper",
};


async function loginAs(member: Member): Promise<string | undefined> {
  let accessToken;
  await supertest(server)
    .post('/api/v0/login')
    .send({ email: member.email, password: member.password })
    .expect(200)
    .then((res) => {
      accessToken = res.body.accessToken;
    });
  return accessToken;
}
test('GET API Docs', async () => {
  await supertest(server).get('/api/v0/docs/')
    .expect(200);
});
test("Login as anna - wrong password", async() =>{
  await supertest(server)
    .post('/api/v0/login')
    .send({ email: anna.email, password: "wrong"})
    .expect(401)
});
test("Send a request to an ednpoint with no jwt", async() =>{
  await supertest(server)
    .get('/api/v0/member')
    .expect(401)
});
test("Anna tries to getall memeber when shes an admin", async() =>{
  const accessToken = await loginAs(anna);
  await supertest(server)
    .get('/api/v0/member')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(401)
});
test("corrupt JWT", async() =>{
  const accessToken = await loginAs(anna);
  await supertest(server)
    .get('/api/v0/member')
    .set('Authorization', 'Bearer ' + accessToken + 'garbage')
    .expect(401);   
});
// Create tommy 
test('Create tommy', async () => {
  const accessToken = await loginAs(anna);
  await supertest(server)
    .post('/api/v0/member/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(tommy)
    .expect(201);
});
test('Tommy tries to become freinds with a non existent friend id',async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .post(`/api/v0/friend/` + 'bf1512d4-2e90-401b-af4b-a53a3da06b3b')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(404);
});
test('Tommy tries to delete non existent friend id',async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .delete(`/api/v0/friend/` + 'bf1512d4-2e90-401b-af4b-a53a3da06b3b')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(404);
});
test('anna tries to create someone with tommys email',async() =>{
  const accessToken = await loginAs(anna);
  await supertest(server)
    .post('/api/v0/member/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({name:"bob", password:"steve", email:tommy.email})
    .expect(409);
});
test('Tommy tries to make a post with out of range page',async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get(`/api/v0/post?page=100`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(0);
    })
});
test('Tommy tries to make a post with wrong argument for page - letters',async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get(`/api/v0/post?page=abcdef`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(400);
});
test('Tommy tries to make a post with wrong argument for page - negative #',async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get(`/api/v0/post?page=-10`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(400);
});
test('Tommy tries to make a post with wrong argument for page - 0',async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get(`/api/v0/post?page=0`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(400);
});
test('Tommy tries to make a post with wrong argument for stringified #',async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get(`/api/v0/post?page='10'`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(400);
});
test('Tommy tries to make a post with wrong argument for page - floating point',async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get(`/api/v0/post?page=4.2`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(400);
});
test('Tommy tries to make a post with wrong np page',async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get(`/api/v0/post`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(400);
});






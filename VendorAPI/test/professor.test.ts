import supertest from 'supertest';
import * as http from 'http';

import app from '../src/app';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(resolve));
});

afterAll((done) => {
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
let tommyId: string;
const tommyPosts: Array<string> = [];
//const tommyPosts: Array<string> = [];

const timmy = {
  email: "timmy@books.com",
  password: "timmyteaboy",
  name: "Timmy Teaboy",
};
let timmyId: string;
const timmyPosts: Array<string> = [];

const terry = {
  email: "terry@books.com",
  password: "terrytroublemaker",
  name: "Terry Troublemaker",
};
let terryId: string;
const terryPosts: Array<string> = [];
// const post = {
//   content: 'Some old guff',
//   image:
//     'https://communications.ucsc.edu/wp-content/uploads/2016/11/ucsc-seal.jpg',
// };

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
test('Create tommy,timmy,terry and check fomat', async () => {
  const accessToken = await loginAs(anna);
  await supertest(server)
    .post('/api/v0/member/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(tommy)
    .expect(201)
    .then((res) => {
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
      expect(Object.keys(res.body)).toHaveLength(2);
      tommyId = res.body.id;
    });
  await supertest(server)
    .post('/api/v0/member/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(timmy)
    .expect(201)
    .then((res) => {
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
      expect(Object.keys(res.body)).toHaveLength(2);
      timmyId = res.body.id;
    });
  await supertest(server)
    .post('/api/v0/member/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(terry)
    .expect(201)
    .then((res)=>{
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
      expect(Object.keys(res.body)).toHaveLength(2);
      terryId = res.body.id;
    });
});
test('Tommy requests Timmy be his friend', async()=>{
  const accessToken = await loginAs(tommy)
  await supertest(server)
    .post('/api/v0/friend/' + timmyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);
});
test('Timmy accepts the request', async()=>{
  const accessToken = await loginAs(timmy)
  await supertest(server)
    .put('/api/v0/request/' + tommyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);
});
test('Terry requests Tommy be his friend', async()=>{
  const accessToken = await loginAs(terry)
  await supertest(server)
    .post('/api/v0/friend/' + tommyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);
});
test('Tommy accepts', async()=>{
  const accessToken = await loginAs(tommy)
  await supertest(server)
    .put('/api/v0/request/' + terryId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);
});
test("Tommy should now have 3 friends",async()=>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get('/api/v0/friend')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) =>{
      expect(res.body).toHaveLength(2);
    })
});
test('Tommy creates 3 posts', async()=>{
  const accessToken = await loginAs(tommy)
  for (let i = 0; i < 3; i ++){
    await supertest(server)
      .post('/api/v0/post/')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({content: `${i}-Tommy`, image: 'https://www.google.com'})
      .expect(201)
      .then((res)=>{
        tommyPosts.push(res.body);
      });
  }
});
test('Timmy creates 2 posts', async()=>{
  const accessToken = await loginAs(timmy)
  for (let i = 0; i < 2; i ++){
    await supertest(server)
      .post('/api/v0/post/')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({content: `${i}-timy`, image: 'https://www.google.com'})
      .expect(201)
      .then((res)=>{
        timmyPosts.push(res.body);
      });
  }
});
test('Terry creates 1 posts', async()=>{
  const accessToken = await loginAs(terry)
  for (let i = 0; i < 1; i ++){
    await supertest(server)
      .post('/api/v0/post/')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({content: `${i}-terry`, image: 'https://www.google.com'})
      .expect(201)
      .then((res)=>{
        terryPosts.push(res.body);
      });
  }
});
test("Tommy can see Tommy's posts, terry and his own", async () => {
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get('/api/v0/post?page=1')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveLength(6);
      expect(res.body[0]).toEqual(terryPosts[0]);
      expect(res.body[1]).toEqual(timmyPosts[1]);
      expect(res.body[2]).toEqual(timmyPosts[0]);
      expect(res.body[3]).toEqual(tommyPosts[2]);
      expect(res.body[4]).toEqual(tommyPosts[1]);
      expect(res.body[5]).toEqual(tommyPosts[0]);
    });
});
test("timmy can see Tommy's posts and his own", async () => {
  const accessToken = await loginAs(timmy);
  await supertest(server)
    .get('/api/v0/post?page=1')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveLength(5);
      expect(res.body[0]).toEqual(timmyPosts[1]);
      expect(res.body[1]).toEqual(timmyPosts[0]);
      expect(res.body[2]).toEqual(tommyPosts[2]);
      expect(res.body[3]).toEqual(tommyPosts[1]);
      expect(res.body[4]).toEqual(tommyPosts[0]);
    });
});
test("Terry can see Tommy's posts and his own", async () => {
  const accessToken = await loginAs(terry);
  await supertest(server)
    .get('/api/v0/post?page=1')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveLength(4);
      expect(res.body[0]).toEqual(terryPosts[0]);
      expect(res.body[1]).toEqual(tommyPosts[2]);
      expect(res.body[2]).toEqual(tommyPosts[1]);
      expect(res.body[3]).toEqual(tommyPosts[0]);
    });
});
  
  

  




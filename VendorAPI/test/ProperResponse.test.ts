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
let tommyId: string;
//const tommyPosts: Array<string> = [];
//const tommyPosts: Array<string> = [];

const timmy = {
  email: "timmy@books.com",
  password: "timmyteaboy",
  name: "Timmy Teaboy",
};
let timmyId: string;
// const timmyPosts: Array<string> = [];

const terry = {
  email: "terry@books.com",
  password: "terrytroublemaker",
  name: "Terry Troublemaker",
};
let terryId: string;

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
test("Login as anna", async() =>{
  await supertest(server)
    .post('/api/v0/login')
    .send({ email: anna.email, password: anna.password })
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("accessToken");
      expect(Object.keys(res.body)).toHaveLength(3);
    });
});

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
// Grab all members , anna shouldnt be in there
test("Grab all members - ANna shouldnt not be there", async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get('/api/v0/member')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(3)
      expect(res.body).toContainEqual({id: tommyId, name: tommy.name});
      expect(res.body).toContainEqual({id: terryId, name: terry.name});
      expect(res.body).toContainEqual({id: timmyId, name: timmy.name});
    })
});
test('Check request for timmy should be empty', async() =>{
  const accessToken = await loginAs(timmy);
  await supertest(server)
    .get(`/api/v0/request`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(0);
    })
});
test('tommy sends a request to timmy ', async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .post(`/api/v0/friend/` + timmyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201)
    .then((res)=>{
      expect(res.body).toEqual({id: timmyId, name: timmy.name, accepted: false});
    })
});
test('Tommys request should be empty', async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .get(`/api/v0/request`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(0);
    });
});
test('timmy accepts said request from tommy', async() =>{
  // Check current request for timy
  const accessToken = await loginAs(timmy);
  await supertest(server)
    .get(`/api/v0/request`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toEqual({id: tommyId, name: tommy.name});
    });
  // Now accept it 
  await supertest(server)
    .put(`/api/v0/request/` + tommyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201)
    .then((res)=>{
      expect(res.body).toEqual({id: tommyId, name: tommy.name});
    });
});
test('Now check request for timmy should be empty since tommy & timmy are now friends', async() =>{
  const accessToken = await loginAs(timmy);
  await supertest(server)
    .get(`/api/v0/request`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(0);
    });
});
test('Verify that tommy and timmy are now friends',async()=>{
  let accessToken = await loginAs(timmy)
  await supertest(server)
    .get(`/api/v0/friend`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toEqual({id: tommyId, name: tommy.name, accepted: true});
    });

  // Now verify for tommy 
  accessToken = await loginAs(tommy)
  await supertest(server)
    .get(`/api/v0/friend`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toEqual({id: timmyId, name: timmy.name, accepted: true});
    });
});
test("let timmy become friends with terry ", async()=>{
  const accessToken = await loginAs(timmy);
  await supertest(server)
    .post(`/api/v0/friend/` + terryId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);
});
test("Timmy should have 2 frieds now and terry should have none thru the friend enpoint", async()=>{
  let accessToken = await loginAs(timmy);
  await supertest(server)
    .get(`/api/v0/friend`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(2);
      expect(res.body).toContainEqual({id: terryId, name: terry.name, accepted: false});
    });

  accessToken = await loginAs(terry);
  await supertest(server)
    .get(`/api/v0/friend`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(0);
    });

});
test("Terry accept timmy's request", async()=>{
  const accessToken = await loginAs(terry)
  await supertest(server)
    .put(`/api/v0/request/` + timmyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);
});
test(" Now delete the friendship between terry and timmy", async()=>{
  const accessToken = await loginAs(terry)
  await supertest(server)
    .delete(`/api/v0/friend/` + timmyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toEqual({id: timmyId, name: timmy.name, accepted: true});
    });
});



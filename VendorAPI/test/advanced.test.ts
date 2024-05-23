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
//   return db.reset();
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
//const tommyPosts: Array<string> = [];
const Bob = {
  email: "bob@books.com",
  password: "bobby",
  name: "Bob",
};
let bobID: string;
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

test('Anna creates Tommy, Timmy and Terry, Bob', async () => {
  const accessToken = await loginAs(anna);
  await supertest(server)
    .post('/api/v0/member/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(tommy)
    .expect(201)
    .then((res) => {
      tommyId = res.body.id;
    });
  await supertest(server)
    .post('/api/v0/member/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(timmy)
    .expect(201)
    .then((res) => {
      timmyId = res.body.id;
    });
  await supertest(server)
    .post('/api/v0/member/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(terry)
    .expect(201)
    .then((res)=>{
      terryId = res.body.id;
    });
  await supertest(server)
    .post('/api/v0/member/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(Bob)
    .expect(201)
    .then((res)=>{
      bobID = res.body.id;
    });
});
// __________Friend request and accept tests __________________
test("Tommy send a freind request to timmy", async () => {
  const accessToken = await loginAs(tommy);
  console.log(timmyId);
  await supertest(server)
    .post('/api/v0/friend/' + timmyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);

  // Tommy send the request therefore he shouldnt see it
  await supertest(server)
    .get(`/api/v0/request`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveLength(0);
    });
});
test("LET Timmy check his current requests and accepts tommy", async () => {
  // Timmy should see the request 
  const accessToken = await loginAs(timmy);
  await supertest(server)
    .get(`/api/v0/request`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) => {
      expect(res.body).toContainEqual({id: tommyId, name: 'Tommy Timekeeper'})
    });
  // NOW accept the request
  await supertest(server)
    .put(`/api/v0/request/${tommyId}`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201)
    .then((res) => {
      expect(res.body).toEqual({id: tommyId, name: 'Tommy Timekeeper'});
    });

  // Now lets double check that request is no long in request since its been accepted
  await supertest(server)
    .get(`/api/v0/request`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveLength(0);
    });
});

// Spam Bob with friend request and see if they all apear in the friend endpoint
test("Spam Bob with freind reqeust", async() =>{
  let accessToken = await loginAs(tommy);
  await supertest(server)
    .post('/api/v0/friend/' + bobID)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);

  accessToken = await loginAs(timmy);
  await supertest(server)
    .post('/api/v0/friend/' + bobID)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);

  accessToken = await loginAs(terry);
  await supertest(server)
    .post('/api/v0/friend/' + bobID)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201);
})

test("Bob sends request back to tommy and timmy - Invalid and then accepts them", async() =>{
  const accessToken = await loginAs(Bob);
  await supertest(server)
    .post('/api/v0/friend/' + timmyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(409);

  await supertest(server)
    .post('/api/v0/friend/' + tommyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(409);

  await supertest(server)
    .get('/api/v0/friend')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) =>{
      expect(res.body).toHaveLength(0);
    })
  // Accept requests
  await supertest(server)
    .put(`/api/v0/request/${timmyId}`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201)
    .then((res) => {
      expect(res.body).toEqual({id: timmyId, name: 'Timmy Teaboy'});
    });
  await supertest(server)
    .put(`/api/v0/request/${terryId}`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201)
    .then((res) => {
      expect(res.body).toEqual({id: terryId, name: 'Terry Troublemaker'});
    });
  await supertest(server)
    .put(`/api/v0/request/${tommyId}`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(201)
    .then((res) => {
      expect(res.body).toEqual({id: tommyId, name: 'Tommy Timekeeper'});
    });
  // Lets check now friend should be 3 
  await supertest(server)
    .get('/api/v0/friend')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) =>{
      expect(res.body).toHaveLength(3);
    });
  // For good mesaure let check that request is empty too
  await supertest(server)
    .get(`/api/v0/request`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveLength(0);
    });
})
test("No longer friends with terry", async() =>{
  const accessToken = await loginAs(Bob);
  await supertest(server)
    .delete(`/api/v0/friend/` + terryId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toEqual({id:terryId, name:"Terry Troublemaker", accepted: true});
    });
  await supertest(server)
    .get('/api/v0/friend')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res) =>{
      expect(res.body).toHaveLength(2);
    });
});
test("Try to accept a request when were already freinds", async() =>{
  const accessToken = await loginAs(Bob);
  await supertest(server)
    .put(`/api/v0/request/` + tommyId)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(404)
});
const BobPosts:  Array<string> = [];
test("Let Bob make 25 post", async() =>{
  const accessToken = await loginAs(Bob);
  for (let i = 1; i < 26; i++ ){
    await supertest(server)
      .post(`/api/v0/post`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({content: `${i}`, image: "https://www.google.com"})
      .expect(201)
      .then((res)=>{
        BobPosts.push(res.body);
      })
  }
});
test("Bob wants to see his post which should be only his last 20 post", async() =>{
  const accessToken = await loginAs(Bob);
  await supertest(server)
    .get(`/api/v0/post?page=1`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(20);
      expect(res.body).toEqual((BobPosts.slice().reverse()).slice(0,-5));
    });
});
test("Bob wants to see his post which should be only his first 5 post", async() =>{
  const accessToken = await loginAs(Bob);
  await supertest(server)
    .get(`/api/v0/post?page=2`)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .then((res)=>{
      expect(res.body).toHaveLength(5);
      expect(res.body).toEqual((BobPosts.slice().reverse()).slice(20));
    });
});

test("Try to sent Bob a friend request when were already friends", async() =>{
  const accessToken = await loginAs(tommy);
  await supertest(server)
    .post('/api/v0/friend/' + bobID)
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(409);
});




  
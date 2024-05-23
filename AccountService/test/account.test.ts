/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

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

export const bad = {
  email: 'molly@books.com',
  password: 'notmollyspassword',
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

test('GET Invalid URL', async () => {
  await supertest(server).get('/api/v0/accounty-wounty')
    .expect(404)
});

test('GET API Docs', async () => {
  await supertest(server).get('/api/v0/docs/')
    .expect(200)
});
let annacred:string;
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
      annacred = res.body.accessToken;
    });
});
test("corrupt JWT", async() =>{
  await supertest(server)
    .get('/api/v0/Cart?accountId=hello')
    .set('Authorization', 'Bearer ' + annacred + 'garbage')
    .expect(401);   
});
test("Molly gets her cart", async()=>{
  await supertest(server)
    .get('/api/v0/Cart')
    .set('Authorization', 'Bearer ' + annacred)
    .expect(200);   
});
test('Bad Credentials Rejected', async () => {
  await supertest(server).post('/api/v0/authenticate')
    .send(bad)
    .expect(401)
});

test('Good Access Token Authenticated', async () => {
  let accessToken
  await supertest(server).post('/api/v0/authenticate')
    .send(molly)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.name).toBeDefined()
      expect(res.body.name).toEqual('Molly Member')
      expect(res.body.accessToken).toBeDefined()
      accessToken = res.body.accessToken
    });
  await supertest(server).get('/api/v0/authenticate?accessToken=' + accessToken)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.id).toBeDefined()
      expect(res.body.role).toBeDefined()
      expect(res.body.role).toEqual('member')
    });
});

test('Bad Access Token Rejected', async () => {
  await supertest(server).get('/api/v0/authenticate?accessToken=garbage')
    .expect(401)
});

test('Signup - test ', async()=>{
  await supertest(server)
    .post('/api/v0/Signup')
    .send({"role": "member",
      "firstname": "John",
      "lastname": "Deer",
      "email": "johndeer@gmail.com",
      "password": "John"})
    .expect(201);
});
test('Now try to login as John', async()=>{
  await supertest(server).post('/api/v0/authenticate')
    .send({
      email: 'johndeer@gmail.com',
      password: 'John',
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.name).toBeDefined()
      expect(res.body.name).toEqual('John Deer')
      expect(res.body.accessToken).toBeDefined()
    });
});
test('Signup - test failure ', async()=>{
  await supertest(server)
    .post('/api/v0/Signup')
    .send({"role": "member",
      "firstname": "John",
      "lastname": "Deer",
      "email": "johndeer@gmail.com",
      "password": "John"})
    .expect(409);
});
test("Check a verified vendor",async()=>{
  await supertest(server)
    .post('/api/v0/Verify')
    .send({
      email: 'vin@vendor.com',
      password: 'vinvendor',
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body).toBeTruthy();
    });
});


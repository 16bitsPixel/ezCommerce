/*
#######################################################################
#
# Copyright (C) 2020-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import http from 'http'
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler'
import * as login from './login';

import { Credentials} from '../../src/graphql/auth/schema'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

let anna = false
let deny = false

const handlers = [
  rest.post('http://localhost:3011/api/v0/authenticate', async ({ request }) => {
    const credentials = await request.json() as Credentials
    if (credentials.email == 'molly@books.com') {
      return HttpResponse.json(
        {name: 'Molly Member', accessToken: 'Some-Fake-JWT'}, { status: 200 })
    } else if (credentials.email == 'anna@books.com') {
      anna = true
      return HttpResponse.json(
        {name: 'Anna Admin', accessToken: 'Some-Fake-JWT'}, { status: 200 })
    } else {
      return HttpResponse.json({}, { status: 401 })
    }
  }),
  rest.get('http://localhost:3011/api/v0/authenticate', async ({ request }) => {
    if (deny) {
      return HttpResponse.json({}, { status: 401 })
    } else {
      return HttpResponse.json(
        {role: anna ? 'admin' : 'member', id: 'Some-Fake-ID'}, { status: 200 })
    }
  }),
]

const microServices = setupServer(...handlers)

beforeAll( async () => {
  microServices.listen({onUnhandledRequest: 'bypass'})
  server = http.createServer(requestHandler)
  server.listen()
})

beforeEach(() => {
  anna = false
  deny = false
})

afterEach(() => {
  microServices.resetHandlers()
})

afterAll((done) => {
  microServices.close()
  server.close(done)
})

const bad = {
  email: 'molly_at_books.com',
  password: 'mollymember',
};

const wrong = {
  email: 'molly@not.com',
  password: 'notmollyspasswd',
};

test('Correct Credentials', async () => {
  const member = login.molly;
  await supertest(server)
    .post('/api/graphql')
    .send({query: `{login(email: "${member.email}" password: 
      "${member.password}") { name, accessToken }}`})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.data.login.name).toEqual('Molly Member')
      expect(res.body.data.login.accessToken).toBeDefined()
    });
});

test('Wrong Credentials', async () => {
  const member = wrong;
  await supertest(server)
    .post('/api/graphql')
    .send({query: `{login(email: "${member.email}" password: 
      "${member.password}") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors.length).toEqual(1)
    });
});

test('Bad Format', async () => {
  const member = bad;
  await supertest(server)
    .post('/api/graphql')
    .send({query: `{login(email: "${member.email}" password: 
      "${member.password}") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors.length).toEqual(1)
      expect(res.body.errors[0].message).toEqual(`Argument Validation Error`)
    });
});

test('Corrupt JWT', async () => {
  deny = true
  const accessToken = await login.asMolly(supertest(server));
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken + 'garbage')
    .send({query: '{book {isbn}}'})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors.length).toEqual(1)
      expect(res.body.errors[0].message).toEqual(`Access denied! You don't have permission for this action!`)
    });
});

test('No auth header', async () => {
  await supertest(server)
    .post('/api/graphql')
    .send({query: '{book {isbn}}'})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors.length).toEqual(1)
      expect(res.body.errors[0].message).toEqual(`Access denied! You don't have permission for this action!`)
    });
});

test('Bad Auth Header (no Bearer) ', async () => {
  const accessToken = await login.asMolly(supertest(server));
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Foobler ' + accessToken)
    .send({query: '{book {isbn}}'})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors.length).toEqual(1)
      expect(res.body.errors[0].message).toEqual(`Access denied! You don't have permission for this action!`)
    });
});

test('Incorrect Roles (Anna is not a member)', async () => {
  const accessToken = await login.asAnna(supertest(server));
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: '{book {isbn}}'})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors.length).toEqual(1)
      expect(res.body.errors[0].message).toEqual(`Access denied! You don't have permission for this action!`)
    });
});

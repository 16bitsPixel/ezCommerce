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

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let accessToken: string | undefined

const books = [{
  "isbn": "Some ISBN 3",
  "title": "Some Title 3",
  "author": "Some Author",
  "publisher": "Some Publisher",
},{
  "isbn": "Some ISBN 1",
  "title": "Some Title 1",
  "author": "Some Author",
  "publisher": "Some Publisher",
},{
  "isbn": "Some ISBN 2",
  "title": "Some Title 2",
  "author": "Some Author",
  "publisher": "Some Publisher",
},
]

const handlers = [
  rest.post('http://localhost:3011/api/v0/authenticate', async ({ request }) => {
    const credentials = await request.json()
    return HttpResponse.json(
      {name: 'Some Name', accessToken: 'Some-Fake-JWT'}, { status: 200 })
  }),
  rest.get('http://localhost:3011/api/v0/authenticate', async ({ request }) => {
    return HttpResponse.json(
      {role: 'member', id: 'Some-Fake-ID'}, { status: 200 })
  }),
  rest.get('http://localhost:3012/api/v0/book', async ({ request }) => {
    return HttpResponse.json(books,  { status: 200 })
  }),
]

const microServices = setupServer(...handlers)

beforeAll( async () => {
  microServices.listen({onUnhandledRequest: 'bypass'})
  server = http.createServer(requestHandler)
  server.listen()
  accessToken = await login.asMolly(supertest(server))
})

afterEach(() => {
  microServices.resetHandlers()
})

afterAll((done) => {
  microServices.close()
  server.close(done)
})

test('GET All', async () => {
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: '{book {isbn, title, author}}'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.data).toBeDefined()
      expect(res.body.data.book).toBeDefined()
      expect(res.body.data.book.length).toEqual(3)
    });
});

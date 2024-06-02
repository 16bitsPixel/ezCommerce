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
/*
#######################################################################
#                   DO NOT MODIFY THIS FILE
#######################################################################
*/

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
  return  await db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhMTRmYjdlLTJhMWQtNDFkNS04OTg1LTMwNTY4ZGM4YTdhOSIsInJvbGUiOiJ2ZW5kb3IiLCJlbWFpbCI6InZpbkB2ZW5kb3IuY29tIiwibmFtZSI6IlZpbiBWZW5kb3IiLCJwYXNzd29yZCI6InZpbnZlbmRvciIsImlhdCI6MTcxNzM2OTgwNCwiZXhwIjoxNzQ4OTI3NDA0fQ.cuo6eT53bgep9Y-1ANB_D1rnUaVC9NqKA3zSy5-gDmQ'
test("Get all api keys for a vendor", async()=>{
  await supertest(server)
    .get('/api/v0/vendor/api/all-keys')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200);
})


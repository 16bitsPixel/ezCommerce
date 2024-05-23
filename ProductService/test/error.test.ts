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

import supertest from 'supertest';
import * as http from 'http';

process.env.POSTGRES_DB='doesnotexist';
import app from '../src/app';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

beforeAll(() => {
  server = http.createServer(app)
  server.listen()
})

afterAll(async () => {
  server.close()
})

test('Error when no database', async () => {
  await supertest(server)
    .get('/api/v0/product')
    .expect(500);
});
import supertest from 'supertest';
import http from 'http';
import requestHandler from './requestHandler';
import * as login from './login';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen();
});

afterAll((done) => {
  server.close(done);
});

const mockCredentials = {
  email: 'test@user.com',
  password: 'password123'
};

const mockSignup = {
  role: 'user',
  firstname: 'Test',
  lastname: 'User',
  email: 'newuser@test.com',
  password: 'newpassword123'
};

const mockAccessToken = 'validAccessToken';

// // 1. Test login with valid credentials
// it('Logs in with valid credentials', async () => {
//   await supertest(server).post('/api/v0/authenticate')
//     .send(mockCredentials)
//     .expect(200)
//     .then((res) => {
//       expect(res.body).toBeDefined();
//       expect(res.body.accessToken).toBeDefined();
//     });
// });

// 2. Test login with invalid credentials
it('Fails login with invalid credentials', async () => {
  await supertest(server).post('/api/v0/authenticate')
    .send({ email: 'wrong@user.com', password: 'wrongpassword' })
    .expect(404);
});

// // 3. Test signup
// it('Signs up a new user', async () => {
//   await supertest(server).post('/api/v0/Signup')
//     .send(mockSignup)
//     .expect(201)
//     .then((res) => {
//       expect(res.body).toBeDefined();
//       expect(res.body.success).toBe(true);
//     });
// });

// // 4. Test restoring session with valid access token
// it('Restores session with valid access token', async () => {
//   await supertest(server).post(`/api/v0/restore?accessToken=${mockAccessToken}`)
//     .expect(200)
//     .then((res) => {
//       expect(res.body).toBeDefined();
//       expect(res.body.accessToken).toBe(mockAccessToken);
//     });
// });

// // 5. Test restoring session with invalid access token
// it('Fails to restore session with invalid access token', async () => {
//   await supertest(server).post('/api/v0/restore?accessToken=invalidToken')
//     .expect(401);
// });

// // 6. Test authentication check
// it('Checks authentication with valid token', async () => {
//   await supertest(server).get('/api/v0/authenticate')
//     .set('Authorization', `Bearer ${mockAccessToken}`)
//     .expect(200);
// });

// it('Fails authentication check with invalid token', async () => {
//   await supertest(server).get('/api/v0/authenticate')
//     .set('Authorization', 'Bearer invalidToken')
//     .expect(401);
// });

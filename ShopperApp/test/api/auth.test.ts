import supertest from 'supertest';
import http from 'http';
import requestHandler from './requestHandler';

global.fetch = jest.fn();

let server: http.Server;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen(3000);
});

afterAll(() => {
  server.close();
});

describe('AuthResolver', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });


  describe('login', () => {
    it('should return authenticated user on successful login', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ name: 'testUser', accessToken: 'testToken' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              login(email: "molly@books.com" password: "mollymember") {
                name
                accessToken
              }
            }
          `,
        })
        .expect(200);
      expect(response.body.data.login).toEqual({ name: 'testUser', accessToken: 'testToken' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate', expect.any(Object));
    });

    it('should throw an error on failed login', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Unauthorised' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              login(email: "molly@books.com" password: "wrongpassword") {
                name
                accessToken
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
    });
  });

  describe('restore', () => {
    it('should return authenticated user on successful restore', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ name: 'testUser', accessToken: 'testToken' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              restore(accessToken: "testToken") {
                name
                accessToken
              }
            }
          `,
        })
        .expect(200);
      expect(response.body.data.restore).toEqual({ name: 'testUser', accessToken: 'testToken' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/restore?accessToken=testToken', expect.any(Object));
    });

    it('should throw an error on failed restore', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Unauthorised' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              restore(accessToken: "invalidToken") {
                name
                accessToken
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
    });
  });

  // describe('check', () => {
  //   it('should return session user on successful check', async () => {
  //     const mockResponse = {
  //       ok: true,
  //       json: jest.fn().mockResolvedValue({ id: '1', role: 'user' }),
  //     };
  //     (fetch as jest.Mock).mockResolvedValue(mockResponse);

  //     const response = await supertest(server)
  //       .post('/api/graphql')
  //       .send({
  //         query: `
  //           query {
  //             check(authHeader: "Bearer testToken") {
  //               id
  //               accessToken
  //             }
  //           }
  //         `,
  //       })
  //       .expect(200);
  //     expect(response.body.data.check).toEqual({ id: '1', accessToken: 'testToken' });
  //     expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
  //   });

  //   it('should throw an error on failed check', async () => {
  //     const mockResponse = {
  //       ok: false,
  //       json: jest.fn().mockResolvedValue({ message: 'Unauthorised' }),
  //     };
  //     (fetch as jest.Mock).mockResolvedValue(mockResponse);

  //     const response = await supertest(server)
  //       .post('/api/graphql')
  //       .send({
  //         query: `
  //           query {
  //             check(authHeader: "Bearer invalidToken") {
  //               id
  //               accessToken
  //             }
  //           }
  //         `,
  //       })
  //       .expect(200);

  //     expect(response.body.errors).toBeTruthy();
  //   });
  // });

  describe('signup', () => {
    it('should return true on successful signup', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(true),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            mutation signup{
              signup(
                role: "member"
                firstname: "test"
                lastname: "last"
                email: "email@gmail.com"
                password: "password"
              ) 
            }
          `,
        })
        .expect(200);
      expect(response.body.data.signup).toBe(true);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Signup', expect.any(Object));
    });

    it('should throw an error on failed signup', async () => {
      const mockResponse = {
        ok: false,
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            mutation {
              signup(
                role: "member"
                firstname: "test"
                lastname: "last"
                email: "email@gmail.com"
                password: "password"
              )
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
    });
  });

  describe('isVerified', () => {
    it('should return true if credentials are verified', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(true),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              isVerified(email: "test", password: "password") 
            }
          `,
        })
        .expect(200);
      expect(response.body.data.isVerified).toBe(true);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Verify', expect.any(Object));
    });

    it('should throw an error if credentials are not verified', async () => {
      const mockResponse = {
        ok: false,
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              isVerified(email: "test", password: "password") 
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
    });
  });
});

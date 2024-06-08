import supertest from 'supertest';
import http from 'http';
import requestHandler from './requestHandler';
import { AuthService } from '@/graphql/auth/service';

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

// describe('AuthService', () => {
//   let authService: AuthService;

//   beforeEach(() => {
//     authService = new AuthService();
//     (fetch as jest.Mock).mockClear();
//   });

//   describe('check', () => {
//     it('should reject with "Unauthorised" if no authHeader is provided', async () => {
//       await expect(authService.check()).rejects.toThrow('Unauthorised');
//     });

//     it('should reject with "Unauthorised" if authHeader format is incorrect', async () => {
//       await expect(authService.check('InvalidHeader')).rejects.toThrow('Unauthorised');
//     });

//     it('should throw an error if the fetch response is not ok', async () => {
//       (fetch as jest.Mock).mockResolvedValueOnce({
//         ok: false,
//       } as any);

//       await expect(authService.check('Bearer testToken')).rejects.toThrow('Unauthorised');
//     });

//     it('should reject with "Unauthorised" if user role does not match', async () => {
//       (fetch as jest.Mock).mockResolvedValueOnce({
//         ok: true,
//         json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'user' }),
//       } as any);

//       await expect(authService.check('Bearer testToken', ['admin'])).rejects.toThrow('Unauthorised');
//     });

//     it('should resolve with session user if authentication and authorization succeed', async () => {
//       (fetch as jest.Mock).mockResolvedValueOnce({
//         ok: true,
//         json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'user' }),
//       } as any);

//       await expect(authService.check('Bearer testToken', ['user'])).resolves.toEqual({ id: 'testUser', accessToken: 'testToken' });
//     });
//   });
// });

describe('CartResolver', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('Check', () => {
    it('cart but your access is bad', async () => {
      const mockResponse = {
        ok: false,
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            query {
              Cart {
                id
                quantity
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].message).toBe("Access denied! You don't have permission for this action!");
    });
  });

  it('cart but not a member', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'admin' }),
    } as any);

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ cart: [{ id: '1', quantity: 2 }] }),
    } as any);

    const response = await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer testToken')
      .send({
        query: `
          query {
            Cart {
              id
              quantity
            }
          }
        `,
      })
      .expect(200);

    // console.log('#########')
    // console.log(response.body)
    expect(response.body.errors[0].message).toBe("Access denied! You don't have permission for this action!");
  });

  it('cart but no auth header', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
    } as any);

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ cart: [{ id: '1', quantity: 2 }] }),
    } as any);

    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `
          query {
            Cart {
              id
              quantity
            }
          }
        `,
      })
      .expect(200);

    // console.log(response.body)
    expect(response.body.errors[0].message).toBe("Access denied! You don't have permission for this action!");
  });

  it('cart but not a bearrer is set', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
    } as any);

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ cart: [{ id: '1', quantity: 2 }] }),
    } as any);

    const response = await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Nothing testToken')
      .send({
        query: `
          query {
            Cart {
              id
              quantity
            }
          }
        `,
      })
      .expect(200);

    // console.log(response.body)
    expect(response.body.errors[0].message).toBe("Access denied! You don't have permission for this action!");
  });
});

import supertest from 'supertest';
import http from 'http';
import requestHandler from './requestHandler'; // Adjust the import path

global.fetch = jest.fn();

let server: http.Server;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen(3001);
});

afterAll(() => {
  server.close();
});

export const anna = {
  email: 'anna@books.com',
  password: 'annaadmin',
  name: "Anna Admin",
};

export interface Member {
  email: string;
  password: string;
}

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
              login(email: "anna@books.com" password: "annaadmin") {
                name
                accessToken
              }
            }
          `,
        })
        .expect(200);
      console.log(response.body)
      expect(response.body.data.login).toEqual({ name: 'testUser', accessToken: 'testToken' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate', expect.any(Object));
    });

    it('should throw an error on failed login', async () => {
      const mockResponse = {
        ok: false,
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
          mutation signup{signup
            (role: "vendor" firstname: "test" lastname: "last" email: "email@gmail.com" password: "password")}
          `,
        })
        .expect(200);
      console.log(response.body);
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
          mutation signup{signup
            (role: "vendor" firstname: "test" lastname: "last" email: "email@gmail.com" password: "password")}
          `,
        })
        .expect(200);
      expect(response.body.errors).toBeTruthy();
    });
  });
});
import supertest from 'supertest';
import http from 'http';
import requestHandler from './requestHandler';
import { AuthService } from '@/graphql/auth/service';
import { Credentials, SignupCred, AccessToken } from '@/graphql/auth/schema';

global.fetch = jest.fn();

let server: http.Server;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen(3002);
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

describe('AuthService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  const authService = new AuthService();

  describe('login', () => {
    it('should return authenticated user on successful login', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ name: 'testUser', accessToken: 'testToken' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const credentials: Credentials = { email: 'anna@books.com', password: 'annaadmin' };
      const result = await authService.login(credentials);

      expect(result).toEqual({ name: 'testUser', accessToken: 'testToken' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate', expect.any(Object));
    });

    it('should throw an error on failed login', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Unauthorised' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const credentials: Credentials = { email: 'molly@books.com', password: 'wrongpassword' };

      await expect(authService.login(credentials)).rejects.toThrow('Unauthorised');
    });
  });

  describe('restore', () => {
    it('should return authenticated user on successful restore', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ name: 'testUser', accessToken: 'testToken' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const accessToken: AccessToken = { accessToken: 'testToken' };
      const result = await authService.restore(accessToken);

      expect(result).toEqual({ name: 'testUser', accessToken: 'testToken' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/restore?accessToken=testToken', expect.any(Object));
    });

    it('should throw an error on failed restore', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Unauthorised' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const accessToken: AccessToken = { accessToken: 'invalidToken' };

      await expect(authService.restore(accessToken)).rejects.toThrow('Unauthorised');
    });
  });

  describe('check', () => {
    it('should return session user on successful check', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ id: '1', role: 'user' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const authHeader = 'Bearer testToken';
      const result = await authService.check(authHeader);

      expect(result).toEqual({ id: '1', accessToken: 'testToken' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
    });

    it('should throw an error on failed check', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Unauthorised' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const authHeader = 'Bearer invalidToken';

      await expect(authService.check(authHeader)).rejects.toThrow('Unauthorised');
    });
  });

  describe('signup', () => {
    it('should return true on successful signup', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(true),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const signupCred: SignupCred = {
        role: 'vendor',
        firstname: 'test',
        lastname: 'last',
        email: 'email@gmail.com',
        password: 'password',
      };
      const result = await authService.signup(signupCred);

      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Signup', expect.any(Object));
    });

    it('should throw an error on failed signup', async () => {
      const mockResponse = {
        ok: false,
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const signupCred: SignupCred = {
        role: 'vendor',
        firstname: 'test',
        lastname: 'last',
        email: 'email@gmail.com',
        password: 'password',
      };

      await expect(authService.signup(signupCred)).rejects.toThrow('Not Created');
    });
  });

  describe('isVerified', () => {
    it('should return true if credentials are verified', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(true),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const credentials: Credentials = { email: 'test', password: 'password' };
      const result = await authService.isVerified(credentials);

      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Verify', expect.any(Object));
    });

    it('should throw an error if credentials are not verified', async () => {
      const mockResponse = {
        ok: false,
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const credentials: Credentials = { email: 'test', password: 'password' };

      await expect(authService.isVerified(credentials)).rejects.toThrow('Not Verified');
    });
  });
});

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

describe('CartResolver', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getCart', () => {
    it('should return cart items on successful getCart query', async () => {
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

      // console.log(response.body)
      expect(response.body.data.Cart).toEqual([{ id: '1', quantity: 2 }]);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Cart', expect.any(Object));
    });

    it('should throw an error on failed getCart query', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
      } as any);

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Get Cart Error' }),
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

      expect(response.body.errors).toBeTruthy();
    });
  });
});

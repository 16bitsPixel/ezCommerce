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
    // it('should return cart items on successful getCart query', async () => {
    //   const mockResponse = {
    //     ok: true,
    //     json: jest.fn().mockResolvedValue({ cart: [{ productId: '1', quantity: 2 }] }),
    //   };
    //   (fetch as jest.Mock).mockResolvedValue(mockResponse);

    //   const response = await supertest(server)
    //     .post('/api/graphql')
    //     .set('Authorization', 'Bearer testToken')
    //     .send({
    //       query: `
    //         query {
    //           Cart {
    //             productId
    //             quantity
    //           }
    //         }
    //       `,
    //     })
    //     .expect(200);

    //   expect(response.body.data.Cart).toEqual([{ productId: '1', quantity: 2 }]);
    //   expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Cart', expect.any(Object));
    // });

    it('should throw an error on failed getCart query', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Get Cart Error' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            query {
              Cart {
                productId
                quantity
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
    });
  });

  describe('addToCart', () => {
    // it('should add an item to the cart on successful addToCart mutation', async () => {
    //   const mockResponse = {
    //     ok: true,
    //     json: jest.fn().mockResolvedValue({ productId: '1', quantity: 2 }),
    //   };
    //   (fetch as jest.Mock).mockResolvedValue(mockResponse);

    //   const response = await supertest(server)
    //     .post('/api/graphql')
    //     .set('Authorization', 'Bearer testToken')
    //     .send({
    //       query: `
    //         mutation {
    //           addToCart(productId: "1", quantity: 2) {
    //             productId
    //             quantity
    //           }
    //         }
    //       `,
    //     })
    //     .expect(200);

    //   expect(response.body.data.addToCart).toEqual({ productId: '1', quantity: 2 });
    //   expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Cart', expect.any(Object));
    // });

    it('should throw an error on failed addToCart mutation', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Add Cart Error' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            mutation {
              addToCart(productId: "1", quantity: 2) {
                productId
                quantity
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
    });
  });

  describe('setCart', () => {
    // it('should set the cart on successful setCart mutation', async () => {
    //   const mockResponse = {
    //     ok: true,
    //     json: jest.fn().mockResolvedValue([{ productId: '1', quantity: 2 }]),
    //   };
    //   (fetch as jest.Mock).mockResolvedValue(mockResponse);

    //   const response = await supertest(server)
    //     .post('/api/graphql')
    //     .set('Authorization', 'Bearer testToken')
    //     .send({
    //       query: `
    //         mutation {
    //           setCart(newCart: [{ productId: "1", quantity: 2 }]) {
    //             productId
    //             quantity
    //           }
    //         }
    //       `,
    //     })
    //     .expect(200);

    //   expect(response.body.data.setCart).toEqual([{ productId: '1', quantity: 2 }]);
    //   expect(fetch).toHaveBeenCalledWith('http://localhost:3011/api/v0/Cart', expect.any(Object));
    // });

    it('should throw an error on failed setCart mutation', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Set Cart Error' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            mutation {
              setCart(newCart: [{ productId: "1", quantity: 2 }]) {
                productId
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

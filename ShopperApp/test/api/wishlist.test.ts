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

describe('WishListResolver', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getWishList', () => {
    it('should return wishlist items on successful getWishList query', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
      } as any);

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { id: '1', Productname: 'Product 1', Productid: 'prod1', description: ['Description 1'], price: 100, rating: 5, image: ['image1.jpg'] },
          { id: '2', Productname: 'Product 2', Productid: 'prod2', description: ['Description 2'], price: 200, rating: 4, image: ['image2.jpg'] }
        ]),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            query {
              getWishList {
                id
                Productname
                Productid
                description
                price
                rating
                image
              }
            }
          `,
        })
        .expect(200);

      // console.log('####################')
      // console.log(response.body)
      expect(response.body.data.getWishList).toEqual([
        { id: '1', Productname: 'Product 1', Productid: 'prod1', description: ['Description 1'], price: 100, rating: 5, image: ['image1.jpg'] },
        { id: '2', Productname: 'Product 2', Productid: 'prod2', description: ['Description 2'], price: 200, rating: 4, image: ['image2.jpg'] }
      ]);
      expect(fetch).toHaveBeenNthCalledWith(1, 'http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
      expect(fetch).toHaveBeenNthCalledWith(2, 'http://localhost:3011/api/v0/Wishlist', expect.any(Object));
    });

    it('should throw an error on failed getWishList query', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
      } as any);

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Get Wishlist Error' }),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            query {
              getWishList {
                id
                Productname
                Productid
                description
                price
                rating
                image
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
    });
  });

  describe('addWishList', () => {
    it('should add an item to the wishlist on successful addWishList mutation', async () => {
      const newItem = {
        Productname: 'Product 1',
        Productid: 'prod1',
        description: ['Description 1'],
        price: 100,
        rating: 5,
        image: ['image1.jpg']
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
      } as any);

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: '1', ...newItem }),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            mutation {
              addWishList(input: {
                Productname: "Product 1"
                Productid: "prod1"
                description: ["Description 1"]
                price: 100
                rating: 5
                image: ["image1.jpg"]
              }) {
                id
                Productname
                Productid
                description
                price
                rating
                image
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.data.addWishList).toEqual({ id: '1', ...newItem });
      expect(fetch).toHaveBeenNthCalledWith(1, 'http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
      expect(fetch).toHaveBeenNthCalledWith(2, 'http://localhost:3011/api/v0/Wishlist', expect.any(Object));
    });

    it('should throw an error on failed addWishList mutation', async () => {
      const newItem = {
        Productname: 'Product 1',
        Productid: 'prod1',
        description: ['Description 1'],
        price: 100,
        rating: 5,
        image: ['image1.jpg']
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
      } as any);

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Adding to Wishlist Error' }),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            mutation {
              addWishList(input: {
                Productname: "Product 1"
                Productid: "prod1"
                description: ["Description 1"]
                price: 100
                rating: 5
                image: ["image1.jpg"]
              }) {
                id
                Productname
                Productid
                description
                price
                rating
                image
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
    });
  });
});

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

describe('ProductResolver', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('product', () => {
    it('should return all products on successful product query', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { id: '1', name: 'Product 1', description: ['Description 1'], price: 100, rating: 5, image: ['image1.jpg'] },
          { id: '2', name: 'Product 2', description: ['Description 2'], price: 200, rating: 4, image: ['image2.jpg'] }
        ]),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              product {
                id
                name
                description
                price
                rating
                image
              }
            }
          `,
        })
        .expect(200);

      // console.log('############')
      // console.log(response.body)
      expect(response.body.data.product).toEqual([
        { id: '1', name: 'Product 1', description: ['Description 1'], price: 100, rating: 5, image: ['image1.jpg'] },
        { id: '2', name: 'Product 2', description: ['Description 2'], price: 200, rating: 4, image: ['image2.jpg'] }
      ]);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3012/api/v0/product/');
    });

    it('should throw an error on failed product query', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Get Products Error' }),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              product {
                id
                name
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

  describe('productInfo', () => {
    it('should return product info on successful productInfo query', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: '1', name: 'Product 1', description: ['Description 1'], price: 100, rating: 5, image: ['image1.jpg'] }),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              productInfo(productId: "1") {
                id
                name
                description
                price
                rating
                image
              }
            }
          `,
        })
        .expect(200);

      console.log('############')
      console.log(response.body)
      expect(response.body.data.productInfo).toEqual({ id: '1', name: 'Product 1', description: ['Description 1'], price: 100, rating: 5, image: ['image1.jpg'] });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3012/api/v0/product/product/?productId=1');
    });

    it('should throw an error on failed productInfo query', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Get Product Info Error' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              productInfo(productId: "1") {
                id
                name
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

  describe('searchProducts', () => {
    it('should return search results on successful searchProducts query', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { id: '1', name: 'Product 1', description: ['Description 1'], price: 100, rating: 5, image: ['image1.jpg'] },
          { id: '2', name: 'Product 2', description: ['Description 2'], price: 200, rating: 4, image: ['image2.jpg'] }
        ]),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              searchProducts(query: "Product") {
                id
                name
                description
                price
                rating
                image
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.data.searchProducts).toEqual([
        { id: '1', name: 'Product 1', description: ['Description 1'], price: 100, rating: 5, image: ['image1.jpg'] },
        { id: '2', name: 'Product 2', description: ['Description 2'], price: 200, rating: 4, image: ['image2.jpg'] }
      ]);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3012/api/v0/product/search?query=Product');
    });

    it('should throw an error on failed searchProducts query', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Search Products Error' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await supertest(server)
        .post('/api/graphql')
        .send({
          query: `
            query {
              searchProducts(query: "Product") {
                id
                name
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
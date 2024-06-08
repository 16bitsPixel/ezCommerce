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

describe('OrderResolver', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getAllOrders', () => {
    it('should return orders on successful getAllOrders query', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
      } as any);

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { order_id: '1', account_id: 'acc1', product_id: ['prod1'], date: '2024-06-08T03:54:15.901Z', status: 'shipped', quantities: [2] }
        ]),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            query {
              order(accountId: "acc1") {
                orderId
                accountId
                productId
                date
                status
                quantities
              }
            }
          `,
        })
        .expect(200);

      // console.log('############')
      // console.log(response.body)
      expect(response.body.data.order).toEqual([
        { orderId: '1', accountId: 'acc1', productId: ['prod1'], date: '2024-06-08T03:54:15.901Z', status: 'shipped', quantities: [2] }
      ]);
      // expect(fetch).toHaveBeenNthCalledWith(1, 'http://localhost:3011/api/v0/authenticate?accessToken=testToken', expect.any(Object));
      // expect(fetch).toHaveBeenNthCalledWith(2, 'http://localhost:3015/api/v0/order?accountId=acc1', expect.any(Object));
    });

    it('should throw an error on failed getAllOrders query', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ id: 'testUser', role: 'member' }),
      } as any);

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Get Orders Error' }),
      } as any);

      const response = await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer testToken')
        .send({
          query: `
            query {
              order(accountId: "acc1") {
                orderId
                accountId
                productId
                date
                status
                quantities
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors).toBeTruthy();
    });
  });

  // describe('orderInfo', () => {
  //   it('should return order info on successful orderInfo query', async () => {
  //     (fetch as jest.Mock).mockResolvedValueOnce({
  //       ok: true,
  //       json: jest.fn().mockResolvedValue({ order_id: '1', account_id: 'acc1', product_id: ['prod1'], date: '2024-06-08T03:54:15.901Z', status: 'shipped', quantities: [2] }),
  //     } as any);

  //     const response = await supertest(server)
  //       .post('/api/graphql')
  //       .send({
  //         query: `
  //           query {
  //             orderInfo(orderId: "1") {
  //               orderId
  //               accountId
  //               productId
  //               date
  //               status
  //               quantities
  //             }
  //           }
  //         `,
  //       })
  //       .expect(200);

  //     expect(response.body.data.orderInfo).toEqual({ orderId: '1', accountId: 'acc1', productId: ['prod1'], date: '2024-06-08T03:54:15.901Z', status: 'shipped', quantities: [2] });
  //     expect(fetch).toHaveBeenCalledWith('http://localhost:3015/api/v0/order/1', expect.any(Object));
  //   });

  //   it('should throw an error on failed orderInfo query', async () => {
  //     const mockResponse = {
  //       ok: false,
  //       json: jest.fn().mockResolvedValue({ message: 'Get Order Info Error' }),
  //     };
  //     (fetch as jest.Mock).mockResolvedValue(mockResponse);

  //     const response = await supertest(server)
  //       .post('/api/graphql')
  //       .send({
  //         query: `
  //           query {
  //             orderInfo(orderId: "1") {
  //               orderId
  //               accountId
  //               productId
  //               date
  //               status
  //               quantities
  //             }
  //           }
  //         `,
  //       })
  //       .expect(200);

  //     expect(response.body.errors).toBeTruthy();
  //   });
  // });

  // describe('orderStatus', () => {
  //   it('should return order status on successful orderStatus query', async () => {
  //     (fetch as jest.Mock).mockResolvedValueOnce({
  //       ok: true,
  //       json: jest.fn().mockResolvedValue({ order_id: '1', status: 'shipped' }),
  //     } as any);

  //     const response = await supertest(server)
  //       .post('/api/graphql')
  //       .send({
  //         query: `
  //           query {
  //             orderStatus(orderId: "1") {
  //               orderId
  //               status
  //             }
  //           }
  //         `,
  //       })
  //       .expect(200);

  //     expect(response.body.data.orderStatus).toEqual({ orderId: '1', status: 'shipped' });
  //     expect(fetch).toHaveBeenCalledWith('http://localhost:3015/api/v0/order/1/status', expect.any(Object));
  //   });

  //   it('should throw an error on failed orderStatus query', async () => {
  //     const mockResponse = {
  //       ok: false,
  //       json: jest.fn().mockResolvedValue({ message: 'Get Order Status Error' }),
  //     };
  //     (fetch as jest.Mock).mockResolvedValue(mockResponse);

  //     const response = await supertest(server)
  //       .post('/api/graphql')
  //       .send({
  //         query: `
  //           query {
  //             orderStatus(orderId: "1") {
  //               orderId
  //               status
  //             }
  //           }
  //         `,
  //       })
  //       .expect(200);

  //     expect(response.body.errors).toBeTruthy();
  //   });
  // });

  // describe('updateOrderStatus', () => {
  //   it('should update order status on successful updateOrderStatus mutation', async () => {
  //     (fetch as jest.Mock).mockResolvedValueOnce({
  //       ok: true,
  //       json: jest.fn().mockResolvedValue({ order_id: '1', status: 'delivered' }),
  //     } as any);

  //     const response = await supertest(server)
  //       .post('/api/graphql')
  //       .send({
  //         query: `
  //           mutation {
  //             updateOrderStatus(orderId: "1") {
  //               orderId
  //               status
  //             }
  //           }
  //         `,
  //       })
  //       .expect(200);

  //     expect(response.body.data.updateOrderStatus).toEqual({ orderId: '1', status: 'delivered' });
  //     expect(fetch).toHaveBeenCalledWith('http://localhost:3015/api/v0/order/1/status', expect.any(Object));
  //   });

  //   it('should throw an error on failed updateOrderStatus mutation', async () => {
  //     const mockResponse = {
  //       ok: false,
  //       json: jest.fn().mockResolvedValue({ message: 'Update Order Status Error' }),
  //     };
  //     (fetch as jest.Mock).mockResolvedValue(mockResponse);

  //     const response = await supertest(server)
  //       .post('/api/graphql')
  //       .send({
  //         query: `
  //           mutation {
  //             updateOrderStatus(orderId: "1") {
  //               orderId
  //               status
  //             }
  //           }
  //         `,
  //       })
  //       .expect(200);

  //     expect(response.body.errors).toBeTruthy();
  //   });
  // });

});

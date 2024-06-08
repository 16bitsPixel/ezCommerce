import 'reflect-metadata';
import { OrderResolver } from '@/graphql/order/resolver';
import { OrderService } from '@/graphql/order/service';
import { Order, InputOrder, output } from '@/graphql/order/schema';
import { mock } from 'jest-mock-extended';

const mockOrderService = mock<OrderService>();

const orderResolver = new OrderResolver();

global.fetch = jest.fn();

describe('OrderResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('order should return a list of orders', async () => {
    const accountId = '12345';
    const expectedOrders: Order[] = [
      {
        orderId: 'order1',
        accountId: '12345',
        productId: ['product1', 'product2'],
        date: new Date(),
        status: 'delivered',
        quantities: [1, 2],
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => expectedOrders,
    });

    (orderResolver as any).orderService = mockOrderService;

    await orderResolver.order(accountId);

    expect(fetch).toHaveBeenCalledWith(`http://localhost:3015/api/v0/order?accountId=${accountId}`);
  });

  it('orderInfo should return order details', async () => {
    const orderId = 'order1';
    const expectedOrder: Order = {
      orderId: 'order1',
      accountId: '12345',
      productId: ['product1', 'product2'],
      date: new Date(),
      status: 'delivered',
      quantities: [1, 2],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => expectedOrder,
    });

    (orderResolver as any).orderService = mockOrderService;

    const result = await orderResolver.orderInfo(orderId);

    expect(result).toEqual(expectedOrder);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:3015/api/v0/order/${orderId}`);
  });

  it('createOrder should create an order', async () => {
    const inputOrder: InputOrder = {
      account_id: '12345',
      product_id: ['product1', 'product2'],
      quantities: [1, 2],
    };

    const expectedOutput: output = {
      account_id: '12345',
      product_id: ['product1', 'product2'],
      quantities: [1, 2],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => expectedOutput,
    });

    (orderResolver as any).orderService = mockOrderService;

    const result = await orderResolver.createOrder(inputOrder);

    expect(result).toEqual(expectedOutput);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3015/api/v0/order', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'accept': 'application/json',
      }),
      body: JSON.stringify({
        items: inputOrder.product_id.map((productId, index) => ({
          account_id: inputOrder.account_id,
          product_id: productId,
          quantities: inputOrder.quantities[index],
        })),
      }),
    }));
  });

  it('updateOrderStatus should update the status of an order', async () => {
    const orderId = 'order1';
    const expectedOrder: Order = {
      orderId: 'order1',
      accountId: '12345',
      productId: ['product1', 'product2'],
      date: new Date(),
      status: 'shipped',
      quantities: [1, 2],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => expectedOrder,
    });

    (orderResolver as any).orderService = mockOrderService;

    const result = await orderResolver.updateOrderStatus(orderId);

    expect(result).toEqual(expectedOrder);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:3015/api/v0/order/${orderId}/status`, expect.objectContaining({
      method: 'PUT',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
      }),
    }));
  });

  it('orderStatus should return the status of an order', async () => {
    const orderId = 'order1';
    const expectedOrder: Order = {
      orderId: 'order1',
      accountId: '12345',
      productId: ['product1', 'product2'],
      date: new Date(),
      status: 'shipped',
      quantities: [1, 2],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => expectedOrder,
    });

    (orderResolver as any).orderService = mockOrderService;

    const result = await orderResolver.orderStatus(orderId);

    expect(result).toEqual(expectedOrder);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:3015/api/v0/order/${orderId}/status`);
  });
});

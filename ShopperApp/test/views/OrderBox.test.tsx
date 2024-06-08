// /mnt/data/readme.md
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { LoginContext } from '@/context/Login';
import { OrderBox } from '@/views/components/Order/OrderBox';

let returnError = false;

const handlers = [
  graphql.query('getOrders', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        order: [
          {
            orderId: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
            accountId: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b',
            productId: ['8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', '4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'],
            date: '2022-03-15T14:30:00Z',
            status: 'pending',
            quantities: [1, 2],
          },
          {
            orderId: '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d',
            accountId: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b',
            productId: ['8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', '4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'],
            date: '2022-04-20T18:45:00Z',
            status: 'pending',
            quantities: [3, 4],
          },
        ]
      },
    })
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const mockLoginContextValue = {
  userName: 'John Doe',
  setUserName: jest.fn(),
  accessToken: 'mockAccessToken',
  setAccessToken: jest.fn(),
  id: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b',
  setId: jest.fn(),
  view: 'Login',
  setView: jest.fn(),
};

it('Renders and displays the correct text', async () => {
  render(
    <LoginContext.Provider value={mockLoginContextValue}>
      <OrderBox />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('your-orders')).toBeInTheDocument();
  });

  expect(screen.getByText('your-orders').textContent).toMatch(/your-orders/i);
  expect(screen.getByText('4/20/22')).toBeInTheDocument(); // This should now pass
});

it('Errors When No Server', async () => {
  server.close()
  render(
    <OrderBox />
  );
  expect(screen.queryAllByText('4/15/22').length).toBe(0);
});

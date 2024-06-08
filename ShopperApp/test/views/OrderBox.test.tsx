// /mnt/data/readme.md
import React from 'react';
import { render, screen, waitFor, fireEvent, queryAllByTestId } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { LoginContext } from '@/context/Login';
import { OrderBox } from '@/views/components/Order/OrderBox';

import { useRouter } from 'next/router';

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
beforeEach(() => {
  returnError = false;
  (useRouter as jest.Mock).mockReturnValue({
    locale: 'en', // Mocking locale property
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mocking react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn((str: string) => {
      switch (str) {
        case 'total':
          return 'TOTAL';
        case 'your-orders':
          return 'Your Orders';
        case 'ship-to':
          return 'SHIP TO';
        case 'order-placed':
          return 'ORDER PLACED';
        default:
          return str;
      }
    }),
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

const mockLoginContext = {
  userName: 'Test User',
  accessToken: 'test-token',
  setAccessToken: jest.fn(),
  setUserName: jest.fn(),
  view: 'Login',
  setView: jest.fn(),
  id: '123',
  setId: jest.fn()
};

it('Renders and displays the correct text', async () => {
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <OrderBox />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('Your Orders')).toBeInTheDocument();
    expect(screen.queryAllByText('Your Orders').length).toBe(1);
    expect(screen.queryAllByText('SHIP TO').length).toBe(2);
    expect(screen.queryAllByText('TOTAL').length).toBe(2);
    expect(screen.queryAllByText('ORDER PLACED').length).toBe(2);
    expect(screen.queryAllByText('Test User').length).toBe(2);
  });
});

it('Errors When No Server', async () => {
  server.close()
  render(
    <OrderBox />
  );
  await waitFor(() => {
    expect(screen.queryAllByText('04/15/22').length).toBe(0);
  });
});

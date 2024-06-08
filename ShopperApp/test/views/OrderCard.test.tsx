import React from 'react';
import { render, screen, waitFor, fireEvent, queryAllByTestId } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { LoginContext } from '@/context/Login';
import { OrderCard } from '@/views/components/Order/OrderCard';

import { useRouter } from 'next/router';

let returnError = false;

const handlers = [
  graphql.query('ProductInfo', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        productInfo: [
          {
            "id": "1",
            "name": "test1",
            "price": 10,
            "image": ["some image"]
          },
          {
            "id": "2",
            "name": "test2",
            "price": 1,
            "image": ["some image 2"]
          }
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
        case 'status':
          return 'Status';
        case 'quantity':
          return 'Quantity';
        case 'price':
          return 'Price';
        case 'buy-it-again':
          return 'But It Again';
        case 'view-your-item':
          return 'View Your Item';
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

const sampleIds = ['1', '2'];
const sampleStatus = 'In Progress';
const sampleQuantity = [2, 3];
const sampleOnTotalChange = jest.fn();

it('Renders and displays the correct text', async () => {
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <OrderCard
        ids={sampleIds}
        status={sampleStatus}
        quantity={sampleQuantity}
        onTotalChange={sampleOnTotalChange}
      />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    const statusElement = screen.getByLabelText('status');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveTextContent(sampleStatus);
  });
});


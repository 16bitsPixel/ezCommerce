/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { ProductView } from '@/views/Product';
import { useRouter } from 'next/router';

let returnError = false;

const handlers = [
  graphql.query('GetProduct', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        productInfo:
          {
            "id": "1",
            "name": "test1",
            "description": ["desc1", "desc2"],
            "price": 10,
            "rating": 5,
            "image": ["img1", "img2"]
          }
      },
    })
  }),
];

const server = setupServer(...handlers)

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
        case 'change-locale':
          return 'Change Locale';
        case 'home':
          return 'Home';
        case 'orders':
          return 'Orders';
        case 'cart':
          return 'Cart';
        case 'sign-in':
          return 'Sign In';
        default:
          return str;
      }
    }),
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

const testProduct = {
  id: '1'
};

it('Renders', async () => {
  render(
    <ProductView id = {testProduct.id} />
  );

  await waitFor(() => {
    expect(screen.queryAllByText('test1').length).toBe(1);
  });
});

it('Errors When No Server', async () => {
  server.close()

  render(
    <ProductView id = {testProduct.id} />
  );

  expect(screen.queryAllByText('test1').length).toBe(0);
});
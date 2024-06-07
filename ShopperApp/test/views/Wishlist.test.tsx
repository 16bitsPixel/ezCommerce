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

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';
import { useRouter } from 'next/router';
import { LoginContext } from '@/context/Login';

import { WishList } from '@/views/components/Cart/WishList';

let returnError = false;

const handlers = [
  graphql.query('getWishList', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        getWishList: [
          {ProductId: '1'}
        ]
      },
    })
  }),
  graphql.query('GetProduct', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        productInfo: {
          id: '1', name: 'test', description: 'test desc', price: 1, rating: 1, image: 'img'
        }
      },
    })
  }),
];

const server = setupServer(...handlers)

beforeAll(() => server.listen())
beforeEach(() => {
  returnError = false;
  const push = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push,
    locale: 'en', // Mocking locale property,
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  });
});
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

it('Renders', async () => {
  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <WishList />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('cardImage-0')).toBeInTheDocument();
  });
});

it('Click Wishlist Product Image', async () => {
  const push = useRouter().push;

  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <WishList />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('cardImage-0')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('cardImage-0'));

  expect(push).toHaveBeenCalledWith('/product?id=1');
});

it('Errors When No Server', async () => {
  server.close()

  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <WishList />
    </LoginContext.Provider>
  );
});

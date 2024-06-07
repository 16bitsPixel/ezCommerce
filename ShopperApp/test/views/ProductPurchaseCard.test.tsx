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

import { ProductPurchaseCard } from '@/views/components/Product/ProductPurchaseCard';
import { LoginContext } from '@/context/Login';

let returnError = false;

const handlers = [
  graphql.mutation('addToCart', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        addToCart: {
          id: '1',
          quantity: '1'
        }
      },
    })
  }),
  graphql.mutation('addWishList', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        addWishList: {
          id: '1'
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

const testProduct = {
  id: '1',
  name: 'test',
  description: ['something'],
  price: 99.99,
  rating: 5,
  image: ['img']
};

it('Renders', async () => {
  render(
    <ProductPurchaseCard product = {testProduct} />
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('addToCartBtn')).toBeInTheDocument();
  });
});

it('Change Quantity', async () => {
  render(
    <ProductPurchaseCard product = {testProduct} />
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('quantitySelect')).toBeInTheDocument();
  });

  const quantitySelect = screen.getByLabelText('quantitySelect');
  fireEvent.mouseDown(quantitySelect);

  // change the quantity value and check if changed
});

it('Add to Cart Not Logged In', async () => {
  const push = useRouter().push;
  render(
    <ProductPurchaseCard product = {testProduct} />
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('addToCartBtn')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('addToCartBtn'));
  expect(push).toHaveBeenCalledWith('/cart');
});

it('Add to Cart Not Logged In But Item Already In', async () => {
  localStorage.setItem('cart', JSON.stringify([{id: '1', quantity: 1}]));
  const push = useRouter().push;
  render(
    <ProductPurchaseCard product = {testProduct} />
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('addToCartBtn')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('addToCartBtn'));
  expect(push).toHaveBeenCalledWith('/cart');

  const cart = localStorage.getItem('cart');
  expect(cart).toEqual(JSON.stringify([{id: '1', quantity: 2}]));
});

it('Add to Cart Logged In', async () => {
  const push = useRouter().push;
  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <ProductPurchaseCard product = {testProduct} />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('addToCartBtn')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('addToCartBtn'));

  await waitFor(() => {
    expect(push).toHaveBeenCalledWith('/cart');
  });
});

it('Add to Wishlist Not Logged In', async () => {
  const push = useRouter().push;
  render(
    <ProductPurchaseCard product = {testProduct} />
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('addToWishlistBtn')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('addToWishlistBtn'));
  expect(push).toHaveBeenCalledWith('/login');
});

it('Add to Cart Logged In', async () => {
  const push = useRouter().push;
  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <ProductPurchaseCard product = {testProduct} />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('addToWishlistBtn')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('addToWishlistBtn'));

  await waitFor(() => {
    expect(push).toHaveBeenCalledWith('/cart');
  });
});

it('Change quantity', async () => {
  render(
    <ProductPurchaseCard product = {testProduct} />
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('quantitySelect')).toBeInTheDocument();
  });

  // Get the select element and open the dropdown
  const selectElement = screen.getByLabelText('quantitySelect');
  fireEvent.mouseDown(selectElement);

  // Wait for the dropdown menu to be in the document
  const listbox = await screen.findByRole('combobox');

  fireEvent.mouseDown(listbox);

  // Click on the desired MenuItem
  const option = screen.getByText('5');
  fireEvent.click(option);

  // Optionally, you can add an assertion to verify the value change
  expect(selectElement).toHaveTextContent('5');
});

it('Errors When No Server, Cart', async () => {
  server.close()

  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <ProductPurchaseCard product = {testProduct} />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('addToCartBtn')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('addToCartBtn'));
});

it('Errors When No Server, Wishlist', async () => {
  server.close()

  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <ProductPurchaseCard product = {testProduct} />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('addToWishlistBtn')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('addToWishlistBtn'));
});
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
import { ProductContext } from '@/context/Product';

import { CartList } from '@/views/components/Cart/CartList';

let returnError = false;

const handlers = [
  graphql.query('GetCart', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        Cart: [
          {id: '1', quantity: 1},
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
  graphql.mutation('DeleteCartItem', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        setCart: []
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

it('Renders Not Logged In', async () => {
  localStorage.setItem('cart', JSON.stringify({id: '1', quantity: 1}));
  render(
    <ProductContext.Provider value={{products: [({id: '1', name: 'test', description: 'test desc', price: 1, rating: 1, image: 'img'}) as never], setProducts: () => {}, cart: [({id: '1', quantity: 1}) as never], setCart: () => {}}}>
      <CartList />
    </ProductContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('cardImage-0')).toBeInTheDocument();
  });
});

it('Renders Logged In', async () => {
  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <ProductContext.Provider value={{products: [({id: '1', name: 'test', description: 'test desc', price: 1, rating: 1, image: 'img'}) as never], setProducts: () => {}, cart: [({id: '1', quantity: 1}) as never], setCart: () => {}}}>
        <CartList />
      </ProductContext.Provider>
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('cardImage-0')).toBeInTheDocument();
  });
});

it('Delete Item Not Logged In', async () => {
  localStorage.setItem('cart', JSON.stringify({id: '1', quantity: 1}));
  render(
    <ProductContext.Provider value={{products: [({id: '1', name: 'test', description: 'test desc', price: 1, rating: 1, image: 'img'}) as never], setProducts: () => {}, cart: [({id: '1', quantity: 1}) as never], setCart: () => {}}}>
      <CartList />
    </ProductContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('cardImage-0')).toBeInTheDocument();
    expect(screen.queryByLabelText('deleteBtn-0')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('deleteBtn-0'));
  const newCart = localStorage.getItem('cart');
  expect(newCart).toBe(JSON.stringify([]));
});

it('Delete Item Logged In', async () => {
  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <ProductContext.Provider value={{products: [({id: '1', name: 'test', description: 'test desc', price: 1, rating: 1, image: 'img'}) as never], setProducts: () => {}, cart: [({id: '1', quantity: 1}) as never], setCart: () => {}}}>
        <CartList />
      </ProductContext.Provider>
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('cardImage-0')).toBeInTheDocument();
    expect(screen.queryByLabelText('deleteBtn-0')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('deleteBtn-0'));
});

it('Click Product Image', async () => {
  localStorage.setItem('cart', JSON.stringify({id: '1', quantity: 1}));
  const push = useRouter().push;

  render(
    <ProductContext.Provider value={{products: [({id: '1', name: 'test', description: 'test desc', price: 1, rating: 1, image: 'img'}) as never], setProducts: () => {}, cart: [({id: '1', quantity: 1}) as never], setCart: () => {}}}>
      <CartList />
    </ProductContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('cardImage-0')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByLabelText('cardImage-0'));

  expect(push).toHaveBeenCalledWith('/product?id=1');
});

it('Change quantity', async () => {
  render(
    <ProductContext.Provider value={{products: [({id: '1', name: 'test', description: 'test desc', price: 1, rating: 1, image: 'img'}) as never], setProducts: () => {}, cart: [({id: '1', quantity: 1}) as never], setCart: () => {}}}>
      <CartList />
    </ProductContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('quantitySelect-0')).toBeInTheDocument();
  });

  // Get the select element and open the dropdown
  const selectElement = screen.getByLabelText('quantitySelect-0');
  fireEvent.mouseDown(selectElement);

  // Wait for the dropdown menu to be in the document
  const listbox = await screen.findByRole('combobox');

  fireEvent.mouseDown(listbox);

  // Click on the desired MenuItem
  const option = screen.getByText('5');
  fireEvent.click(option);
});

it('Change quantity after delete', async () => {
  render(
    <ProductContext.Provider value={{products: [({id: '1', name: 'test', description: 'test desc', price: 1, rating: 1, image: 'img'}) as never], setProducts: () => {}, cart: [], setCart: () => {}}}>
      <CartList />
    </ProductContext.Provider>
  );

  await waitFor(() => {
    expect(screen.queryByLabelText('quantitySelect-0')).toBeInTheDocument();
  });

  // Get the select element and open the dropdown
  const selectElement = screen.getByLabelText('quantitySelect-0');
  fireEvent.mouseDown(selectElement);

  // Wait for the dropdown menu to be in the document
  const listbox = await screen.findByRole('combobox');

  fireEvent.mouseDown(listbox);

  // Click on the desired MenuItem
  const option = screen.getByText('5');
  fireEvent.click(option);
});

it('Errors When No Server', async () => {
  server.close()

  render(
    <LoginContext.Provider value={{ userName: 'test', setUserName: () => {}, accessToken: 'token', setAccessToken: () => {}, view: 'view', setView: () => {}, id: '1', setId: () => {}}}>
      <CartList />
    </LoginContext.Provider>
  );
});

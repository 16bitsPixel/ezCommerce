import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ProductContext } from '@/context/Product';
import { CheckoutButton } from '@/views/components/Cart/CheckoutButton';
import { setupServer } from 'msw/node';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: any) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

it('Checkout Redirects', async () => {
    const setProducts = jest.fn();
    const setCart = jest.fn();

    global.fetch = jest.fn(() =>
        Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'https://stripe/checkout' }),
        })
    ) as jest.Mock;

    render(
    <ProductContext.Provider value={{ products: [], setProducts, cart: [], setCart }}>
        <CheckoutButton />
        </ProductContext.Provider>
    );

    const button = screen.getByLabelText('checkout-button');
    fireEvent.click(button);

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/checkout_sessions', expect.any(Object));
    });
});

it('Handles non-OK response', async () => {
    const setProducts = jest.fn();
    const setCart = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Internal Server Error'),
      })
    ) as jest.Mock;


    console.error = jest.fn(); 

    render(
      <ProductContext.Provider value={{ products: [], setProducts, cart: [], setCart }}>
        <CheckoutButton />
      </ProductContext.Provider>
    );

    const button = screen.getByLabelText('checkout-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/checkout_sessions', expect.any(Object));
      expect(console.error).toHaveBeenCalledWith('Error response from server:', 'Internal Server Error');
    });
  });
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ProductContext } from '@/context/Product';
import { CheckoutButton } from '@/views/components/Cart/CheckoutButton';
import { setupServer } from 'msw/node';
import Success from '@/pages/success';
import supertest from 'supertest';
import stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/checkout_sessions';

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

jest.mock('next-i18next/serverSideTranslations');

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

it('Renders success page', async () => {
    const mockedUseRouter = useRouter as jest.Mock;
    mockedUseRouter.mockImplementation(() => ({
      locale: 'en',
      push: jest.fn(),
      pathname: '/success',
    }));

    render(
        <Success/>
    )

    expect(screen.getByText('thank-you')).toBeInTheDocument();
})

jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
      checkout: {
        sessions: {
          create: jest.fn(),
        },
      },
    }));
  });

  describe('/api/checkout_sessions handler', () => {
    let mockStripe: any;
  
    beforeEach(() => {
    mockStripe = new stripe('key');
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('returns the session URL on successful creation', async () => {
      mockStripe.checkout.sessions.create.mockResolvedValue({
        url: 'https://checkout.stripe.com/pay/success',
      });
  
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: [
          {
            name: 'Test Product',
            image: 'https://example.com/image.jpg',
            price: 100.0,
          },
        ],
        headers: {
          origin: 'https://example.com',
        },
      });
  
      await handler(req, res);

    });
  
    it('returns an error when Stripe session creation fails', async () => {
      mockStripe.checkout.sessions.create.mockRejectedValue({
        statusCode: 500,
        message: 'Internal Server Error',
      });
  
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: [
          {
            name: 'Test Product',
            image: 'https://example.com/image.jpg',
            price: 100.0,
          },
        ],
        headers: {
          origin: 'https://example.com',
        },
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(500);
    });
  
    it('returns 405 if method is not POST', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(405);
      expect(res._getHeaders()['allow']).toBe('POST');
      expect(res._getData()).toBe('Method Not Allowed');
    });
  });
import { render, waitFor } from '@testing-library/react';
import { GetServerSidePropsContext } from 'next';
import Success, { getServerSideProps } from '../../src/pages/success';
import React from 'react';
import { LoginContext } from '@/context/Login';
import { ProductContext } from '@/context/Product';

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock serverSideTranslations
jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn(),
}));

describe('Success', () => {
  const mockSetId = jest.fn();
  const mockSetAccessToken = jest.fn();
  const mockSetUserName = jest.fn();
  const mockSetCart = jest.fn();
  const mockSetProducts = jest.fn();

  const loginContextValue: any = {
    id: '',
    accessToken: '',
    userName: '',
    setId: mockSetId,
    setAccessToken: mockSetAccessToken,
    setUserName: mockSetUserName,
  };

  const productContextValue: any = {
    cart: [],
    setCart: mockSetCart,
    products: [],
    setProducts: mockSetProducts,
  };

  beforeEach(() => {
    jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => ({
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      isFallback: false,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }));

    // Clear mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('Renders', async () => {
    render(
      <LoginContext.Provider value={loginContextValue}>
        <ProductContext.Provider value={productContextValue}>
          <Success />
        </ProductContext.Provider>
      </LoginContext.Provider>
    );
  });

  it('Handles successful response from GraphQL API', async () => {
    localStorage.setItem('loginInfo', 'fakeAccessToken');

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        data: {
          restore: {
            id: 'user123',
            name: 'Test User',
            accessToken: 'newAccessToken',
          },
        },
      }),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse as any);

    render(
      <LoginContext.Provider value={loginContextValue}>
        <ProductContext.Provider value={productContextValue}>
          <Success />
        </ProductContext.Provider>
      </LoginContext.Provider>
    );

    await waitFor(() => {
      expect(mockSetId).toHaveBeenCalledWith('user123');
      expect(mockSetAccessToken).toHaveBeenCalledWith('newAccessToken');
      expect(mockSetUserName).toHaveBeenCalledWith('Test User');
      expect(mockSetCart).toHaveBeenCalledWith([]);
      expect(mockSetProducts).toHaveBeenCalledWith([]);
      expect(localStorage.getItem('loginInfo')).toBeNull();
      expect(localStorage.getItem('cart')).toBeNull();
    });
  });

  it('Handles error response from GraphQL API', async () => {
    localStorage.setItem('loginInfo', 'fakeAccessToken');

    const mockResponse = {
      json: jest.fn().mockResolvedValue({
        errors: [{ message: 'Some error' }],
      }),
    };

    global.fetch = jest.fn().mockResolvedValue(mockResponse as any);

    // Mock alert
    global.alert = jest.fn();

    render(
      <LoginContext.Provider value={loginContextValue}>
        <ProductContext.Provider value={productContextValue}>
          <Success />
        </ProductContext.Provider>
      </LoginContext.Provider>
    );

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Some error');
      expect(mockSetId).not.toHaveBeenCalled();
      expect(mockSetAccessToken).not.toHaveBeenCalled();
      expect(mockSetUserName).not.toHaveBeenCalled();
      expect(mockSetCart).not.toHaveBeenCalled();
      expect(mockSetProducts).not.toHaveBeenCalled();
    });
  });

  it('Handles fetch error', async () => {
    localStorage.setItem('loginInfo', 'fakeAccessToken');

    const mockError = new Error('Network error');

    global.fetch = jest.fn().mockRejectedValue(mockError);

    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock alert
    global.alert = jest.fn();

    render(
      <LoginContext.Provider value={loginContextValue}>
        <ProductContext.Provider value={productContextValue}>
          <Success />
        </ProductContext.Provider>
      </LoginContext.Provider>
    );

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(mockError);
      expect(mockSetId).not.toHaveBeenCalled();
      expect(mockSetAccessToken).not.toHaveBeenCalled();
      expect(mockSetUserName).not.toHaveBeenCalled();
      expect(mockSetCart).not.toHaveBeenCalled();
      expect(mockSetProducts).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('returns expected props', async () => {
    const { serverSideTranslations } = require('next-i18next/serverSideTranslations');
    serverSideTranslations.mockResolvedValue({ common: {} });
    const context = {
      locale: 'en',
    } as unknown as GetServerSidePropsContext;
    const result = await getServerSideProps(context);
    expect(result).toEqual({
      props: {
        common: {},
      },
    });
    expect(serverSideTranslations).toHaveBeenCalledWith('en', ['common']);
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { VendorKeys } from '@/views/components/VendorKeys';
import { LoginContext, LoginProvider } from '@/context/Login';
import '@testing-library/jest-dom'; // For custom matchers

jest.mock('next/router', () => require('next-router-mock'));

const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockSetAccessToken = jest.fn();
const mockSetUserName = jest.fn();
const mockSetUserId = jest.fn();
const mocksetView = jest.fn();

const mockLoginContext = {
  userName: 'abcd',
  accessToken: '1234',
  userId: '5678',
  setAccessToken: mockSetAccessToken,
  setUserName: mockSetUserName,
  setUserId: mockSetUserId,
  view: 'Login',
  setView: mocksetView,
};

it('renders', () => {
  render(
    <LoginProvider>
      <VendorKeys />
    </LoginProvider>
  );
  expect(screen.getByRole('button', { name: 'Generate New Key' }))
});

it('renders keytable', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { vendorkeys: [{ id: '1', key: '123' }, { id: '2', key: '456' }, { id: '3', key: '789' }] } }),
    })
  ) as jest.Mock;

  render(
    <LoginContext.Provider value={mockLoginContext}>
      <VendorKeys />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getByText('789')).toBeInTheDocument();
  });
});

it('catches error', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ errors: { vendorkeys: [{ id: '1', key: '123' }, { id: '2', key: '456' }, { id: '3', key: '789' }] } }),
    })
  ) as jest.Mock;
  window.alert = jest.fn()
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <VendorKeys />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled()
  });
});

it('creates a new key on button click', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { createKey: { id: 'new-key-id', key: 'new-key-value' } } }),
    })
  ) as jest.Mock;
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <VendorKeys />
    </LoginContext.Provider>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Generate New Key' }));

  await waitFor(() => {
    expect(screen.getByText('new-key-value')).toBeInTheDocument();
  });
});

it('catches key gen error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ errors: { createKey: { id: 'new-key-id', key: 'new-key-value' } } }),
      })
    ) as jest.Mock;
    render(
      <LoginContext.Provider value={mockLoginContext}>
        <VendorKeys />
      </LoginContext.Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Generate New Key' }));
  
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled()
    });
  });

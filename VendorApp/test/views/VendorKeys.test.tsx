import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { graphql, HttpResponse } from 'msw';
import { VendorKeys } from '@/views/components/VendorKeys';
import { LoginContext, LoginProvider } from '@/context/Login';
import '@testing-library/jest-dom'; // For custom matchers

jest.mock('next/router', () => require('next-router-mock'));
beforeAll(() => {
  global.alert = jest.fn();
});
let returnError = false;

const handlers = [
  graphql.query('keys', ({ query, variables }) => {
    console.log("Received query:", query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Error fetching keys' }],
      });
    }
    return HttpResponse.json({
      data: {
        allkeys: [
          { id: '1', key: '123' },
          { id: '2', key: '456' },
          { id: '3', key: '789' },
        ],
      },
    });
  }),
  graphql.mutation('newkey', ({ query, variables }) => {
    console.log("Received mutation:", query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Error creating new key' }],
      });
    }
    return HttpResponse.json({
      data: {
        createKey: { id: 'new-key-id', key: 'new-key-value' },
      },
    });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
beforeEach(() => {
  returnError = false;
  (global.alert as jest.Mock).mockClear();  // Clear mock before each test
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockSetAccessToken = jest.fn();
const mockSetUserName = jest.fn();
const mockSetUserId = jest.fn();
const mockSetView = jest.fn();

const mockLoginContext = {
  userName: 'abcd',
  accessToken: '1234',
  userId: '5678',
  setAccessToken: mockSetAccessToken,
  setUserName: mockSetUserName,
  setUserId: mockSetUserId,
  view: 'Login',
  setView: mockSetView,
};

it('renders', () => {
  render(
    <LoginProvider>
      <VendorKeys />
    </LoginProvider>
  );
  expect(screen.getByRole('button', { name: 'Generate New Key' })).toBeInTheDocument();
});

it('renders keytable', async () => {
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
  returnError = true;

  render(
    <LoginContext.Provider value={mockLoginContext}>
      <VendorKeys />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Error fetching keys');
  });
});

it('creates a new key on button click', async () => {
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <VendorKeys />
    </LoginContext.Provider>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Generate New Key' }));

  await waitFor(() => {
    expect(screen.getByText('new-key-value...')).toBeInTheDocument();
  });
});

it('catches key gen error', async () => {
  returnError = true;

  render(
    <LoginContext.Provider value={mockLoginContext}>
      <VendorKeys />
    </LoginContext.Provider>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Generate New Key' }));
  
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Error creating new key');
  });
});

it('copies key to clipboard', async () => {
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <VendorKeys />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  });

  const copyButtons = screen.getAllByRole('button', { name: /copy/i });
  fireEvent.click(copyButtons[0]);

  await waitFor(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('123');
  });
});

it('handles clipboard copy error', async () => {
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <VendorKeys />
    </LoginContext.Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockImplementation(() => Promise.reject('Clipboard error')),
    },
  });

  console.error = jest.fn(); // Suppress error log in test output

  const copyButtons = screen.getAllByRole('button', { name: /copy/i });
  fireEvent.click(copyButtons[0]);

  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith('Failed to copy: ', 'Clipboard error');
  });
});


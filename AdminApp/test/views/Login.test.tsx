import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import  Login from '../../src/views/Login';
import { LoginContext, LoginProvider } from '@/context/Login';
import '@testing-library/jest-dom'; // For custom matchers

jest.mock('next/router', () => require('next-router-mock'));

const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockSetAccessToken = jest.fn();
const mockSetUserName = jest.fn();

const mockLoginContext = {
  userName: '',
  accessToken: '',
  setAccessToken: mockSetAccessToken,
  setUserName: mockSetUserName,
};

it('renders login form', () => {
  render(
    <LoginProvider>
      <Login />
    </LoginProvider>
  );
  expect(screen.getByLabelText('Email Address *'))
  expect(screen.getByLabelText('Password *'))
  expect(screen.getByRole('button', { name: 'Sign In' }))
});

it('handles form submission with valid credentials', async () => {
  // Mock fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { login: { name: 'Test User', accessToken: 'test-token', role: 'admin' }, isVerified: true } }),
    })
  ) as jest.Mock;
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <Login />
    </LoginContext.Provider>
  );
  const email = screen.getByLabelText('Email Address *')
  fireEvent.change(email, { target: { value: 'molly@books.com' } });
  const passwd = screen.getByLabelText('Password *')
  fireEvent.change(passwd, { target: { value: 'mollymember' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  await waitFor(() => {
    expect(mockSetAccessToken).toHaveBeenCalledWith('test-token');
    expect(mockSetUserName).toHaveBeenCalledWith('Test User');
  });
});

it('Rejects Bad Credentials', async () => {
  // Mock fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ errors: { login: { name: 'Test User', accessToken: 'test-token' } } }),
    })
  ) as jest.Mock;
  window.alert = jest.fn()
  render(
    <LoginProvider>
      <Login />
    </LoginProvider>
  );
  const email = screen.getByLabelText('Email Address *')
  fireEvent.change(email,  { target: { value: 'molly@books.com' } });
  const passwd = screen.getByLabelText('Password *')
  fireEvent.change(passwd,  { target: { value: 'wrongpassword' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Sign In' }))
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled()
  });
});

it('rejects non vendors', async () => {
  // Mock fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { login: { name: 'Test User', accessToken: 'test-token', role: 'vendor' } } }),
    })
  ) as jest.Mock;
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <Login />
    </LoginContext.Provider>
  );
  const email = screen.getByLabelText('Email Address *')
  fireEvent.change(email, { target: { value: 'molly@books.com' } });
  const passwd = screen.getByLabelText('Password *')
  fireEvent.change(passwd, { target: { value: 'mollymember' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled()
  });
});

it('rejects unverified vendors', async () => {
  // Mock fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { login: { name: 'Test User', accessToken: 'test-token', role: 'admin' } } }),
    })
  ) as jest.Mock;
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <Login />
    </LoginContext.Provider>
  );
  const email = screen.getByLabelText('Email Address *')
  fireEvent.change(email, { target: { value: 'molly@books.com' } });
  const passwd = screen.getByLabelText('Password *')
  fireEvent.change(passwd, { target: { value: 'mollymember' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled()
  });
});

it('catches verification errors', async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      json: () => Promise.resolve({
        data: { login: { name: 'Test User', accessToken: 'test-token', role: 'admin' } }
      })
    })
    .mockResolvedValueOnce({
      json: () => Promise.resolve({
        errors: [{ message: 'An error occurred' }]
      })
    });
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <Login />
    </LoginContext.Provider>
  );
  const email = screen.getByLabelText('Email Address *')
  fireEvent.change(email, { target: { value: 'molly@books.com' } });
  const passwd = screen.getByLabelText('Password *')
  fireEvent.change(passwd, { target: { value: 'mollymember' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled()
  });
});

it('catches fetch errors', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <Login />
    </LoginContext.Provider>
  );
  const email = screen.getByLabelText('Email Address *')
  fireEvent.change(email, { target: { value: 'molly@books.com' } });
  const passwd = screen.getByLabelText('Password *')
  fireEvent.change(passwd, { target: { value: 'mollymember' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled()
  });
});

it('catches secondary fetch errors', async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      json: () => Promise.resolve({
        data: { login: { name: 'Test User', accessToken: 'test-token', role: 'admin' } }
      })
    })
    .mockRejectedValue(new Error('Network error'));
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <Login />
    </LoginContext.Provider>
  );
  const email = screen.getByLabelText('Email Address *')
  fireEvent.change(email, { target: { value: 'molly@books.com' } });
  const passwd = screen.getByLabelText('Password *')
  fireEvent.change(passwd, { target: { value: 'mollymember' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled()
  });
});

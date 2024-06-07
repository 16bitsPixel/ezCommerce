import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import  SignUp from '../../src/views/Signup';
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
const mockSetUserId = jest.fn();
const mocksetView = jest.fn();

const mockLoginContext = {
  userName: '',
  accessToken: '',
  userId: '',
  setAccessToken: mockSetAccessToken,
  setUserName: mockSetUserName,
  setUserId: mockSetUserId,
  view: 'Signup',
  setView: mocksetView,
};

it('renders singup form', () => {
  render(
    <LoginProvider>
      <Login />
      <SignUp />
    </LoginProvider>
  );
  fireEvent.click(screen.getByText("Don't have an account? Sign Up"))
  expect(screen.getByLabelText('First Name *'))
  expect(screen.getByLabelText('Last Name *'))
  expect(screen.getByLabelText('Email Address *'))
  expect(screen.getByLabelText('Password *'))
  expect(screen.getByRole('button', { name: 'Sign Up' }))
});

it('clicks login button', async () => {
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <SignUp />
    </LoginContext.Provider>
  );
  fireEvent.click(screen.getByText("Already have an account? Sign in"))
  await waitFor(() => {
    expect(mocksetView).toHaveBeenCalledWith('Login');
  });
});

it('handles form submission with valid credentials', async () => {
  // Mock fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { signup: { role: 'Member', firstname: 'Test', lastname: 'User', email: 'test@book.com', password:'password' } } }),
    })
  ) as jest.Mock;
  window.alert = jest.fn()
  render(
    <LoginProvider>
      <Login />
      <SignUp />
    </LoginProvider>
  );
  fireEvent.click(screen.getByText("Don't have an account? Sign Up"))
  const first = screen.getByLabelText('First Name *')
  fireEvent.change(first,  { target: { value: 'John' } });
  const last = screen.getByLabelText('Last Name *')
  fireEvent.change(last,  { target: { value: 'Doe' } });
  const email = screen.getByLabelText('Email Address *')
  fireEvent.change(email,  { target: { value: 'new@user.com' } });
  const passwd = screen.getByLabelText('Password *')
  fireEvent.change(passwd,  { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Signup successful! Please wait for an admin to accept you.');
  });
});

it('handles form submission with existing user', async () => {
  // Mock fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { errors: { role: 'Member', firstname: 'Test', lastname: 'User', email: 'test@book.com', password:'password' } } }),
    })
  ) as jest.Mock;
  window.alert = jest.fn()
  render(
    <LoginProvider>
      <Login />
      <SignUp />
    </LoginProvider>
  );
  fireEvent.click(screen.getByText("Don't have an account? Sign Up"))
  const first = screen.getByLabelText('First Name *')
  fireEvent.change(first,  { target: { value: 'John' } });
  const last = screen.getByLabelText('Last Name *')
  fireEvent.change(last,  { target: { value: 'Doe' } });
  const email = screen.getByLabelText('Email Address *')
  fireEvent.change(email,  { target: { value: 'new@user.com' } });
  const passwd = screen.getByLabelText('Password *')
  fireEvent.change(passwd,  { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Signup failed. Please try again.');
  });
});

it('handles general error', async () => {
  window.alert = jest.fn();
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network Error'))
  ) as jest.Mock;
  render(
    <LoginProvider>
      <Login />
      <SignUp />
    </LoginProvider>
  );
  fireEvent.click(screen.getByText("Don't have an account? Sign Up"))
  fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'Jane' } });
  fireEvent.change(screen.getByLabelText('Last Name *'), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText('Email Address *'), { target: { value: 'error@user.com' } });
  fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password123' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Sign Up' }));
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(new Error('Network Error'));
  });
});

it('handles specific error message from server', async () => {
  // Mock fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ errors: [{ message: 'User already exists' }] }),
    })
  ) as jest.Mock;
  window.alert = jest.fn();
  render(
    <LoginProvider>
      <Login />
      <SignUp />
    </LoginProvider>
  );
  fireEvent.click(screen.getByText("Don't have an account? Sign Up"))
  fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'John' } });
  fireEvent.change(screen.getByLabelText('Last Name *'), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText('Email Address *'), { target: { value: 'existing@user.com' } });
  fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password123' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Sign Up' }));
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('User already exists');
  });
});



import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../../src/views/Login';
import { SignUp } from '../../src/views/Signup'
import { LoginProvider } from '../../src/context/Login';
import { useRouter } from 'next/router';
import { setupServer } from 'msw/node';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: any) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('next/router', () => require('next-router-mock'));

// const mockPush = jest.fn();
// (useRouter as jest.Mock).mockReturnValue({
//   push: mockPush,
// });

const server = setupServer();

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// -- Login Tests --
it('renders login form', () => {
  render(
    <LoginProvider>
      <Login />
    </LoginProvider>
  );
  expect(screen.getByLabelText('email-placeholder'))
  expect(screen.getByLabelText('password-placeholder'))
  expect(screen.getByTestId('login-button'))
});

it('handles form submission with valid credentials', async () => {
  // Mock fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: { login: { name: 'Test User', accessToken: 'test-token' } } }),
    })
  ) as jest.Mock;
  render(
    <LoginProvider>
      <Login />
    </LoginProvider>
  );
  const email = screen.getByLabelText('email-placeholder')
  userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByLabelText('password-placeholder')
  userEvent.type(passwd, 'mollymember');
  expect(screen.getByTestId('login-button'))
  // await waitFor(() => {
  //   expect(mockPush).toHaveBeenCalledWith('/');
  // });
  // expect(screen.queryByLabelText('email-placeholder')).toBeNull();
  // expect(screen.queryByLabelText('password-placeholder')).toBeNull();
});

// it('Rejects Bad Credentials', async () => {
//   let alerted = false
//   window.alert = () => { alerted = true }
//   render(
//     <LoginProvider>
//       <Login />
//     </LoginProvider>
//   );
//   const email = screen.getByLabelText('Email Address')
//   fireEvent.change(email, 'molly@books.com');
//   const passwd = screen.getByLabelText('Password')
//   fireEvent.change(passwd, 'wrongpassword');
//   fireEvent.click(screen.getByText('Login'));
//   await waitFor(() => {
//     expect(alerted).toBeTruthy()
//   });
// });

// -- SignUp Tests --
it('renders signup form', () => {
  render(
    <LoginProvider>
      <Login />
      <SignUp />
    </LoginProvider>
  );
  fireEvent.click(screen.getByTestId('create-button'));
  expect(screen.queryByText('Login')).toBeNull();
  expect(screen.getByLabelText('first-name'))
  expect(screen.getByLabelText('last-name'))
  expect(screen.getByLabelText('email-placeholder'))
  expect(screen.getByLabelText('password-placeholder'))
  expect(screen.getByTestId('signup-button'))
});

// it('handles form submission with valid credentials', async () => {
//   render(
//     <LoginProvider>
//       <Login />
//       <SignUp />
//     </LoginProvider>
//   );
//   fireEvent.click(screen.getByTestId('create-button'));
//   const first = screen.getByLabelText('first-name')
//   userEvent.type(first, 'John');
//   const last = screen.getByLabelText('last-name')
//   userEvent.type(last, 'Doe');
//   const email = screen.getByLabelText('email-placeholder')
//   userEvent.type(email, 'new@user.com');
//   const passwd = screen.getByLabelText('password-placeholder')
//   userEvent.type(passwd, 'password123');
//   fireEvent.click(screen.getByTestId('signup-button'));
//   await waitFor(() => {
//     expect(window.alert).toHaveBeenCalledWith('Signup successful! You can now log in.');
//   });
// });

// it('handles form submission with existing user', async () => {
//   render(
//     <LoginProvider>
//       <Login />
//       <SignUp />
//     </LoginProvider>
//   );
//   fireEvent.click(screen.getByTestId('create-button'));
//   const first = screen.getByLabelText('first-name')
//   userEvent.type(first, 'John');
//   const last = screen.getByLabelText('last-name')
//   userEvent.type(last, 'Doe');
//   const email = screen.getByLabelText('email-placeholder')
//   userEvent.type(email, 'new@user.com');
//   const passwd = screen.getByLabelText('password-placeholder')
//   userEvent.type(passwd, 'password123');
//   fireEvent.click(screen.getByTestId('signup-button'));
//   await waitFor(() => {
//     expect(window.alert).toHaveBeenCalledWith('Signup failed. Please try again.');
//   });
// });

it('switches to login view when button clicked', () => {
  render(
    <LoginProvider>
      <Login />
      <SignUp />
    </LoginProvider>
  );
  fireEvent.click(screen.getByTestId('create-button'));
  fireEvent.click(screen.getByTestId('signin-button'));
  expect(screen.queryByTestId('signin-button')).toBeNull();
});


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../../src/views/Login';
import { LoginProvider, LoginContext } from '../../src/context/Login';
import { useRouter } from 'next/router';
import { setupServer } from 'msw/node';
import { SignUp } from '@/views/Signup';
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

const server = setupServer();

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockSetAccessToken = jest.fn();
const mockSetUserName = jest.fn();

const mockLoginContext = {
  userName: '',
  accessToken: '',
  setAccessToken: mockSetAccessToken,
  setUserName: mockSetUserName,
  view: 'Login',
  setView: jest.fn(),
  id: '',
  setId: jest.fn()
};

// -- Login Tests --
it('renders login form', () => {
  render(
    <LoginProvider>
      <Login />
    </LoginProvider>
  );
  expect(screen.getByTestId('login-form'))
  expect(screen.getByLabelText('Email Address'))
  expect(screen.getByLabelText('Password'))
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
    <LoginContext.Provider value={mockLoginContext}>
      <Login />
    </LoginContext.Provider>
  );
  const email = screen.getByLabelText('Email Address')
  fireEvent.change(email, { target: { value: 'molly@books.com' } });
  const passwd = screen.getByLabelText('Password')
  fireEvent.change(passwd, { target: { value: 'mollymember' } });
  fireEvent.submit(screen.getByTestId('login-button'))
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
  const email = screen.getByLabelText('Email Address')
  fireEvent.change(email,  { target: { value: 'molly@books.com' } });
  const passwd = screen.getByLabelText('Password')
  fireEvent.change(passwd,  { target: { value: 'wrongpassword' } });
  fireEvent.submit(screen.getByTestId('login-button'))
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalled()
  });
});

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
  expect(screen.getByLabelText('First Name'))
  expect(screen.getByLabelText('Last Name'))
  expect(screen.getByLabelText('Email Address'))
  expect(screen.getByLabelText('Password'))
  expect(screen.getByTestId('signup-button'))
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
  fireEvent.click(screen.getByTestId('create-button'));
  const first = screen.getByLabelText('First Name')
  fireEvent.change(first,  { target: { value: 'John' } });
  const last = screen.getByLabelText('Last Name')
  fireEvent.change(last,  { target: { value: 'Doe' } });
  const email = screen.getByLabelText('Email Address')
  fireEvent.change(email,  { target: { value: 'new@user.com' } });
  const passwd = screen.getByLabelText('Password')
  fireEvent.change(passwd,  { target: { value: 'password123' } });
  fireEvent.click(screen.getByTestId('signup-button'));
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Signup successful! You can now log in.');
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
  fireEvent.click(screen.getByTestId('create-button'));
  const first = screen.getByLabelText('First Name')
  fireEvent.change(first,  { target: { value: 'John' } });
  const last = screen.getByLabelText('Last Name')
  fireEvent.change(last,  { target: { value: 'Doe' } });
  const email = screen.getByLabelText('Email Address')
  fireEvent.change(email,  { target: { value: 'new@user.com' } });
  const passwd = screen.getByLabelText('Password')
  fireEvent.change(passwd,  { target: { value: 'password123' } });
  fireEvent.click(screen.getByTestId('signup-button'));
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
  fireEvent.click(screen.getByTestId('create-button'));
  fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Jane' } });
  fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'error@user.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  fireEvent.submit(screen.getByTestId('signup-button'));
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
  fireEvent.click(screen.getByTestId('create-button'));
  fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
  fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'existing@user.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  fireEvent.submit(screen.getByTestId('signup-button'));
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('User already exists');
  });
});

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

it('handles add to cart during login', async () => {
    // Mock fetch response for login
    global.fetch = jest.fn((url, options) => {
      if (url.includes('graphql')) {
        if (options && options.method === 'POST' && options.body.includes('login')) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                data: { login: { name: 'Test User', accessToken: 'test-token', id: '123' } },
              }),
          });
        } else if (options && options.method === 'POST' && options.body.includes('addToCart')) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                data: { addToCart: { id: 'product-1', quantity: 1 } },
              }),
          });
        }
      }
      return Promise.reject(new Error('Network Error'));
    }) as jest.Mock;

    // Set up localStorage
    const cartItems = [{ id: 'product-1', quantity: 1 }];
    localStorage.setItem('cart', JSON.stringify(cartItems));

    render(
      <LoginContext.Provider value={mockLoginContext}>
        <Login />
      </LoginContext.Provider>
    );

    const email = screen.getByLabelText('Email Address');
    fireEvent.change(email, { target: { value: 'molly@books.com' } });
    const passwd = screen.getByLabelText('Password');
    fireEvent.change(passwd, { target: { value: 'mollymember' } });
    fireEvent.submit(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith('test-token');
      expect(mockSetUserName).toHaveBeenCalledWith('Test User');
    });
  });

  it('handles error message from addToCart mutation', async () => {
    // Mock fetch response for login and addToCart with error
    global.fetch = jest.fn((url, options) => {
      if (url.includes('graphql')) {
        if (options && options.method === 'POST' && options.body.includes('login')) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                data: { login: { name: 'Test User', accessToken: 'test-token', id: '123' } },
              }),
          });
        } else if (options && options.method === 'POST' && options.body.includes('addToCart')) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                errors: [{ message: 'Some error occurred' }],
              }),
          });
        }
      }
      return Promise.reject(new Error('Network Error'));
    }) as jest.Mock;

    window.alert = jest.fn();
    
    // Set up localStorage
    const cartItems = [{ id: 'product-1', quantity: 1 }];
    localStorage.setItem('cart', JSON.stringify(cartItems));

    render(
      <LoginContext.Provider value={mockLoginContext}>
        <Login />
      </LoginContext.Provider>
    );

    const email = screen.getByLabelText('Email Address');
    fireEvent.change(email, { target: { value: 'molly@books.com' } });
    const passwd = screen.getByLabelText('Password');
    fireEvent.change(passwd, { target: { value: 'mollymember' } });
    fireEvent.submit(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith('test-token');
      expect(mockSetUserName).toHaveBeenCalledWith('Test User');
      expect(window.alert).toHaveBeenCalledWith('Some error occurred');
    });
  });

  it('handles network error during addToCart mutation', async () => {
    // Mock fetch response for login and addToCart with network error
    global.fetch = jest.fn((url, options) => {
      if (url.includes('graphql')) {
        if (options && options.method === 'POST' && options.body.includes('login')) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                data: { login: { name: 'Test User', accessToken: 'test-token', id: '123' } },
              }),
          });
        } else if (options && options.method === 'POST' && options.body.includes('addToCart')) {
          return Promise.reject(new Error('Network Error'));
        }
      }
      return Promise.reject(new Error('Network Error'));
    }) as jest.Mock;

    window.alert = jest.fn();
    
    // Set up localStorage
    const cartItems = [{ id: 'product-1', quantity: 1 }];
    localStorage.setItem('cart', JSON.stringify(cartItems));

    render(
      <LoginContext.Provider value={mockLoginContext}>
        <Login />
      </LoginContext.Provider>
    );

    const email = screen.getByLabelText('Email Address');
    fireEvent.change(email, { target: { value: 'molly@books.com' } });
    const passwd = screen.getByLabelText('Password');
    fireEvent.change(passwd, { target: { value: 'mollymember' } });
    fireEvent.submit(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith('test-token');
      expect(mockSetUserName).toHaveBeenCalledWith('Test User');
      expect(window.alert).toHaveBeenCalledWith(new Error('Network Error'));
    });
  });



  const mockSignContext = {
    userName: '',
    accessToken: '',
    setAccessToken: mockSetAccessToken,
    setUserName: mockSetUserName,
    view: 'Signup',
    setView: jest.fn(),
    id: '',
    setId: jest.fn()
  };
  it('sets password error when password is too short', () => {
    render(
        <LoginContext.Provider value={mockSignContext}>
          <SignUp />
        </LoginContext.Provider>
      );

      const passwordInput = screen.getByLabelText('Password');
        fireEvent.change(passwordInput, { target: { value: 'short' } });

        
  });
  it('sets password error when password is too long', () => {
    render(
      <LoginContext.Provider value={mockSignContext}>
        <SignUp />
       </LoginContext.Provider> 
    );


    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'thispasswordistoolong' } });

  });
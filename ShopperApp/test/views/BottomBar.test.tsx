import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BottomBar } from '@/views/components/BottomBar';
import { useRouter } from 'next/router';
import { ScreenSizeContext } from '@/context/ScreenSize';
import { LoginContext } from '@/context/Login';
import React from 'react';
import '@testing-library/jest-dom'; 

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn((str: string) => {
      switch (str) {
      case 'change-locale':
        return 'Change Locale';
      case 'home':
        return 'Home';
      case 'orders':
        return 'Orders';
      case 'cart':
        return 'Cart';
      case 'sign-in':
        return 'Sign In';
      case 'logout':
        return 'logout';
      default:
        return str;
      }
    }),
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

// Mocking next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('BottomBar Component', () => {
  beforeEach(() => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push,
      locale: 'en',
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
  it('should call setSmallScreen when window is resized', () => {
    
    // Render the component with necessary contexts
    render(  
      <BottomBar />
    );

    // Simulate window resize
    global.innerWidth = 800;
    global.dispatchEvent(new Event('resize'));

    // Simulate window resize again
    global.innerWidth = 1200;
    global.dispatchEvent(new Event('resize'));
  });


  it('Does not render BottomBar when not small screen', () => {
    const isSmallScreen = false;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <BottomBar />
      </ScreenSizeContext.Provider>
    );

    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('Renders BottomBar when small screen', () => {
    const isSmallScreen = true;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <BottomBar />
      </ScreenSizeContext.Provider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('Test handleChangeLocale from en to es', () => {
    const push = useRouter().push;
    const isSmallScreen = true;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <BottomBar />
      </ScreenSizeContext.Provider>
    );

    fireEvent.click(screen.getByText('Change Locale'));
    expect(push).toHaveBeenCalledWith('/', '/', { locale: 'es' });
  });

  it('Test handleChangeLocale from es to en', () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      locale: 'es',
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
    });

    const push = useRouter().push;
    const isSmallScreen = true;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <BottomBar />
      </ScreenSizeContext.Provider>
    );

    fireEvent.click(screen.getByText('Change Locale'));
    expect(push).toHaveBeenCalledWith('/', '/', { locale: 'en' });
  });

  it('Test handleSignIn', () => {
    const push = useRouter().push;
    const isSmallScreen = true;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <BottomBar />
      </ScreenSizeContext.Provider>
    );

    fireEvent.click(screen.getByText('Sign In'));
    expect(push).toHaveBeenCalledWith('/login');
  });
});

it('Test handleLogout', async () => {
  const push = useRouter().push;
  const isSmallScreen = true;
  const setSmallScreen = jest.fn();
  const mockSetAccessToken = jest.fn();
  const mockSetUserName = jest.fn();
  const mockLoginContext = {
    userName: 'Test User',
    accessToken: 'test-token',
    setAccessToken: mockSetAccessToken,
    setUserName: mockSetUserName,
    view: 'Login',
    setView: jest.fn(),
    id: '123',
    setId: jest.fn()
  };
  render(
    <LoginContext.Provider value={mockLoginContext}>
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <BottomBar />
      </ScreenSizeContext.Provider>
    </LoginContext.Provider>
  );
  fireEvent.click(screen.getByText('logout'));
  await waitFor(() => {
    expect(mockSetAccessToken).toHaveBeenCalledWith('');
    expect(mockSetUserName).toHaveBeenCalledWith('');
    expect(push).toHaveBeenCalledWith('/');
  });
  
});

it('Sets value based on pathname /order', () => {
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    locale: 'en',
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    route: '/',
    pathname: '/order',
    query: {},
    asPath: '/',
  });

  const isSmallScreen = true;
  const setSmallScreen = jest.fn();

  render(
    <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
      <BottomBar />
    </ScreenSizeContext.Provider>
  );

  const ordersButton = screen.getByText('Orders');
  expect(ordersButton).toBeInTheDocument();
  fireEvent.click(ordersButton);
  expect(ordersButton).toHaveClass('Mui-selected');
});

it('Sets value based on pathname /cart', () => {
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    locale: 'en',
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    route: '/',
    pathname: '/cart',
    query: {},
    asPath: '/',
  });

  const isSmallScreen = true;
  const setSmallScreen = jest.fn();

  render(
    <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
      <BottomBar />
    </ScreenSizeContext.Provider>
  );

  const cartButton = screen.getByText('Cart');
  expect(cartButton).toBeInTheDocument();
  fireEvent.click(cartButton);
  expect(cartButton).toHaveClass('Mui-selected');
});

it('Sets value based on pathname /login', () => {
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    locale: 'en',
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    route: '/',
    pathname: '/login',
    query: {},
    asPath: '/',
  });

  const isSmallScreen = true;
  const setSmallScreen = jest.fn();

  render(
    <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
      <BottomBar />
    </ScreenSizeContext.Provider>
  );

  const signInButton = screen.getByText('Sign In');
  expect(signInButton).toBeInTheDocument();
  fireEvent.click(signInButton);
  expect(signInButton).toHaveClass('Mui-selected');
});

it('Sets value based on default pathname', () => {
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    locale: 'en',
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    route: '/',
    pathname: '/some-other-path',
    query: {},
    asPath: '/',
  });

  const isSmallScreen = true;
  const setSmallScreen = jest.fn();

  render(
    <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
      <BottomBar />
    </ScreenSizeContext.Provider>
  );

  const homeButton = screen.getByText('Home');
  expect(homeButton).toBeInTheDocument();
  fireEvent.click(homeButton);
  expect(homeButton).toHaveClass('Mui-selected');
});

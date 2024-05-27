import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BottomBar } from '@/views/components/BottomBar';
import { useRouter } from 'next/router';
import { ScreenSizeContext } from '@/context/ScreenSize';
import { LoginContext } from '@/context/Login';
import React from 'react';
import '@testing-library/jest-dom'; // Importing jest-dom for custom matchers

// Mocking react-i18next
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
import { render, screen, fireEvent } from '@testing-library/react';
import { TopBar } from '@/views/components/TopBar';
import { useRouter } from 'next/router';
import { ScreenSizeContext } from '@/context/ScreenSize';
import React from 'react';
import '@testing-library/jest-dom'; 

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn((str: string) => {
      if (str === 'search-ezCommerce') return '';
      return str;
    }),
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('TopBar Component', () => {
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

  it('Renders Top Bar with buttons in desktop view', () => {
    const isSmallScreen = false;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <TopBar />
      </ScreenSizeContext.Provider>
    );

    expect(screen.queryAllByText('sign-in').length).toBe(1);
    expect(screen.queryAllByText('orders').length).toBe(1);
    expect(screen.queryAllByText('cart').length).toBe(1);
    expect(screen.getByPlaceholderText('Search EzCommerce')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search EzCommerce')).toHaveAttribute('aria-label', 'search');
  });

  it('Renders Top Bar with search bar in mobile view', () => {
    const isSmallScreen = true;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <TopBar />
      </ScreenSizeContext.Provider>
    );

    expect(screen.queryByPlaceholderText('Search EzCommerce')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search EzCommerce')).toHaveAttribute('aria-label', 'search');
  });

  it('Test signing in', () => {
    const push = useRouter().push;
    const isSmallScreen = false;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <TopBar />
      </ScreenSizeContext.Provider>
    );

    fireEvent.click(screen.getByText('sign-in'));
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('Test locale change button to es', () => {
    (useRouter as jest.Mock).mockReturnValue({
      locale: 'en',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
    });

    const isSmallScreen = false;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <TopBar />
      </ScreenSizeContext.Provider>
    );

    expect(screen.getByText('change-locale')).toBeInTheDocument();
    fireEvent.click(screen.getByText('change-locale'));
    expect(useRouter().push).not.toHaveBeenCalled();
  });

  it('Test locale change button to en', () => {
    (useRouter as jest.Mock).mockReturnValue({
      locale: 'es',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
    });

    const isSmallScreen = false;
    const setSmallScreen = jest.fn();

    render(
      <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
        <TopBar />
      </ScreenSizeContext.Provider>
    );

    expect(screen.getByText('change-locale')).toBeInTheDocument();
    fireEvent.click(screen.getByText('change-locale'));
    expect(useRouter().push).not.toHaveBeenCalled();
  });
});

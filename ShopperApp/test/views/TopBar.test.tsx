import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { TopBar } from '@/views/components/TopBar';
import { useRouter } from 'next/router';
import { ScreenSizeContext } from '@/context/ScreenSize';
import { LoginContext } from '@/context/Login';
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

  it('Test locale change button to es', async () => {
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

    const selecterb = await screen.findByText('EN');
    fireEvent.mouseDown(selecterb);
    const wkspc = await screen.getByText('ES');
    fireEvent.click(wkspc);
    await waitFor(() => screen.findByText('ES'));
    expect(useRouter().push).toHaveBeenCalled();
  });

  it('Test locale change button to en', async () => {
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

    const selecterb = await screen.findByText('ES');
    fireEvent.mouseDown(selecterb);
    const wkspc = await screen.getByText('EN');
    fireEvent.click(wkspc);
    await waitFor(() => screen.findByText('EN'));
    expect(useRouter().push).toHaveBeenCalled();
  });
});

it('Test locale change button to es and back to en', async () => {
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

  let selecterb = await screen.findByText('EN');
  fireEvent.mouseDown(selecterb);
  let wkspc = await screen.getByText('ES');
  fireEvent.click(wkspc);
  await waitFor(() => screen.findByText('ES'));
  expect(useRouter().push).toHaveBeenCalled();
  selecterb = await screen.findByText('ES');
  fireEvent.mouseDown(selecterb);
  wkspc = await screen.getByText('EN');
  fireEvent.click(wkspc);
  await waitFor(() => screen.findByText('EN'));
  expect(useRouter().push).toHaveBeenCalled();
});

it('Test locale change button to en and back to es', async () => {
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

  let selecterb = await screen.findByText('ES');
  fireEvent.mouseDown(selecterb);
  let wkspc = await screen.getByText('EN');
  fireEvent.click(wkspc);
  await waitFor(() => screen.findByText('EN'));
  expect(useRouter().push).toHaveBeenCalled();
  selecterb = await screen.findByText('EN');
  fireEvent.mouseDown(selecterb);
  wkspc = await screen.getByText('ES');
  fireEvent.click(wkspc);
  await waitFor(() => screen.findByText('ES'));
  expect(useRouter().push).toHaveBeenCalled();
});

it('Test handleLogout', async () => {
  const push = useRouter().push;
  const isSmallScreen = false;
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
        <TopBar />
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
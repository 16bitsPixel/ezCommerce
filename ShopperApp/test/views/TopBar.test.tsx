import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { TopBar } from '@/views/components/TopBar';
import { useRouter } from 'next/router';
import { ScreenSizeContext } from '@/context/ScreenSize';
import { LoginContext } from '@/context/Login';
import React from 'react';
import '@testing-library/jest-dom'; 
import { SearchContext } from '@/context/SearchContext';
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

it('Navigates to /login or /order based on accessToken', async () => {
    const push = useRouter().push;
    const isSmallScreen = false;
    const setSmallScreen = jest.fn();
    
    // Test when accessToken is empty
    let mockLoginContext = {
      userName: 'Test User',
      accessToken: '',
      setAccessToken: jest.fn(),
      setUserName: jest.fn(),
      view: 'Login',
      setView: jest.fn(),
      id: '123',
      setId: jest.fn()
    };

    const { rerender } = render(
      <LoginContext.Provider value={mockLoginContext}>
        <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
          <TopBar />
        </ScreenSizeContext.Provider>
      </LoginContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /orderButtonTop/i }));
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });

    // Test when accessToken is not empty
    mockLoginContext = {
      ...mockLoginContext,
      accessToken: 'test-token',
    };

    rerender(
      <LoginContext.Provider value={mockLoginContext}>
        <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
          <TopBar />
        </ScreenSizeContext.Provider>
      </LoginContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /orderButtonTop/i }));
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/order');
    });
  });

  it('Navigates to /cart when cart button is clicked', async () => {
    const push = useRouter().push;
    const isSmallScreen = false;
    const setSmallScreen = jest.fn();
    
    const mockLoginContext = {
      userName: 'Test User',
      accessToken: 'test-token',
      setAccessToken: jest.fn(),
      setUserName: jest.fn(),
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

    fireEvent.click(screen.getByRole('button', { name: /cart/i }));
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/cart');
    });
  });
  
  it('Clears search term and navigates to home when home button is clicked', async () => {
    const push = useRouter().push;
    const isSmallScreen = false;
    const setSmallScreen = jest.fn();
    
    const mockSetSearchTerm = jest.fn();

    const mockLoginContext = {
      userName: 'Test User',
      accessToken: 'test-token',
      setAccessToken: jest.fn(),
      setUserName: jest.fn(),
      view: 'Login',
      setView: jest.fn(),
      id: '123',
      setId: jest.fn()
    };

    render(
      <LoginContext.Provider value={mockLoginContext}>
        <SearchContext.Provider value={{ searchTerm: '', setSearchTerm: mockSetSearchTerm }}>
          <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
            <TopBar />
          </ScreenSizeContext.Provider>
        </SearchContext.Provider>
      </LoginContext.Provider>
    );

    fireEvent.click(screen.getByText('ezCommerce'));
    await waitFor(() => {
      expect(mockSetSearchTerm).toHaveBeenCalledWith('');
      expect(push).toHaveBeenCalledWith('/');
    });
  });

  it('Updates input value on change', () => {
    const isSmallScreen = false;
    const setSmallScreen = jest.fn();
    
    const mockSetSearchTerm = jest.fn();

    const mockLoginContext = {
      userName: 'Test User',
      accessToken: 'test-token',
      setAccessToken: jest.fn(),
      setUserName: jest.fn(),
      view: 'Login',
      setView: jest.fn(),
      id: '123',
      setId: jest.fn()
    };

    const { container } = render(
      <LoginContext.Provider value={mockLoginContext}>
        <SearchContext.Provider value={{ searchTerm: '', setSearchTerm: mockSetSearchTerm }}>
          <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
            <TopBar />
          </ScreenSizeContext.Provider>
        </SearchContext.Provider>
      </LoginContext.Provider>
    );

    const input = container.querySelector('input[aria-label="search"]') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'test search' } });

    expect(input.value).toBe('test search');
  });

  it('Sets search term and navigates to home on search', () => {
    const isSmallScreen = false;
    const setSmallScreen = jest.fn();

    const mockSetSearchTerm = jest.fn();
    const mockLoginContext = {
      userName: 'Test User',
      accessToken: 'test-token',
      setAccessToken: jest.fn(),
      setUserName: jest.fn(),
      view: 'Login',
      setView: jest.fn(),
      id: '123',
      setId: jest.fn(),
    };

    const { container } = render(
      <LoginContext.Provider value={mockLoginContext}>
        <SearchContext.Provider value={{ searchTerm: '', setSearchTerm: mockSetSearchTerm }}>
          <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
            <TopBar />
          </ScreenSizeContext.Provider>
        </SearchContext.Provider>
      </LoginContext.Provider>
    );

    const input = container.querySelector('input[aria-label="search"]') as HTMLInputElement;
    const searchButton = container.querySelector('.searchIcon') as HTMLButtonElement;

    // Simulate input change
    fireEvent.change(input, { target: { value: 'test search' } });

    // Simulate search button click
    fireEvent.click(searchButton);

    expect(mockSetSearchTerm).toHaveBeenCalledWith('test search');
    expect(useRouter().push).toHaveBeenCalledWith('/');
  });

  it('Triggers search on Enter key press', () => {
    const isSmallScreen = false;
    const setSmallScreen = jest.fn();

    const mockSetSearchTerm = jest.fn();
    const mockLoginContext = {
      userName: 'Test User',
      accessToken: 'test-token',
      setAccessToken: jest.fn(),
      setUserName: jest.fn(),
      view: 'Login',
      setView: jest.fn(),
      id: '123',
      setId: jest.fn(),
    };

    const { container } = render(
      <LoginContext.Provider value={mockLoginContext}>
        <SearchContext.Provider value={{ searchTerm: '', setSearchTerm: mockSetSearchTerm }}>
          <ScreenSizeContext.Provider value={{ isSmallScreen, setSmallScreen }}>
            <TopBar />
          </ScreenSizeContext.Provider>
        </SearchContext.Provider>
      </LoginContext.Provider>
    );

    const input = container.querySelector('input[aria-label="search"]') as HTMLInputElement;

    // Simulate input change
    fireEvent.change(input, { target: { value: 'test search' } });

    // Simulate Enter key press
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('test search');
    expect(useRouter().push).toHaveBeenCalledWith('/');
  });
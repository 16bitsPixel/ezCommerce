// Home.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Home } from '../../src/views/Home';
import { LoginContext } from '../../src/context/Login';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Mocking TopBar, PendingVendors, and Vendor components
jest.mock('./../../src/views/Topbar', () => () => <div data-testid="topbar">TopBar</div>);
jest.mock('./../../src/views/pending', () => () => <div data-testid="pendingvendors">PendingVendors</div>);
jest.mock('./../../src/views/vendors', () => () => <div data-testid="vendors">Vendor</div>);

const mockPendingVendors = [
  { vendorId: 1, name: 'Pending Vendor 1' },
  { vendorId: 2, name: 'Pending Vendor 2' },
];

const mockVendors = [
  { vendorId: 1, name: 'Vendor 1' },
  { vendorId: 2, name: 'Vendor 2' },
];

describe('Home Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders TopBar, PendingVendors, and Vendor components when accessToken is present', async () => {
    fetchMock.mockResponses(
      [
        JSON.stringify({ data: { getpendingVendors: mockPendingVendors } }),
        { status: 200 },
      ],
      [
        JSON.stringify({ data: { getVendors: mockVendors } }),
        { status: 200 },
      ]
    );

    const loginContextValue = {
      accessToken: 'mockAccessToken',
      userName: '',
      setAccessToken: jest.fn(),
      setUserName: jest.fn(),
    };

    render(
      <LoginContext.Provider value={loginContextValue}>
        <Home />
      </LoginContext.Provider>
    );

    // Verify that the components are rendered
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('pendingvendors')).toBeInTheDocument();
    expect(screen.getByTestId('vendors')).toBeInTheDocument();

    // Wait for the fetch calls to complete and the components to update
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        '/admin/api/graphql',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            query: `query pendingVendors { getpendingVendors {vendorId,name}}`,
          }),
        })
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        '/admin/api/graphql',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            query: `query Vendors { getVendors {vendorId,name}}`,
          }),
        })
      );
    });
  });

  it('renders nothing when accessToken is not present', () => {
    const loginContextValue = {
      accessToken: '',
      userName: '',
      setAccessToken: jest.fn(),
      setUserName: jest.fn(),
    };

    const { container } = render(
      <LoginContext.Provider value={loginContextValue}>
        <Home />
      </LoginContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });
  it('renders TopBar, PendingVendors, and Vendor components when accessToken is present', async () => {
    fetchMock.mockResponses(
      [
        JSON.stringify({ errors: { getpendingVendors: mockPendingVendors } }),
        { status: 200 },
      ],
      [
        JSON.stringify({ errors: { getVendors: mockVendors } }),
        { status: 200 },
      ]
    );

    const loginContextValue = {
      accessToken: 'mockAccessToken',
      userName: '',
      setAccessToken: jest.fn(),
      setUserName: jest.fn(),
    };

    render(
      <LoginContext.Provider value={loginContextValue}>
        <Home />
      </LoginContext.Provider>
    );
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PendingVendors from '@/views/pending';
import { LoginContext } from '@/context/Login';
//import { getVendors } from '@/views/Home';

jest.mock('../../src/views/Home', () => ({
  getVendors: jest.fn(),
}));
export interface Vendor {
    vendorId: number;
    name: string;
    accepted: string;
  }
global.fetch = jest.fn();

describe('PendingVendors Component', () => {
  const mockInitialVendors: Vendor[] = [
    { vendorId: 1, name: 'Vendor 1', accepted: "false" },
    { vendorId: 2, name: 'Vendor 2', accepted: "false" },
  ];

  const mockSetAccessToken = jest.fn();
  const mockSetUserName = jest.fn();
  const mockAccessToken = 'testAccessToken';
  const mockLoginContextValue = {
    accessToken: mockAccessToken,
    userName: '',
    setAccessToken: mockSetAccessToken,
    setUserName: mockSetUserName,
  };

  const mockGetVendors = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

  });

  it('should render pending vendors and handle accept vendor', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          acceptVendors: {
            name: 'Vendor 1',
          },
        },
      }),
    } as any);

    render(
      <LoginContext.Provider value={mockLoginContextValue}>
        <PendingVendors initialVendors={mockInitialVendors} state={mockGetVendors} />
      </LoginContext.Provider>
    );

    expect(screen.getByText('Pending Vendors')).toBeInTheDocument();

    // Expand the list
    fireEvent.click(screen.getByText('Pending Vendors'));

    // Check if initial vendors are rendered after expanding
    await waitFor(() => {
      expect(screen.getByText('Vendor 1')).toBeInTheDocument();
      expect(screen.getByText('Vendor 2')).toBeInTheDocument();
    });


    // Accept a vendor
    fireEvent.click(screen.getAllByText('Accept')[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/admin/api/graphql', expect.any(Object));
    });
   
  });

  it('should render pending vendors but fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        errors: {
          acceptVendors: {
            name: 'Vendor 1',
          },
        },
      }),
    } as any);

    render(
      <LoginContext.Provider value={mockLoginContextValue}>
        <PendingVendors initialVendors={mockInitialVendors} state={mockGetVendors} />
      </LoginContext.Provider>
    );
    expect(screen.getByText('Pending Vendors')).toBeInTheDocument();

    // Expand the list
    fireEvent.click(screen.getByText('Pending Vendors'));

    // Check if initial vendors are rendered after expanding
    await waitFor(() => {
      expect(screen.getByText('Vendor 1')).toBeInTheDocument();
      expect(screen.getByText('Vendor 2')).toBeInTheDocument();
    });


    // Accept a vendor
    fireEvent.click(screen.getAllByText('Accept')[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/admin/api/graphql', expect.any(Object));
    });
  });
});


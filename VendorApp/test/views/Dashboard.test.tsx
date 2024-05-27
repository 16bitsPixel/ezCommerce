import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import Dashboard from '@/views/components/Dashboard';
import { LoginContext } from '@/context/Login';
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
  userName: 'abcd',
  accessToken: '1234',
  userId: '5678',
  setAccessToken: mockSetAccessToken,
  setUserName: mockSetUserName,
  setUserId: mockSetUserId,
  view: 'Login',
  setView: mocksetView,
};

it('Renders Dashboard', () => {
    render(<Dashboard/>)
})

it('clicks logout button', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ errors: "N/A" }),
        })
    ) as jest.Mock;
    window.alert = jest.fn()
    render(
      <LoginContext.Provider value={mockLoginContext}>
        <Dashboard />
      </LoginContext.Provider>
    );
    fireEvent.click(screen.getByText("Logout"))
    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith('');
      expect(mockSetUserName).toHaveBeenCalledWith('');
      expect(mockSetUserId).toHaveBeenCalledWith('');
      expect(mocksetView).toHaveBeenCalledWith('Login');
    });
});
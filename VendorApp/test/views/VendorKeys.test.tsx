import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { VendorKeys } from '@/views/components/VendorKeys';
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
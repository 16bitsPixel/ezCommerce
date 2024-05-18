import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { setupServer } from 'msw/node';
import Dashboard from '@/views/components/Dashboard';
import { LoginContext } from '@/context/Login';
import '@testing-library/jest-dom'; // For custom matchers

const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Renders Dashboard', () => {
    render(<Dashboard/>)
})
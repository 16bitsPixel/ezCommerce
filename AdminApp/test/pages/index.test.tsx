import { render, screen } from '@testing-library/react'
import Index from '../../src/pages/index';
import React from 'react';


describe('Index', () => {
  beforeEach(() => {
    jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => ({
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      isFallback: false,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }));
  });

  it('Renders', async () => {
    render(<Index />)
  });

  it('Renders App', async () => {
    render(<Index />)
    expect(screen.getByLabelText('Email Address *'))
    expect(screen.getByLabelText('Password *'))
    expect(screen.getByRole('button', { name: 'Sign In' }))
  });
});
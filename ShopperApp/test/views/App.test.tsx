/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { render } from '@testing-library/react'

import { App } from '../../src/views/App';

import React from 'react';


// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('App', () => {
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

  it('Renders', () => {
    const { getByText } = render(<App />);
    expect(getByText(/change-locale/i)).toBeInTheDocument();
  });
});

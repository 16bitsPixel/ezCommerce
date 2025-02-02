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

import { render, screen } from '@testing-library/react'
import { GetServerSidePropsContext } from 'next';
import Index, { getServerSideProps } from '../../src/pages/index';
import React from 'react';


// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock serverSideTranslations
jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn(),
}));

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

  it('returns expected props', async () => {
    const { serverSideTranslations } = require('next-i18next/serverSideTranslations');
    serverSideTranslations.mockResolvedValue({ common: {} });
    const context = {
      locale: 'en',
    } as unknown as GetServerSidePropsContext;
    const result = await getServerSideProps(context);
    expect(result).toEqual({
      props: {
        common: {},
      },
    });
    expect(serverSideTranslations).toHaveBeenCalledWith('en', ['common']);
  });
});
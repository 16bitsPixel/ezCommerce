import { render, screen } from '@testing-library/react';
import { TopBar } from '@/views/components/TopBar';

jest.mock('react-i18next', () => ({
    useTranslation: () => {
      return {
        t: (str:any) => str,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    },
  }));

  jest.mock('next/router', () => require('next-router-mock'));

it('Renders Top Bar with buttons desktop view', async () => {
  render(
      <TopBar />
  );

  expect(screen.queryAllByText('sign-in').length).toBe(1);
  expect(screen.queryAllByText('orders').length).toBe(1);
  expect(screen.queryAllByText('cart').length).toBe(1);

});


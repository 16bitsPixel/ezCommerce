import { render, screen } from '@testing-library/react';
import { BottomBar } from '@/views/components/BottomBar';
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

it('Renders Bottom Bar', async () => {
    render(
        <BottomBar />
    );
  
});
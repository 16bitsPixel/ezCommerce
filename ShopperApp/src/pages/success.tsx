// pages/success.js
import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { TopBar } from '@/views/components/TopBar';
import { BottomBar } from '@/views/components/BottomBar';

export const getServerSideProps = async (context: any) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default function Success() {
  const { t } = useTranslation('common');

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopBar />
      <h1 className='success'>{t('thank-you')}</h1>
      <BottomBar />
    </div>
  );
}

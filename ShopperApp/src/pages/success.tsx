// pages/success.js
import React, { Fragment } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SuccessText } from '@/views/Success';
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
        <Fragment>
            <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        </Fragment>
        <SuccessText/>

    </div>
  );
}

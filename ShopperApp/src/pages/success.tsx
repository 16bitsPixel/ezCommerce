import React from 'react';
import Head from 'next/head'
import { Fragment } from 'react'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Cart } from '@/views/Cart';
import { TopBar } from '@/views/components/TopBar';
import { BottomBar } from '@/views/components/BottomBar';

export const getServerSideProps: GetServerSideProps = async (context) => {
  let language = 'en'
  if (context.locale) {
    language = context.locale
  }
  return {
    props: {
      ...(await serverSideTranslations(language, [
        'common',
      ])),
    },
  };
};

export default function Success() {
    return (
        <Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <TopBar/>
            <h1 className='success'>Thank you, your order has been placed.</h1>
        <BottomBar/>

      </Fragment>
    )
}
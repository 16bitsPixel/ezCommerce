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

import React from 'react';
import Head from 'next/head'
import { Fragment } from 'react'
import { App } from '../views/App'

import type { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
      ])),
    },
  }
}

export default function Index() {
  const { t } = useTranslation('common');
  const title = t('title');
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 id='welcome'>{title}</h2>
      <App/>
    </Fragment>
  )
}
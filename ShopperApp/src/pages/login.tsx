import React from 'react';
import Head from 'next/head';
import { Fragment } from 'react';
import { Login } from '../views/Login';
import { SignUp } from '../views/Signup';
import { LoginProvider } from '../context/Login'

import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
      ])),
    },
  };
};

export default function LoginPage() {
  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Login/>
        <SignUp/>
    </Fragment>
  );
}

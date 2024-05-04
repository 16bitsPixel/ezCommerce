/*
#######################################################################
#
# Copyright (C) 2020-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/
import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { LoginContext } from '../context/Login'
import Link from 'next/link';

export function Login() {
  const loginContext = React.useContext(LoginContext)
  const [user, setUser] = React.useState({email: '', password: ''});
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleInputChange = (event: any) => {
    const {value, name} = event.target;
    const u = user;
    if (name == 'email') {
      u.email = value;
    } else {
      u.password = value;
    }
    setUser(u);
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    const query = {query: `query login{login(email: "${user.email}" password: "${user.password}") { name, accessToken }}`}
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          alert(`${json.errors[0].message}`)
        } else {
          loginContext.setAccessToken(json.data.login.accessToken)
          loginContext.setUserName(json.data.login.name)
        }
      })
      .catch((e) => {
        alert(e)
      });
  };

  const changeTo = router.locale === 'en' ? 'es' : 'en'

  if (loginContext.accessToken.length < 1) {
    return (
      <div>
         <Link href="/" locale={changeTo}>
            <button>{t('change-locale', { changeTo })}</button>
          </Link>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          aria-label={t('email-placeholder') || 'Email Address'}
          placeholder={t('email-placeholder') || 'Email Address'}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          aria-label={t('password-placeholder') || 'Password'}
          placeholder={t('password-placeholder') || 'Password'}
          onChange={handleInputChange}
          required
        />
        <input type="submit" value={t('login') || 'Login'}/>
      </form>
      </div>
    );
  }
  else {
    return null
  }
}
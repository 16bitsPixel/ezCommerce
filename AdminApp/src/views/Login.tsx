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

import { LoginContext } from '../context/Login'

export function Login() {
  const loginContext = React.useContext(LoginContext)
  const [user, setUser] = React.useState({email: '', password: ''});

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

  if (loginContext.accessToken.length < 1) {
    return (
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          aria-label="Email Address"
          placeholder="Email Address"
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          aria-label="Password"
          placeholder="Password"
          onChange={handleInputChange}
          required
        />
        <input type="submit" value="Login"/>
      </form>
    )
  }
  else {
    return null
  }
}
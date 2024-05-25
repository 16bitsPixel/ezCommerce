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
import TopBar from './Topbar';
import { LoginContext } from '../context/Login'

const fetchBooks = (setBooks: Function, setError: Function, accessToken: string) => {
  const query = {query: `query book {book {isbn, title, author, publisher}}`}
  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      if (json.errors) {
        setError(`${json.errors[0].message}`)
        setBooks([])
      } else {
        setError('')
        setBooks(json.data.book)
      }
    })
    .catch((e) => {
      setError(e.toString())
      setBooks([])
    })
};

export function Home() {
  const loginContext = React.useContext(LoginContext)
  const [books, setBooks] = React.useState([])
  const [error, setError] = React.useState('Logged Out')

  const logout = () => {
    loginContext.setAccessToken('')
    setBooks([]);
    setError('Logged Out');
  };

  React.useEffect(() => {
    fetchBooks(setBooks, setError, loginContext.accessToken);
  }, [loginContext.accessToken]);

  if (loginContext.accessToken.length > 0) {
    return (
      <div>
        <TopBar/>
        Hello Admin
      </div>
    )
  }
  else {
    return null
  }
}

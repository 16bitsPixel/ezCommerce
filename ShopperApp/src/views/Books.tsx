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
import { Book } from '../graphql/book/schema'

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

export function Books() {
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
        <button onClick={logout}>Logout</button>
        <label>{loginContext.userName}</label>
        <p/>
        <table id='books'>
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
            </tr>
          </thead>
          <tbody>
            {books.sort((a: Book, b: Book) => (a.title > b.title) ? 1 : -1).map((book: Book) => (
              <tr key={book.isbn} id={'isbn'+book.isbn}>
                <td>{book.isbn}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
              </tr>
            ))}
            <tr key={'error'}>
              <td colSpan={4}>{error}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  else {
    return null
  }
}

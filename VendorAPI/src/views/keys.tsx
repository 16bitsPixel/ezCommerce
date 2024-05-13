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
export interface placeholder{
    id: "123",
    key: "AIzaSyBnVx6b-F1xG6JXa-dJAcVfPL78u2Q9Q",
}
  


const fetchBooks = (
  setBooks: (...args: any) => any, // eslint-disable-line @typescript-eslint/no-explicit-any
  setError: (...args: any) => any, // eslint-disable-line @typescript-eslint/no-explicit-any
  accessToken: string) => 
{
  const query = {query: `query keys {APIKeys {id,key}}`}
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
        setBooks(json.data.APIKeys)
        console.log(json.data.APIKeys);
      }
    })
    .catch((e) => {
      setError(e.toString())
      setBooks([])
    })
};

export function APIKeys() {
  const loginContext = React.useContext(LoginContext)
  const [keys, setkeys] = React.useState([])
  const [error, setError] = React.useState('Logged Out')

  const logout = () => {
    loginContext.setAccessToken('')
    setkeys([]);
    setError('Logged Out');
  };

  React.useEffect(() => {
    fetchBooks(setkeys, setError, loginContext.accessToken);
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
              <th>Key ID</th>
              <th>Service</th>
              <th>Key Value</th>
              <th>Expiration Date</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key: placeholder) => (
              <tr key={key.id}>
                <td>{key.id}</td>
                <td>{'N/A'}</td>
                <td style={{ maxWidth: '200px', overflow: 'auto', whiteSpace: 'nowrap' }}>{key.key}</td>
                <td>{'No Expiration'}</td>
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
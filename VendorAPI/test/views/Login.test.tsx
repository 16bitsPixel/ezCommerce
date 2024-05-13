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

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { LoginContext } from '../../src/context/Login'
import { Login } from '../../src/views/Login';

let apiCalled = false;

const handlers = [
  graphql.query('login', ({ query, variables }) => {
    apiCalled = true
    if (query.includes('anna@books.com')) {
      return HttpResponse.json({
        errors: [ {
            "message": "Some Error",
          },
        ]},
      )
    }
    return HttpResponse.json({
      data: {
        login: {
          "name": "Some Name",
          "accessToken": "Some JWT"
        },
      },
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('Signs Molly In', async () => {
  let accessToken = ''
  const setAccessToken = (newToken: string) => {accessToken = newToken}
  const userName = ''
  const setUserName= () => {}
  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
      <Login/>
    </LoginContext.Provider>
  )
  const email = screen.getByLabelText('Email Address')
  await userEvent.type(email, 'molly@books.com')
  const passwd = screen.getByLabelText('Password')
  await userEvent.type(passwd, 'mollymember')
  fireEvent.click(screen.getByText('Login'))
  await waitFor(() => {
    expect(accessToken).toBe('Some JWT')
  });
});


it('Signs Molly In with Default Context', async () => {
  apiCalled = false
  render(<Login/>)
  const email = screen.getByLabelText('Email Address')
  await userEvent.type(email, 'molly@books.com')
  const passwd = screen.getByLabelText('Password')
  await userEvent.type(passwd, 'mollymember')
  fireEvent.click(screen.getByText('Login'))
  await waitFor(() => {
    expect(apiCalled).toBe(true)
  });
});

it('Rejects Bad Credentials', async () => {
  let alerted = false
  window.alert = () => { alerted = true }
  render(<Login />)
  const email = screen.getByLabelText('Email Address')
  await userEvent.type(email, 'anna@books.com')
  const passwd = screen.getByLabelText('Password')
  await userEvent.type(passwd, 'not-annas-password')
  fireEvent.click(screen.getByText('Login'))
  await waitFor(() => {
    expect(alerted).toBeTruthy()
  });
});

it('Does Not Render with accessToken (already logged in)', async () => {
  const accessToken = 'some old token'
  const setAccessToken = () => {}
  const userName = ''
  const setUserName= () => {}
  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
      <Login/>
    </LoginContext.Provider>
  )
  expect(screen.queryAllByText('Login').length).toBe(0)
});

it('Alerts When No Server', async () => {
  server.close()
  let alerted = false
  window.alert = () => { alerted = true }
  render(<Login />)
  const email = screen.getByLabelText('Email Address')
  await userEvent.type(email, 'anna@books.com')
  const passwd = screen.getByLabelText('Password')
  await userEvent.type(passwd, 'not-annas-password')
  fireEvent.click(screen.getByText('Login'))
  await waitFor(() => {
    expect(alerted).toBeTruthy()
  });
});

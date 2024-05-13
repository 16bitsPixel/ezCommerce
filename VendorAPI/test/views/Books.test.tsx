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

import { render, screen, fireEvent } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { LoginContext } from '../../src/context/Login'
import { Books } from '../../src/views/Books';

let returnError = false;

const handlers = [
  graphql.query('book', ({ query, variables }) => {
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        book: [{
          "isbn": "Some ISBN 3",
          "title": "Some Title 3",
          "author": "Some Author",
          "publisher": "Some Publisher",
        },{
          "isbn": "Some ISBN 1",
          "title": "Some Title 1",
          "author": "Some Author",
          "publisher": "Some Publisher",
        },{
          "isbn": "Some ISBN 2",
          "title": "Some Title 2",
          "author": "Some Author",
          "publisher": "Some Publisher",
        },
      ]},
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
beforeEach(() => returnError = false)
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('Renders with accessToken', async () => {
  // window.alert = (message) => { console.log(message) }
  const accessToken = 'some old token'
  const setAccessToken = () => {}
  const userName = ''
  const setUserName= () => {}
  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
      <Books/>
    </LoginContext.Provider>
  )
  await screen.findByText('Some ISBN 1')
});

it('Does Not Render without accessToken', async () => {
  const accessToken = ''
  const setAccessToken = () => {}
  render(
    <LoginContext.Provider value={{ accessToken, setAccessToken}}>
      <Books/>
    </LoginContext.Provider>
  )
  expect(screen.queryAllByText('ISBN').length).toBe(0)
});

it('Renders Logout Button', async () => {
  window.alert = (message) => { console.log(message) }
  const accessToken = 'some old token'
  const setAccessToken = () => {}
  const userName = ''
  const setUserName= () => {}
  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
      <Books/>
    </LoginContext.Provider>
  )
  fireEvent.click(screen.getByText('Logout'))
});

it('Handles and Displays GraphQL Errors', async () => {
  returnError = true;
  window.alert = (message) => { console.log(message) }
  const accessToken = 'some old token'
  const setAccessToken = () => {}
  const userName = ''
  const setUserName= () => {}
  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
      <Books/>
    </LoginContext.Provider>
  )
  await screen.findByText('Some Error')
});
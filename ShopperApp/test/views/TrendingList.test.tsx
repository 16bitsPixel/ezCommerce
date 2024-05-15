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

import { render, screen, waitFor } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { TrendingList } from '@/views/components/TrendingList';

let returnError = false;

const handlers = [
  graphql.query('product', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      })
    }
    return HttpResponse.json({
      data: {
        product: [
          {
            "id": "1",
            "name": "test1",
            "price": 10,
            "rating": 5,
            "image": "some image"
          },
          {
            "id": "2",
            "name": "test2",
            "price": 1,
            "rating": 1,
            "image": "some image 2"
          }
        ]
      },
    })
  }),
];

const server = setupServer(...handlers)

beforeAll(() => server.listen())
beforeEach(() => returnError = false)
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('Renders', async () => {
  render(
    <TrendingList />
  );

  await waitFor(() => {
    expect(screen.queryAllByText('test1').length).toBe(1);
  });
});

it('Errors When No Server', async () => {
  server.close()

  render(
    <TrendingList />
  );

  expect(screen.queryAllByText('test1').length).toBe(0);
});
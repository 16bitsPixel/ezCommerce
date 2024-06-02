import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { SearchResult } from '@/views/components/SearchResult';
import { SearchContext } from '@/context/SearchContext';

let returnError = false;
let mockSearchTerm = 'test';

const handlers = [
  graphql.query('searchProducts', ({ variables }) => {
    console.log(variables);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      });
    }
    return HttpResponse.json({
      data: {
        searchProducts: [
          {
            id: '1',
            name: 'test1',
            price: 10,
            rating: 5,
            image: ['some image'],
          },
          {
            id: '2',
            name: 'test2',
            price: 1,
            rating: 1,
            image: ['some image 2'],
          },
        ],
      },
    });
    return HttpResponse.json({
      data: {
        searchProducts: [],
      },
    });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
beforeEach(() => {
  returnError = false;
  mockSearchTerm = 'test';
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Renders search results', async () => {
  render(
    <SearchContext.Provider value={{ searchTerm: mockSearchTerm, setSearchTerm: jest.fn() }}>
      <SearchResult />
    </SearchContext.Provider>
  );
  await waitFor(() => {
    expect(screen.queryAllByText('test1').length).toBe(1);
    expect(screen.queryAllByText('test2').length).toBe(1);
  });
});

it('Shows 0 results message when no results are found', async () => {
  mockSearchTerm = 'no results';
  render(
    <SearchContext.Provider value={{ searchTerm: mockSearchTerm, setSearchTerm: jest.fn() }}>
      <SearchResult />
    </SearchContext.Provider>
  );
  await waitFor(() => {
    expect(screen.getByText(`0 results for "${mockSearchTerm}"`)).toBeInTheDocument();
  });
});

it('Returns null when there is no search term', () => {
  mockSearchTerm = '';
  const { container } = render(
    <SearchContext.Provider value={{ searchTerm: mockSearchTerm, setSearchTerm: jest.fn() }}>
      <SearchResult />
    </SearchContext.Provider>
  );
  expect(container.firstChild).toBeNull();
});

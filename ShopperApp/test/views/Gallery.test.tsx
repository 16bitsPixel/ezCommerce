import React from 'react';

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { setupServer } from 'msw/node';

import {Gallery} from '@/views/components/Gallery';
let returnError = false;
const server = setupServer();

beforeAll(() => server.listen())
beforeEach(() => returnError = false)
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('Renders', async () => {
  render(<Gallery />);
  await waitFor(() => {
    expect(screen.getByTestId('3')).toBeDefined();
  });
});

it('Right Arrow Works', () => {
  render(<Gallery />);
  const rightArrow = screen.getByLabelText('arrow-right');
  const currentSlide = screen.getByTestId('1');
  fireEvent.click(rightArrow);
  const newSlide = screen.getByTestId('2');
  expect(newSlide).not.toEqual(currentSlide);
});

it('Left Arrow Works', () => {
  render(<Gallery />);
  const leftArrow = screen.getByLabelText('arrow-left');
  const currentSlide = screen.getByTestId('1');
  fireEvent.click(leftArrow);
  const newSlide = screen.getByTestId('3');
  expect(newSlide).not.toEqual(currentSlide);
});

// Objectively a wack test
it('Bottom Bubbles Work', () => {
  render(<Gallery />);
  const currentSlide = screen.getByTestId('1');
  expect(currentSlide).toBeDefined();
  const secondBubble = screen.getByTestId('indicator-2');
  fireEvent.click(secondBubble);
  const newSlide = screen.getByTestId('2');
  expect(newSlide).not.toEqual(currentSlide);
  // Below here is specifically to combat the weird branch
  // issue I was getting
  const leftArrow = screen.getByLabelText('arrow-left');
  fireEvent.click(leftArrow);
});

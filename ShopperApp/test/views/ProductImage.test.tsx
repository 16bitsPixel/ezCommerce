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

import { render, screen, waitFor, fireEvent } from '@testing-library/react'

import { ProductImage } from '@/views/components/Product/ProductImage';

const testImages = [
  "img1", "img2"
];

it('Renders', async () => {
  render(
    <ProductImage images = {testImages} />
  );

  await waitFor(() => {
    expect(screen.getByLabelText('cardImage')).toBeInTheDocument();
  });
});

it('Zoom in main', async () => {
  render(
    <ProductImage images = {testImages} />
  );

  await waitFor(() => {
    expect(screen.getByLabelText('cardImage')).toBeInTheDocument();
  });

  const cardImage = screen.getByLabelText('cardImage');
  
  // hover over and out of main image
  fireEvent.mouseOver(cardImage);
  fireEvent.mouseOut(cardImage);
});

it('Change image', async () => {
  render(
    <ProductImage images = {testImages} />
  );

  await waitFor(() => {
    expect(screen.getByLabelText('cardImage')).toBeInTheDocument();
  });

  const thumbnail = screen.getByLabelText('thumbnail-1');
  
  // hover over and out of main image
  fireEvent.mouseOver(thumbnail);
  fireEvent.mouseOut(thumbnail);
});

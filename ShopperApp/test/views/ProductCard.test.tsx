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

import { render, screen, fireEvent } from '@testing-library/react'

import ProductCard from '@/views/components/ProductCard';

const testProduct = {
  id: '1',
  name: 'test',
  price: 99.99,
  rating: 5,
  image: ''
};

it('Renders Product Card', async () => {
  render(
    <ProductCard
      id = {testProduct.id}
      name={testProduct.name}
      price={testProduct.price}
      image={testProduct.image}
    />
  );

  const cardImage = screen.getByLabelText('cardImage');
  expect(cardImage).toBeDefined();
  
  // hover over and out of image
  fireEvent.mouseOver(cardImage);
  fireEvent.mouseOut(cardImage);

  expect(screen.queryAllByText('test').length).toBe(1);
});

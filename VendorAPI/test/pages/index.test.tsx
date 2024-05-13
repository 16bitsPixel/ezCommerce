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

import { render, screen } from '@testing-library/react'

import Index from '../../src/pages/index';

it('Renders', async () => {
  render(<Index />)
  await screen.findByText('CSE187 Micro Service Book Example')
});
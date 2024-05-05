/*
#######################################################################
#
# Copyright (C) 2020-2022 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import type { Product } from './schema'
import type { NextApiRequest } from 'next'


export class ProductService{
  async getAll(request: NextApiRequest): Promise<Product[]> {
    const res = await fetch('http://localhost:3012/api/v0/product')
    return res.json()
  }
}


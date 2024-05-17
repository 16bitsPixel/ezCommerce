/* eslint-disable @typescript-eslint/no-unused-vars */
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


import { UUID, Product } from '.'
import { pool } from '../db'

export class ProductService {
  public async getAll(): Promise<Product[]> {
    const select = 'SELECT * FROM product';
    const query = {
      text: select,
      values: [],
    };
    const {rows} = await pool.query(query);
    const products = [];

    for (const row of rows) {
      const product = row.product;
      product.id = row.id;
      products.push(product)
    }
    return products
  }
}

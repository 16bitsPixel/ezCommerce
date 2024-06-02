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


import { UUID, Product, ProductAdd } from '.'
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

  public async get(productId: UUID): Promise<Product | undefined> {
    const select = 'SELECT * FROM product WHERE id = $1';
    const query = {
      text: select,
      values: [productId],
    };
    const {rows} = await pool.query(query);
    if (rows.length === 0) {
      return undefined;
    }

    const product = rows[0].product;
    product.id = rows[0].id;
    return product;
  }

  public async addProduct(productInfo: ProductAdd): Promise<Product> {
    console.log("ProductInfo: ", productInfo.description)
    const insert = `INSERT INTO product(product)
            VALUES (
                jsonb_build_object(
                    'name', $1::text,
                    'description', $2::jsonb,
                    'price', $3::numeric,
                    'rating', 0,
                    'image', $4::jsonb
                )
            ) RETURNING *`;

    const query = {
      text: insert,
      values: [productInfo.name, JSON.stringify(productInfo.description), productInfo.price, JSON.stringify(productInfo.image)]
    };
    const { rows } = await pool.query(query);
    return {id: rows[0].id,
      name: rows[0].product.name,
      description: rows[0].product.description,
      price: rows[0].product.price,
      rating: rows[0].product.rating,
      image: rows[0].product.image,
    };
  }

  public async search(query: string): Promise<Product[]> {
    const select = `
      SELECT * FROM product
      WHERE product->>'name' ILIKE $1
      OR product->>'description' ILIKE $1
    `;
    const queryParams = {
      text: select,
      values: [`%${query}%`],
    };
    const {rows} = await pool.query(queryParams);
    const products = [];
    for (const row of rows) {
      const product = row.product;
      product.id = row.id;
      products.push(product)
    }
    return products
  }
}

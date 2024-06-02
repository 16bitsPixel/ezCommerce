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

import {
  Controller,
  Get,
  Route,
  Response,
  Query,
  Post,
  Body,
  SuccessResponse
} from 'tsoa'

import { Product, ProductAdd  } from '.'
import { ProductService } from './service'


@Route('product')
export class ProductController extends Controller {
  @Get('')
  public async getAll(
  ): Promise<Product[]> {
    return new ProductService().getAll()
  }

  @Get('product')
  @Response('404', 'Product Not Found')
  public async getProductById(
    @Query() productId: string
  ): Promise<Product | undefined> {
    const product = await new ProductService().get(productId);
    if (!product) {
      this.setStatus(404);
    }
    return product;
  }

  @Post('addProduct')
  @SuccessResponse('201', 'Product Created')
  public async addProduct(
    @Body() productInfo: ProductAdd
  ): Promise<Product> {
    try {
      console.log("about to try")
      return await new ProductService().addProduct(productInfo);
    } catch (error) {
      console.error('Error in addProduct controller', error);
      throw new Error('Failed to create product');
    }
  }

  @Get('search')
  @Response('404', 'No Products Found')
  public async searchProducts(
    @Query() query: string
  ): Promise<Product[]> {
    const products = await new ProductService().search(query);
    if (!products || products.length === 0) {
      this.setStatus(404);
    }
    return products;
  }
}

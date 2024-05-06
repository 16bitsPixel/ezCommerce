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
} from 'tsoa'

import { Product } from '.'
import { ProductService } from './service'

@Route('product')
export class ProductController extends Controller {
  @Get('')
  public async getAll(
  ): Promise<Product[]> {
    return new ProductService().getAll()
  }
}

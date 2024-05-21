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
  Path
} from 'tsoa'

import { Product, UUID } from '.'
import { ProductService } from './service'


@Route('product')
export class ProductController extends Controller {
  @Get('')
  public async getAll(
  ): Promise<Product[]> {
    return new ProductService().getAll()
  }

  @Get('{productId}')
  @Response('404', 'Order Not Found')
  public async get(
    @Path() productId: UUID
  ): Promise<Product | undefined> {
    return new ProductService().get(productId)
      .then((order: Product | undefined): Product|undefined => {
        if (!order) {
          this.setStatus(404);
        }
        return order;
      }) 
  }
}

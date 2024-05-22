import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  Security
} from 'tsoa';
  

import { Product, ProductAdd } from '.';
import { ProductService } from './service';
//import { AccountService } from './service';
  
@Route('products')
export class AccountController extends Controller {
  @Post()
  @Security('jwt',["member"])
  @Response('401', 'Unauthorized')
  public async postProduct(
      @Body() productInfo: ProductAdd,
  ): Promise<Product|undefined> {
    return await new ProductService().addProduct(productInfo)
  }
}
  
  
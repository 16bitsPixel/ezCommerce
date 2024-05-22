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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      @Body() productInfo: ProductAdd,
  ): Promise<Product|undefined> {
        console.log("heere")
        return await new ProductService().addProduct(productInfo)
    // return {
    //   id: "123e4567-e89b-12d3-a456-426655440000",
    //   name: "string",
    //   description: "string",
    //   price: 1234,
    //   rating: 1234,
    //   image: "string"
    // }
  }
}
  
  
import {
  Body,
  Controller,
  Post,
  Get,
  Response,
  Request,
  Route,
  SuccessResponse,
  Security,
} from 'tsoa';
import * as express from 'express';
import { inputWishlist, Wishlist } from '.';
import { wishListService } from './service';


@Route('Wishlist')
export class WishListController extends Controller {
  @Post()
  @Security("jwt", ["member"])
  @Response('401', 'Unauthorised')
  @SuccessResponse('201', "Wishlist item added succefully")
  public async addWishlist(
    @Body() wishlist: inputWishlist,
    @Request() request: express.Request
  ): Promise<Wishlist> {
    return new wishListService().addWishlist(`${request.user?.id}`,wishlist);
  }
  @Get()
  @Security("jwt", ["member"])
  @Response('401', 'Unauthorised')
  @SuccessResponse('200', "Wishlist succefully retrieved")
  public async getwishList(
    @Request() request: express.Request
  ): Promise<Wishlist []>{
    return new wishListService().getWishList(`${request.user?.id}`)
  }
}

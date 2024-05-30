
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
  Put
} from 'tsoa';
import * as express from 'express';
import { CartAdd, CartItem } from '.';
import { CartService } from './service';

@Route('Cart')
export class CartController extends Controller {
  @Get()
  @Security("jwt", ["member"])
  @Response('401', 'Unauthorised')
  public async GetCart(
    @Request() request: express.Request
  ): Promise<CartItem[]> {
    return new CartService().getCart(`${request.user?.id}`);
  }

  @Post()
  @Security("jwt", ["member"])
  @SuccessResponse('201', 'Added to Cart')
  public async AddToCart(
    @Body() productAccountInfo: CartAdd,
    @Request() request: express.Request
  ): Promise<CartItem> {
    return new CartService().addToCart(productAccountInfo,`${request.user?.id}`);
  }

  @Put()
  @Security("jwt", ["member"])
  @SuccessResponse('201', 'Added to Cart')
  public async SetCart(
    @Body() newCart: CartItem[],
    @Request() request: express.Request
  ): Promise<CartItem[]> {
    return new CartService().setCart(newCart, `${request.user?.id}`);
  }
}
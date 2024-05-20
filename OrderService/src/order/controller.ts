import {
  Controller,
  Get,
  Route,
  Post,
  Response,
  SuccessResponse,
  Path,
  Request,
  Body
} from 'tsoa'

import * as express from 'express';

import { Order, UUID } from '.'
import { OrderService } from './service'

@Route('order')
export class OrderController extends Controller {
  @Get('')
  public async getAll(
  ): Promise<Order[]> {
    return new OrderService().getAll()
  }

  @Get('{orderId}')
  @Response('404', 'Order Not Found')
  public async get(
    @Path() orderId: UUID
  ): Promise<Order | undefined> {
    return new OrderService().get(orderId)
      .then((order: Order | undefined): Order|undefined => {
        if (!order) {
          this.setStatus(404);
        }
        return order;
      }) 
  }

  @Post()
  @Response('404', 'Unknown Account')
  @SuccessResponse('201', 'Order Created')
  public async createOrder(
    @Body() productId: UUID,
    @Request() request: express.Request
  ): Promise<Order | undefined> {
    return new OrderService().create(productId,request)
      .then((order: Order | undefined): Order|undefined => {
        if (!order) {
          this.setStatus(404);
        }
        return order;
      });
  }
}
import {
  Controller,
  Get,
  Route,
  Post,
  Response,
  SuccessResponse,
  Path,
  Body
} from 'tsoa'

// import * as express from 'express';

import { Order, UUID, InputOrder } from '.'
import { OrderService } from './service'

@Route('order')
export class OrderController extends Controller {
  // @Get('')
  // public async getAll(
  // ): Promise<Order[]> {
  //   return new OrderService().getAll()
  // }

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
  @SuccessResponse('201', 'Order Created')
  public async createOrder(
    @Body() product: InputOrder,
    // @Request() request: express.Request
  ): Promise<Order | undefined> {
    return new OrderService().create(product)
      .then((order: Order | undefined): Order|undefined => {
        // if (!order) {
        //   this.setStatus(404);
        // }
        return order;
      });
  }

  @Get('{orderId}/status')
  @Response('404', 'Order Not Found')
  public async checkOrderStatus(
    @Path() orderId: UUID
  ): Promise<{ status: string } | undefined> {
    return new OrderService().getOrderStatus(orderId)
      .then((status: string | undefined): { status: string } | undefined => {
        if (!status) {
          this.setStatus(404);
          return undefined;
        }
        return { status };
      });
  }
}
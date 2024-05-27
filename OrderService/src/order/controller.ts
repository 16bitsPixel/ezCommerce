import {
  Controller,
  Get,
  Put,
  Post,
  Route,
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

  @Put('{orderId}/status')
  @Response('400', 'Invalid Status')
  @Response('404', 'Order Not Found')
  @SuccessResponse('200', 'Status Updated')
  public async updateOrderStatus(
    @Path() orderId: UUID,
    @Body() body: { status: string }
  ): Promise<void> {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    if (!validStatuses.includes(body.status)) {
      this.setStatus(400);
      return;
    }
    const updated = await new OrderService().updateOrderStatus(orderId, body.status);
    if (!updated) {
      this.setStatus(404);
    } else {
      this.setStatus(200);
    }
  }
}
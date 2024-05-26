import {
  Body,
  Controller,
  Get,
  Put,
  Response,
  Route,
  Security,
  Path
} from 'tsoa';
import { Orders } from '.';
import { OrderService } from './service';
  
@Route('orders')
export class OrderController extends Controller {
    @Get('')
    @Security('jwt', ["member"])
    @Response('401', 'Unauthorized')
  public async getOrders(

  ): Promise <Orders[] | undefined> {
    return await new OrderService().getOrders()
  }

    @Put('{orderId}/status')
    @Security('jwt', ["member"])
    @Response('401', 'Unauthorized')
    public async updateOrderStatus(
        @Path() orderId: string,
        @Body() body: {status: string}
    ): Promise<boolean> {
      return await new OrderService().updateOrderStatus(orderId, body.status);
    }

}
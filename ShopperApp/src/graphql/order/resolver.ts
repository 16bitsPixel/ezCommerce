import { Query, Resolver, Arg, Mutation, Authorized} from "type-graphql"
// import type { NextApiRequest as Request } from 'next'


import { Order, InputOrder } from "./schema"
import { OrderService } from "./service"

@Resolver()
export class OrderResolver {
  @Authorized("member")
  @Query(() => [Order])
  async order(
    // @Ctx() request: Request
    @Arg('accountId') accountId: string
  ): Promise<Order[]> {
    console.log("here")
    // console.log(`User requesting books is: ${request.user.id})`)
    return new OrderService().getAll(accountId);
  }

  @Query(() => Order, { nullable: true })
  async orderInfo(
    @Arg("orderId") orderId: string,
    // @Ctx() request: NextApiRequest
  ): Promise<Order | undefined> {
    return new OrderService().get(orderId);
  }

  @Query(() => Order, { nullable: true })
  async orderStatus(
    @Arg("orderId") orderId: string,
    // @Ctx() request: NextApiRequest
  ): Promise<Order | undefined> {
    return new OrderService().getStatus(orderId);
  }

  @Mutation(() => Order)
  async updateOrderStatus(
    @Arg("orderId") orderId: string,
    // @Ctx() request: NextApiRequest
  ): Promise<Order | undefined> {
    return new OrderService().updateStatus(orderId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => Order)
  async createOrder(
    @Arg("input") input: InputOrder,
  ): Promise<Order> {
    // console.log(`User creating the post is: ${request.user?.name}`);
    return new OrderService().create(input);
  }
}

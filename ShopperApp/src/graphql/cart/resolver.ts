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

import { Query, Resolver, Arg, Ctx, Authorized, Mutation} from "type-graphql"

import { CartItem } from "./schema"
import { CartService } from "./service"
import type { NextApiRequest as Request } from "next"

@Resolver()
export class CartResolver {
  @Authorized("member")
  @Query(() => [CartItem])
  async Cart(
    @Ctx() request: Request
  ): Promise<CartItem[]> {
    // console.log(`User requesting books is: ${request.user.id})`)
    console.log(request.user.accessToken);
    return new CartService().getCart(request.user.accessToken)
  }

  @Authorized("member")
  @Mutation(() => CartItem)
  async addToCart(
    @Ctx() request: Request,
    @Arg("productId") productId: string,
    @Arg("quantity") quantity: number
  ): Promise<CartItem> {
    // console.log(`User requesting books is: ${request.user.id})`)
    return new CartService().addToCart(productId, quantity, request.user.accessToken)
  }
}

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

import { Query, Resolver, Arg, Ctx, Authorized} from "type-graphql"

import { CartItem } from "./schema"
import { CartService } from "./service"
import type { NextApiRequest as Request } from "next"

@Resolver()
export class CartResolver {
  @Query(() => [CartItem])
  async cart(
    @Ctx() request: Request
  ): Promise<CartItem[]> {
    // console.log(`User requesting books is: ${request.user.id})`)
    return new CartService().getCart()
  }
}

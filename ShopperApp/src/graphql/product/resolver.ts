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

import { Query, Resolver, Authorized} from "type-graphql"

import { Product } from "./schema"
import { ProductService } from "./service"

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  async product(): Promise<Product[]> {
    // console.log(`User requesting books is: ${request.user.id})`)
    return new ProductService().getAll()
  }
}

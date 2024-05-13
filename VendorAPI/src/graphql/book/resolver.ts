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

import { 
  Query, 
  Resolver, 
  Authorized, 
  // Ctx, 
} from "type-graphql"

// import type { NextApiRequest } from 'next'

import { Key } from "./schema"
import { ApikeyService } from "./service"

@Resolver()
export class KeyResolver {
  @Authorized("vendor")
  @Query(() => [Key])
  async APIKeys(
  // @Ctx() request: NextApiRequest
  ): Promise<Key[]> {
    // console.log(`User requesting books is: ${request.user.id})`)
    return new ApikeyService().all()
  }
}

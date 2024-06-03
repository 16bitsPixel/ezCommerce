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

import { Query, Resolver, Authorized, Mutation , Ctx} from "type-graphql"
import { Key } from "./schema"
import { ApikeyService } from "./service"
import type { NextApiRequest as Request } from "next"

@Resolver()
export class vendorResolver {
  @Authorized("vendor")
  @Query(() => [Key])
  async allkeys(
  @Ctx() request: Request,
  ): Promise<Key[]> {
    return new ApikeyService().all(request.user.accessToken)
  }

  @Authorized("vendor")
  @Mutation(() => Key)
  async createKey(
    @Ctx() request: Request,
  ): Promise<Key> {
    const key = await new ApikeyService().create(request.user.accessToken);
    if (!key) {
      throw new Error("Key creation failed");
    }
    return key;
  }
}

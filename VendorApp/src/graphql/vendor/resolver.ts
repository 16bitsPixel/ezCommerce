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

import { Query, Resolver, Authorized, Mutation, Arg } from "type-graphql"
import { Key } from "./schema"
import { ApikeyService } from "./service"

@Resolver()
export class vendorResolver {
  @Authorized("vendor")
  @Query(() => [Key])
  async allkeys(
  // @Ctx() request: NextApiRequest
  ): Promise<Key[]> {
    return new ApikeyService().all()
  }
  
  @Authorized("vendor")
  @Query(() => [Key], { nullable: true })
  async vendorkeys(
    @Arg("vendorId") vendorId: string,
    // @Ctx() request: NextApiRequest
  ): Promise<Key[] | null> {
    return new ApikeyService().one(vendorId);
  }

  @Authorized("vendor")
  @Mutation(() => String)
  async createKey(
    @Arg("vendorId") vendorId: string,
    // @Ctx() request: NextApiRequest
  ): Promise<string> {
    const key = await new ApikeyService().create(vendorId);
    if (!key) {
      throw new Error("Key creation failed");
    }
    return key;
  }
}

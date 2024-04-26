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

import { Resolver } from "type-graphql"

@Resolver()
export class AuthResolver {
  // @Query(returns => String)
  async login(
  ): Promise<string> {
    // throw new Error('Not implemented');
    return "Not implemented"
  }
}
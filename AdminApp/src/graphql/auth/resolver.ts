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

import { Query, Resolver, Args, Mutation } from "type-graphql"

import { Credentials, Authenticated, SignupCred } from "./schema"
import { AuthService } from "./service"

@Resolver()
export class AuthResolver {
  @Query(() => Authenticated)
  async login(
    @Args() credentials: Credentials,
  ): Promise<Authenticated> {
    return new AuthService().login(credentials)
  }

  @Mutation(() => Boolean)
  async signup(
    @Args() signupCred: SignupCred,
  ): Promise<Boolean|undefined> {
    return new AuthService().signup(signupCred)
  }

  @Query (() => Boolean)
  async isVerified(
    @Args() credentials: Credentials,
  ): Promise<Boolean|undefined> {
    return new AuthService().isVerified(credentials)
  }
}

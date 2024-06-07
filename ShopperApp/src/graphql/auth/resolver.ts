import { Query, Resolver, Args, Mutation } from "type-graphql"

import { Credentials, Authenticated, SignupCred, AccessToken } from "./schema"
import { AuthService } from "./service"

@Resolver()
export class AuthResolver {
  @Query(() => Authenticated)
  async login(
    @Args() credentials: Credentials,
  ): Promise<Authenticated> {
    return new AuthService().login(credentials)
  }

  @Query(() => Authenticated)
  async restore(
    @Args() accessToken: AccessToken,
  ): Promise<Authenticated> {
    return new AuthService().restore(accessToken)
  }

  @Mutation(() => Boolean)
  async signup(
    @Args() signupCred: SignupCred,
  ): Promise<boolean|undefined> {
    return new AuthService().signup(signupCred)
  }

  @Query (() => Boolean)
  async isVerified(
    @Args() credentials: Credentials,
  ): Promise<boolean|undefined> {
    return new AuthService().isVerified(credentials)
  }
}

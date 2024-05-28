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
  ): Promise<boolean|undefined> {
    return new AuthService().signup(signupCred)
  }

}

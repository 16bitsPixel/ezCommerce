import { Query, Resolver, Args, Mutation, Authorized, Arg } from "type-graphql"

import { Credentials, Authenticated, SignupCred, Vendor, VendorId } from "./schema"
import { AuthService, VendorService } from "./service"

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

  @Authorized("admin")
  @Query(() => [Vendor])
  async getVendors(
  ): Promise<Vendor[]> {
    return new VendorService().all()
  }
  @Authorized("admin")
  @Query(() => [Vendor])
  async getpendingVendors(
  ): Promise<Vendor[]> {
    return new VendorService().pendingall();
  }
  @Authorized("admin")
  @Mutation(() => Vendor)
  async acceptVendors(
    @Arg("input") id: VendorId
  ): Promise<Vendor> {
    return new VendorService().accept(id.id);
  }
}

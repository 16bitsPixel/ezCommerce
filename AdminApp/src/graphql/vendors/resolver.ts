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

import { Query, Resolver, Authorized } from "type-graphql"

import { Vendor } from "./schema"
import { VendorService } from "./service"

@Resolver()
export class VendorResolver {
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
}

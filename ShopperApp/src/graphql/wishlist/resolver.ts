import { Query, Resolver, Ctx, Authorized, Arg, Mutation} from "type-graphql"

import { WishList, WishListInput } from "./schema"
import { WishListService } from "./service"
import type { NextApiRequest as Request } from "next"
@Resolver()
export class WishListResolver {
  @Authorized("member")
  @Query(() => [WishList])
  async getWishList(
    @Ctx() request: Request,
  ): Promise<WishList[]> {
    return new WishListService().getallWishList(request.user.accessToken)
  }
  @Authorized("member")
  @Mutation(() => WishList)
  async addWishList(
    @Ctx() request: Request,
    @Arg('input') newItem : WishListInput
  ): Promise<WishList> {
    return new WishListService().addto(newItem, request.user.accessToken)
  }
}
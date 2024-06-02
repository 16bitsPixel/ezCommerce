import { Query, Resolver, Ctx, Authorized, Arg} from "type-graphql"

import { WishList } from "./schema"
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
  @Query(() => WishList)
  async addWishList(
    @Ctx() request: Request,
    @Arg('input') newItem : WishListInput
  ): Promise<WishList> {
    return new WishListService().getallWishList(request.user.accessToken)
  }
}
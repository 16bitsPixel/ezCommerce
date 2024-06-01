import { Query, Resolver, Ctx, Authorized} from "type-graphql"

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
}
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

import { Query, Resolver, Authorized, Ctx } from "type-graphql"
import type { NextApiRequest } from 'next'

import { Book } from "./schema"
import { BookService } from "./service"

@Resolver()
export class BookResolver {
  @Authorized("member")
  @Query(() => [Book])
  async book(
    @Ctx() request: NextApiRequest
  ): Promise<Book[]> {
    console.log(`User requesting books is: ${request.user.id})`)
    return new BookService().all()
  }
}

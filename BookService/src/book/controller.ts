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

import {
  Controller,
  Get,
  Query,
  Route,
} from 'tsoa'

import { Book } from '.'
import { BookService } from './service'

@Route('book')
export class BookController extends Controller {
  @Get('')
  public async getAll(
    @Query() author?: string,
  ): Promise<Book[]> {
    return new BookService().getAll(author)
  }
}

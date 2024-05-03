/*
#######################################################################
#
# Copyright (C) 2020-2022 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import type { Book } from './schema'

export class BookService{
  async all(): Promise<Book[]> {
    const res = await fetch('http://localhost:3012/api/v0/book')
    return res.json()
  }
}


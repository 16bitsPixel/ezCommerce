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

import { ISBN, Book } from '.'
import { pool } from '../db'

export class BookService {
  public async getAll(author?: string): Promise<Book[]> {
    let select = 'SELECT book FROM book'
    if (author) {
      select += ` WHERE book->>'author' ~* $1`
    }
    const query = {
      text: select,
      values: author ? [`${author}`] : [],
    }
    const {rows} = await pool.query(query)
    const books = []
    for (const row of rows) {
      books.push(row.book)
    }
    return books
  }
}

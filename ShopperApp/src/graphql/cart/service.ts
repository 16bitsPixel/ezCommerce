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

import type { CartItem } from './schema'

export class CartService {
  async getCart(): Promise<CartItem[]> {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3011/api/v0/Cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw res
            }
            return res.json()
          })
          .then((cart) => {
            resolve(cart)
          })
          .catch((err) => {
            // console.log(err)
            reject(new Error("Get Cart Error"))
          });
      });
  }
}

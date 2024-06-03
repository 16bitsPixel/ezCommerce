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

import type { Key } from './schema'

export class ApikeyService{
  async all(accessToken:string): Promise<Key[]> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3013/api/v0/vendor/api/all-keys', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res
          }
          return res.json()
        })
        .then((data) => {
          resolve(data)
        })
        .catch(() => {
          // console.log(err)
          reject(new Error("Get ALL API KEY Error"))
        });
    });
  }


  async create(accessToken: string): Promise<Key> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3013/api/v0/vendor/api/genrate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res
          }
          return res.json()
        })
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Create a NEW API KEY Error"))
        });
    });
  }
}
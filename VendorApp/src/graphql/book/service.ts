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
  async all(): Promise<Key[]> {
    const res = await fetch('http://localhost:3013/api/v0/vendor/api')
    return res.json()
  }

  async one(vendorId: string): Promise<Key[]> {
    const res = await fetch(`http://localhost:3013/api/v0/vendor/api?vendorid=${vendorId}`)
    return res.json()
  }

  async create(vendorId: string): Promise<string | undefined> {
    const res = await fetch('http://localhost:3013/api/v0/vendor/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vendorid: vendorId }),
    })

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    return res.json()
  }
  
}


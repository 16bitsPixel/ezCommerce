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

import type { Vendor } from './schema'

export class VendorService{
  async all(): Promise<Vendor[]> {
    const res = await fetch('http://localhost:3011/api/v0/Vendor', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.json()
  }
  async pendingall(): Promise<Vendor[]> {
    const res = await fetch('http://localhost:3011/api/v0/Vendor/Pending', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.json()
  }
  async accept(id:string): Promise<Vendor> {
    const res = await fetch('http://localhost:3011/api/v0/Verify/Vendor?vendorId='+id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.json()
  }
}


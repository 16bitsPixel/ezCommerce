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

import {Key} from './schema'
export class ApikeyService{
  async all(): Promise<Key[]> {
    const res = await fetch('http://localhost:3011/api/v0/vendor/api')
    return res.json()
  }
}


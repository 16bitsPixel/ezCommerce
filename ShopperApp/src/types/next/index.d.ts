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

export type SessionUser = {
  id: string
}

declare module 'next' {
  export interface NextApiRequest {
    user: SessionUser
  }
}

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

export interface Authenticated {
  id: string,
  name: string,
  accessToken: string
}

export interface Credentials {
  email: string,
  password: string
}

export type SessionUser = {
  id: string,
  role: string
}

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
  role: string,
  accessToken: string
}

export interface Credentials {
  email: string,
  password: string
}

export interface SignupCred {
  role: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string
}

export type SessionUser = {
  id: string,
  role: string
}



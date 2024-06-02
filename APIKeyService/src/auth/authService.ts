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

import * as jwt from "jsonwebtoken";

import {SessionUser} from '../types/express';
import { User } from ".";

export class AuthService {

  public async check(authHeader?: string, scopes?: string[]): Promise<SessionUser>  {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorised"));
      }
      else {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 
          `${process.env.MASTER_SECRET}`, 
          (err: jwt.VerifyErrors | null, decoded?: object | string) => 
          {
            const user = decoded as User
            if (err) {
              reject(err);
            } else if (scopes){
              for (const scope of scopes) {
                if (!user.role || !user.role.includes(scope)) {
                  reject(new Error("Unauthorised"));
                }
              }
            }
            resolve({email: user.email, name: user.name, id: user.id});
          });
      }
    });
  }
}

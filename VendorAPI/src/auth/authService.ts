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
import { User} from '.';


export class AuthService {

  public async check(authHeader?: string): Promise<SessionUser>  {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        return reject(new Error("Unauthorized"));
      }
  
      const token = authHeader.split(' ')[1];
      fetch('http://localhost:3013/api/v0/vendor/verify', {
        method: 'POST',
        body: JSON.stringify({ apikey: token }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((authenticated) => {
          console.log("Server replied", authenticated);
            console.log("secret: ", process.env.MASTER_SECRET)
          jwt.verify(token, `${process.env.MASTER_SECRET}`, (err: jwt.VerifyErrors | null, decoded?: object | string) => {
            if (err) {
              return reject(err);
            }
  
            const user = decoded as User;
            console.log("user: ", user)
            resolve({ email: user.email, name: user.name, id: user.id });
          });
        })
        .catch(() => {
          reject(new Error("Unauthorized"));
        });
    });
  }
}
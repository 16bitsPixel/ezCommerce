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
import { Authenticated, Credentials, SessionUser, SignupCred } from '.';
import { pool } from '../db';

interface Account {
  id: string,
  name: string,
  role: string
}

export class AccountService {
  private async find(creds: Credentials): Promise<Account|undefined> {
    let select = 
      ` SELECT jsonb_build_object('id', id, 'name', data->>'name', 'role', data->>'role')` +
      ` AS account FROM account` +
      ` WHERE data->>'email' = $1` +
      ` AND data->>'pwhash' = crypt($2,'87')`
    const query = {
      text: select,
      values: [creds.email, creds.password],
    };
    const {rows} = await pool.query(query)
    return rows.length === 1 ? rows[0].account : undefined
  }

  public async login(credentials: Credentials): Promise<Authenticated|undefined>  {
    const account = await this.find(credentials);
    if (account) {
      const accessToken = jwt.sign(
        {id: account.id, role: account.role}, 
        `${process.env.MASTER_SECRET}`, {
          expiresIn: '30m',
          algorithm: 'HS256'
        });
      return {id: account.id, name: account.name, accessToken: accessToken};
    } else {
      return undefined;
    }
  }

  public async check(accessToken: string): Promise<SessionUser>  {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(accessToken, 
          `${process.env.MASTER_SECRET}`, 
          (err: jwt.VerifyErrors | null, decoded?: object | string) => {
            if (err) {
              reject(err);
            } 
            const account = decoded as Account
            resolve({id: account.id, role: account.role});
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  public async Signup(cred: SignupCred): Promise<Boolean|undefined>  {
    let account = await this.find(cred);
    if (account) {
      return undefined;
    } else {
      let select = 
      `INSERT INTO account(data) VALUES jsonb_build_object('email', $1,'name', $2,'pwhash',crypt('$3','87'),'role','$4'));`
      let query = {
        text: select,
        values: [cred.email, `${cred.firstname} ${cred.lastname}`, cred.password, cred.role],
      };
      await pool.query(query);
      account = await this.find(cred);
      if (cred.role == 'vendor') {
        select = 
        `INSERT INTO vendor(vendor_id) VALUES $1;`
        query = {
          text: select,
          values: [account!.id],
        };
        await pool.query(query);
      }
      return true;
    }
  }

  public async isVerified(credentials: Credentials): Promise<Boolean|undefined>  {
    const account = await this.find(credentials);
    if (account) {
      let select = 
      `SELECT verified FROM vendor WHERE vendor_id = $1;`
      let query = {
        text: select,
        values: [account.id],
      };
      const res = await pool.query(query);
      return res.rows[0]?.verified === 't';
    } else {
      return undefined;
    }
  }
}
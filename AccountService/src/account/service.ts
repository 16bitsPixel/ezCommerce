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
import { Authenticated, CartAdd, CartItem, Credentials, SessionUser, SignupCred } from '.';
import { pool } from '../db';

interface Account {
  id: string,
  name: string,
  role: string
}

export class AccountService {
  private async find(creds: Credentials): Promise<Account|undefined> {
    const select = 
      ` SELECT jsonb_build_object('id', id, 'name', data->>'name', 'role', data->>'role')` +
      ` AS account FROM account` +
      ` WHERE data->>'email' = $1` +
      ` AND data->>'pwhash' = crypt($2,'87');`
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
      return {id: account.id, name: account.name, accessToken: accessToken, role: account.role};
    } else {
      return undefined;
    }
  }

  public async check(accessToken: string): Promise<SessionUser | undefined>  {
    return new Promise((resolve) => {
      try {
        jwt.verify(accessToken, 
          `${process.env.MASTER_SECRET}`, 
          (err: jwt.VerifyErrors | null, decoded?: object | string) => {
            if (err) {
              resolve(undefined);
            } 
            const account = decoded as Account
            resolve({id: account.id, role: account.role});
          });
      } catch (e) {
        resolve(undefined);
      }
    });
  }

  public async Signup(cred: SignupCred): Promise<boolean|undefined>  {
    let account = await this.find(cred);
    if (account) {
      return undefined;
    } else {
      let select = 
      `INSERT INTO account(data) VALUES (jsonb_build_object('email', $1::text,'name', $2::text,'pwhash',crypt($3::text,'87'),'role',$4::text));`
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

  public async isVerified(credentials: Credentials): Promise<boolean|undefined>  {
    const account = await this.find(credentials);
    if (account) {
      const select = 
      `SELECT verified FROM vendor WHERE vendor_id = $1;`
      const query = {
        text: select,
        values: [account.id],
      };
      const res = await pool.query(query);
      return res.rows[0]?.verified === true;
    } else {
      return undefined;
    }
  }

  public async getCart(accountId: string): Promise<CartItem[]> {
    const query = {
      text: `SELECT cart FROM account WHERE id = $1`,
      values: [accountId],
    };

    const {rows} = await pool.query(query);
    return rows[0];
  }

  public async addToCart(productAccountInfo: CartAdd): Promise<CartItem> {
    const { accountId, productId } = productAccountInfo;

    const update = `
      UPDATE account
      SET cart = COALESCE(cart, '[]'::jsonb) || jsonb_build_object('id', $2::text)
      WHERE id = $1
      RETURNING cart;
    `;

    const query = {
      text: update,
      values: [accountId, productId],
    };

    await pool.query(query);
    return {
      id: productId
    };
  }
}
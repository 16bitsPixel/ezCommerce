import { APIKey } from ".";
import { pool } from '../db';
import * as jwt from "jsonwebtoken";

export class ApiService {
  public async getkeys(): Promise<APIKey []>{
    const select = 
      ` SELECT * from APIKEYS;`
    const query = {
      text: select,
      values: [],
    };
    const {rows} = await pool.query(query)

    const result = [];
    for (const row of rows){
      result.push({id: row.id, key: row.apikey});
    }
    return result
  }

  public async getvendorkey(vendorid: string): Promise<APIKey []>{
    const select = 
      ` SELECT * from APIKEYS WHERE vendor = $1;`
    const query = {
      text: select,
      values: [vendorid],
    };
    const {rows} = await pool.query(query)

    const result = [];
    for (const row of rows){
      result.push({id: row.id, key: row.apikey});
    }
    return result
  }

  public async createkey(vendorid: string): Promise<string>{
    const apikey = jwt.sign(
      {id: vendorid}, 
      `${process.env.MASTER_SECRET}`, {
        expiresIn: '1y',
        algorithm: 'HS256'
      });
    let select = 
      `INSERT INTO APIKEYS(vendor, apikey) VALUES ($1, $2);`
    let query = {
      text: select,
      values: [vendorid, apikey],
    };
    await pool.query(query);
    return apikey
  }
}
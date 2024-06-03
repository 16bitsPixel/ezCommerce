import { APIKey } from ".";
import { pool } from '../db';
import * as jwt from "jsonwebtoken";

export class ApiService {

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

  public async createkey(email: string , name: string, id: string): Promise<APIKey>{
    const apikey = jwt.sign(
      {id: id , name: name, email: email}, 
      `${process.env.MASTER_SECRET}`, {
        expiresIn: '1y',
        algorithm: 'HS256'
      });
    const select = 
      `INSERT INTO APIKEYS(vendor, apikey) VALUES ($1, $2) RETURNING *;`
    const query = {
      text: select,
      values: [id, apikey],
    };
    const {rows} = await pool.query(query);
    return {id:rows[0].id, key: apikey}
  }
}
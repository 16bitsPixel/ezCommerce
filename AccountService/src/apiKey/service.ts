import { APIKey } from ".";
import { pool } from '../db';
export class ApiService {
  public async getkeys(): Promise<APIKey []>{
    const select = 
      ` SELECT * from APIKEYS`
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
}
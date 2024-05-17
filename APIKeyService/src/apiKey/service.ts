import { APIKey } from ".";
import { pool } from '../db';
export class ApiService {
  public async getkeys(): Promise<APIKey []>{
    const select = 
      ` SELECT * from APIKEYS;`
    const query = {
      text: select,
      values: [],
    };
    console.log("here num 1")
    const {rows} = await pool.query(query)
    console.log("here num 2")

    console.log("rows: ", rows)
    const result = [];
    for (const row of rows){
      result.push({id: row.id, key: row.apikey});
    }
    return result
  }
}
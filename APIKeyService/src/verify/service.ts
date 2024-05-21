import { pool } from '../db';
export class verificationService {
  public async verify(key: string): Promise<string| undefined>{
    const select = 
      ` SELECT apikey from APIKEYS where apikey = $1`
    const query = {
      text: select,
      values: [`${key}`],
    };
    const {rows} = await pool.query(query)
    if (rows[0]){
      return rows[0].apikey
    }
    else{
      return undefined
    }

  }
}
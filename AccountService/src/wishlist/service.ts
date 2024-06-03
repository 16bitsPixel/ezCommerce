import { Wishlist, inputWishlist } from '.';
import { pool } from '../db';
export class wishListService{
  public async addWishlist(account_id: string, wishlist: inputWishlist): Promise <Wishlist>{
    const select = `INSERT INTO wishlist (account_id, info)
        VALUES (
            $1, 
            jsonb_build_object(
                'Productname', $2::text,
                'Productid', $3::text,
                'description', $4::jsonb,
                'price', $5::numeric,
                'rating', $6::numeric,
                'images', $7::jsonb
            )
        )
        RETURNING *
        `
    const query = {
      text: select,
      values: [account_id, wishlist.Productname,wishlist.Productid, JSON.stringify(wishlist.description), wishlist.price, wishlist.rating, JSON.stringify(wishlist.images)]
    };
    const {rows} = await pool.query(query);
    return {id: rows[0].id, 
      Productname: rows[0].info.Productname,
      Productid: rows[0].info.Productid,
      description: rows[0].info.description,
      price: rows[0].info.price,
      rating: rows[0].info.rating,
      images: rows[0].info.images
    };
  }

  public async getWishList(user:string): Promise <Wishlist[]>{
    const select = 'SELECT * from wishlist where account_id = $1'
    const query = {
      text: select,
      values: [`${user}`]
    };
    const {rows} = await pool.query(query);
    const result = []
    for (const row of rows){
      result.push(row)
    }
    return result
  }
}
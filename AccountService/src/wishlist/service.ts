import { Wishlist, inputWishlist } from '.';
import { pool } from '../db';
export class wishListService{
  public async addWishlist(account_id: string, wishlist: inputWishlist): Promise <Wishlist>{
    const select = `INSERT INTO wishlist (account_id, info)
        VALUES (
            $1, 
            jsonb_build_object(
                'Productname', $2::text,
                'description', $3::text,
                'price', $4::numeric,
                'rating', $5::text,
                'images', $6::jsonb
            )
        )
        RETURNING *
        `
    const query = {
      text: select,
      values: [account_id, wishlist.Productname, wishlist.description, wishlist.price, wishlist.rating, JSON.stringify(wishlist.images)]
    };
          
    const {rows} = await pool.query(query);
    return {id: rows[0].id, 
      Productname: rows[0].info.Productname,
      description: rows[0].info.description,
      price: rows[0].info.price,
      rating: rows[0].info.rating,
      images: rows[0].info.images
    };
  }
}
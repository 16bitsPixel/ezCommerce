import { CartAdd, CartItem } from ".";
import { pool } from '../db';
export class CartService {
  public async getCart(accountId: string): Promise<CartItem[]> {
    const query = {
      text: `SELECT cart FROM account WHERE id = $1`,
      values: [accountId],
    };
    
    const {rows} = await pool.query(query);
    return rows[0];
  }
    
  public async addToCart(productAccountInfo: CartAdd, accountId: string): Promise<CartItem> {
    const {productId } = productAccountInfo;
    
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
      CartId: productId
    };
  }
}

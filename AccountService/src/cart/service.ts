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
    const {productId, quantity } = productAccountInfo;
    
    // query to get old cart
    const getCartQuery = {
      text: `SELECT cart FROM account WHERE id = $1`,
      values: [accountId],
    };
    const cartResult = await pool.query(getCartQuery);

    let newQuantity = quantity;

    // check if productid is in cart already
    const cart = cartResult.rows[0];

    // update quantity if in cart already
    let updated = false;
    for (const item of cart.cart) {
      if (item.id === productId) {
        item.quantity += quantity;
        newQuantity = item.quantity;
        updated = true;
        break;
      }
    }

    // else add to cart
    if (!updated) {
      cart.cart.push({
        id: productId,
        quantity: quantity
      });
    }

    // query to set cart::jsonb to the cart variable
    const update = `
        UPDATE account
        SET cart = $2::jsonb
        WHERE id = $1
        RETURNING cart
      `;
    const addToCartQuery = {
      text: update,
      values: [accountId, JSON.stringify(cart.cart)]
    };

    await pool.query(addToCartQuery);

    return {
      id: productId,
      quantity: newQuantity
    };
  }
}

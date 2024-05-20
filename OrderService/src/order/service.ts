import { UUID, Order } from '.'
import { pool } from '../db'

export class OrderService {
  public async get(orderId: UUID): Promise<Order | undefined> {
    const select = 'SELECT * FROM order WHERE id = $1';
    const query = {
      text: select,
      values: [orderId],
    };
    const {rows} = await pool.query(query);
    if (rows.length === 0) {
      return undefined;
    }
    return {
      order_id: rows[0].id,
      account_id: rows[0].data.account_id,
      product_id: rows[0].data.product_id,
      date: rows[0].data.date,
      status: rows[0].data.status,
    };
  }

  public async getAll(): Promise<Order[]> {
    const select = 'SELECT * FROM order ORDER BY date ASC';
    const query = {
      text: select,
      values: [],
    };
    const {rows} = await pool.query(query);
    const orders = [];

    for (const row of rows) {
      const order = row.order;
      order.id = row.id;
      orders.push(order)
    }
    return orders;
  }

  public async create(productId: any, request: any): Promise<Order | undefined> {
    const userId = request.user?.id;
    const select = `SELECT id, data FROM account WHERE id = $1`;
    const check = {
      text: select,
      values: [userId]
    }
    const {rows: checkRow} = await pool.query(check);
    if (!checkRow) {
      return undefined;
    }
    const current = new Date();
    const insert = `INSERT INTO order(account_id, product_id, data)
      VALUES ($1::uuid, $2::uuid, json_build_object(
      'date', $4::text,
      'status', 'pending',
    ))
    RETURNING *`;
    const query = {
      text: insert,
      values: [`${userId}`,
        `${productId}`,
       current.toISOString()],
    };
    const {rows} = await pool.query(query);
    return {order_id: rows[0].id,
      account_id: rows[0].data.account_id,
      product_id: rows[0].data.product_id,
      date: rows[0].data.date,
      status: rows[0].data.status,
    };
  }
}
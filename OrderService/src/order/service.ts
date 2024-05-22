import { UUID, Order , InputOrder} from '.'
import { pool } from '../db'

export class OrderService {
  public async get(orderId: UUID): Promise<Order | undefined> {
    const select = 'SELECT * FROM orders WHERE id = $1';
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
    const select = 'SELECT * FROM orders';
    // select += 'ORDER BY date ASC''
    const query = {
      text: select,
      values: [],
    };
    const {rows} = await pool.query(query);
    const orders: Order[] =  rows.map(row => ({
      order_id: row.id,
      account_id: row.account_id, 
      product_id: row.product_id,
      date: row.data.date,
      status: row.data.status,
    }));
    return orders;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create(neworder: InputOrder): Promise<Order | undefined> {
    const current = new Date();
    const insert = `
    INSERT INTO orders(account_id, product_id, data)
    VALUES ($1::uuid, $2::uuid, json_build_object(
      'date', $3::text,
      'status', '$4::timestamp'
    ))
    RETURNING *;
    `;
    const query = {
      text: insert,
      values: [`${neworder.account_id}`,
        `${neworder.product_id}`,
        current.toISOString()],
    };
    const {rows} = await pool.query(query);
    return {order_id: rows[0].id,
      account_id: rows[0].account_id,
      product_id: rows[0].product_id,
      date: rows[0].data.date,
      status: rows[0].data.status,
    };
  }
}